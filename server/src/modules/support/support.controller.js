import asyncHandler from '../../utils/asyncHandler.js';
import ApiError from '../../utils/ApiError.js';
import ApiResponse from '../../utils/ApiResponse.js';
import { sendEmail, generateContactEmail } from '../../utils/sendEmail.js';

/**
 * @desc    Handle Contact Us form submission
 * @route   POST /api/support/contact
 * @access  Public
 */
export const contactUs = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    throw new ApiError(400, 'Name, email and message are required');
  }

  // Send email to the company support email
  const supportEmail = process.env.SUPPORT_EMAIL || process.env.BREVO_SENDER_EMAIL;
  
  if (!supportEmail) {
    throw new ApiError(500, 'Support email is not configured');
  }

  const emailContent = generateContactEmail({ name, email, subject, message });
  
  const sent = await sendEmail({
    to: supportEmail,
    subject: `New Inquiry from ${name}: ${subject || 'General'}`,
    template: emailContent
  });

  if (!sent) {
    throw new ApiError(500, 'Failed to send your message. Please try again later.');
  }

  res.status(200).json(
    new ApiResponse(200, null, 'Your message has been sent successfully. We will get back to you soon.')
  );
});
