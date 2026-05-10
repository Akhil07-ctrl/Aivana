import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import User from "../user/user.model.js";
import {
  generateAccessToken,
  setTokenCookie,
  clearTokenCookie,
} from "../../utils/generateToken.js";
import {
  sendEmail,
  generateWelcomeEmail,
  generateOtpEmail,
} from "../../utils/sendEmail.js";
import { OAuth2Client } from "google-auth-library";
import admin from "../../config/firebase.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc  Register new user
// @route POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    throw new ApiError(400, "Please provide name, email and password");

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new ApiError(
      400,
      "Password must be at least 8 characters and include both letters and numbers",
    );
  }

  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(409, "Email already registered");

  const user = await User.create({ name, email, password });

  const token = generateAccessToken(user._id, user.role);
  setTokenCookie(res, token);

  // Send welcome email asynchronously
  sendEmail({
    to: user.email,
    subject: "Welcome to Aivana! 🎉",
    template: generateWelcomeEmail(user),
  }).catch((e) => console.error("[AUTH EMAIL ERROR]", e));

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      "Registered successfully",
    ),
  );
});

// @desc  Login user
// @route POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new ApiError(400, "Email and password are required");

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password)))
    throw new ApiError(401, "Invalid credentials");

  if (!user.isActive)
    throw new ApiError(403, "Your account has been deactivated");

  const token = generateAccessToken(user._id, user.role);
  setTokenCookie(res, token);

  return res.json(
    new ApiResponse(
      200,
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      "Logged in successfully",
    ),
  );
});

// @desc  Logout user
// @route POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  clearTokenCookie(res);
  return res.json(new ApiResponse(200, null, "Logged out successfully"));
});

// @desc  Get current user
// @route GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  return res.json(new ApiResponse(200, user, "User fetched"));
});

// @desc  Google OAuth callback handler
// @route GET /api/auth/google/callback  (after passport redirect)
export const googleAuthCallback = asyncHandler(async (req, res) => {
  const user = req.user;
  const token = generateAccessToken(user._id, user.role);
  setTokenCookie(res, token);
  // Redirect to frontend
  res.redirect(`${process.env.CLIENT_URL}/oauth-success`);
});

// @desc  Forgot password (Generate OTP)
// @route POST /api/auth/forgot-password
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) throw new ApiError(400, "Please provide an email address");

  const user = await User.findOne({ email });
  if (!user) {
    // Return 200 even if user not found to prevent email enumeration attacks
    return res.json(
      new ApiResponse(
        200,
        null,
        "If that email is registered, an OTP has been sent.",
      ),
    );
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Save OTP and expiry (10 minutes from now)
  user.resetPasswordOtp = otp;
  user.resetPasswordOtpExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  // Send Email
  try {
    const isSent = await sendEmail({
      to: user.email,
      subject: "Aivana Password Reset OTP 🔐",
      template: generateOtpEmail(otp, user),
    });

    if (!isSent) {
      throw new Error("Email service failed to send");
    }

    res.json(new ApiResponse(200, null, "OTP sent to email successfully"));
  } catch (error) {
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpires = undefined;
    await user.save({ validateBeforeSave: false });

    throw new ApiError(
      500,
      "There was an error sending the email. Please check your email service configuration.",
    );
  }
});

// @desc  Reset password using OTP
// @route POST /api/auth/reset-password
export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    throw new ApiError(400, "Please provide email, OTP, and new password");
  }

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    throw new ApiError(
      400,
      "Password must be at least 8 characters and include both letters and numbers",
    );
  }

  const user = await User.findOne({
    email,
    resetPasswordOtp: otp,
    resetPasswordOtpExpires: { $gt: Date.now() },
  }).select("+password");

  if (!user) {
    throw new ApiError(400, "OTP is invalid or has expired");
  }

  // Update password and clear OTP fields
  user.password = newPassword;
  user.resetPasswordOtp = undefined;
  user.resetPasswordOtpExpires = undefined;
  await user.save();

  res.json(
    new ApiResponse(200, null, "Password reset successful. You can now login."),
  );
});

// @desc  Login/Register using Firebase Phone Auth
// @route POST /api/auth/firebase-login
export const firebasePhoneAuth = asyncHandler(async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) throw new ApiError(400, "Firebase ID token is required");
  if (!admin)
    throw new ApiError(500, "Firebase Admin SDK not initialized on server");

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { phone_number, uid } = decodedToken;

    if (!phone_number)
      throw new ApiError(400, "Token does not contain a phone number");

    let user = await User.findOne({
      $or: [{ phone: phone_number }, { firebaseUid: uid }],
    });

    if (user) {
      if (!user.firebaseUid) {
        user.firebaseUid = uid;
        await user.save();
      }

      const token = generateAccessToken(user._id, user.role);
      setTokenCookie(res, token);

      return res.json(
        new ApiResponse(
          200,
          {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
          },
          "Logged in via Phone successfully",
        ),
      );
    } else {
      user = await User.create({
        name: "New User", // Placeholder for new phone registration
        phone: phone_number,
        firebaseUid: uid,
      });

      const token = generateAccessToken(user._id, user.role);
      setTokenCookie(res, token);

      return res.status(201).json(
        new ApiResponse(
          201,
          {
            _id: user._id,
            name: user.name,
            phone: user.phone,
            role: user.role,
            isNewUser: true,
          },
          "Account created via Phone",
        ),
      );
    }
  } catch (error) {
    throw new ApiError(401, "Invalid Firebase token: " + error.message);
  }
});

// @desc  Link Phone to existing account
// @route POST /api/auth/link-phone
export const linkPhone = asyncHandler(async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) throw new ApiError(400, "Firebase ID token is required");
  if (!admin)
    throw new ApiError(500, "Firebase Admin SDK not initialized on server");

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { phone_number, uid } = decodedToken;

    if (!phone_number)
      throw new ApiError(400, "Token does not contain a phone number");

    const exists = await User.findOne({
      phone: phone_number,
      _id: { $ne: req.user._id },
    });
    if (exists) {
      throw new ApiError(
        409,
        "This phone number is already linked to another account",
      );
    }

    const user = await User.findById(req.user._id);
    user.phone = phone_number;
    user.firebaseUid = uid;
    await user.save();

    return res.json(
      new ApiResponse(200, user, "Phone number linked successfully"),
    );
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(401, "Invalid Firebase token: " + error.message);
  }
});
// @desc  Google One Tap / ID Token Login
// @route POST /api/auth/google-one-tap
export const googleOneTap = asyncHandler(async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    throw new ApiError(400, "Google credential is required");
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      throw new ApiError(400, "Email not provided by Google");
    }

    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      // Update googleId if not present
      if (!user.googleId) {
        user.googleId = googleId;
      }
      // Update avatar if not present
      if (!user.avatar?.url && picture) {
        user.avatar = { url: picture, publicId: "" };
      }
      user.isVerified = true;
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        name,
        email,
        googleId,
        avatar: { url: picture || "", publicId: "" },
        isVerified: true,
      });
    }

    const token = generateAccessToken(user._id, user.role);
    setTokenCookie(res, token);

    return res.json(
      new ApiResponse(
        200,
        {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
        "Logged in via Google successfully",
      ),
    );
  } catch (error) {
    throw new ApiError(401, "Invalid Google token: " + error.message);
  }
});
