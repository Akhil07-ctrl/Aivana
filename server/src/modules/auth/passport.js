import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../user/user.model.js';
import { sendEmail, generateWelcomeEmail } from '../../utils/sendEmail.js';

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (user) return done(null, user);

        user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          user.googleId = profile.id;
          if (!user.avatar?.url) {
            user.avatar = { url: profile.photos[0]?.value || '', publicId: '' };
          }
          await user.save();
          return done(null, user);
        }

        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          avatar: { url: profile.photos[0]?.value || '', publicId: '' },
          isVerified: true,
        });

        // Send welcome email asynchronously
        sendEmail({
          to: user.email,
          subject: "Welcome to Aivana! 🎉",
          template: generateWelcomeEmail(user),
        }).catch((e) => console.error("[AUTH EMAIL ERROR]", e));

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export default passport;
