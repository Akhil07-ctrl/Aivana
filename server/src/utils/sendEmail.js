import brevo from '@getbrevo/brevo';

// Initialize Brevo API client
const defaultClient = brevo.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new brevo.TransactionalEmailsApi();

const senderEmail = process.env.BREVO_SENDER_EMAIL || 'noreply@aivana.com';
const senderName = process.env.BREVO_SENDER_NAME || 'Aivana';
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

/**
 * Utility to send emails via Brevo (formerly Sendinblue).
 * 
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject line
 * @param {string} options.template - HTML template string
 * @returns {Promise<boolean>} - Success status
 */
export const sendEmail = async ({ to, subject, template }) => {
  try {
    if (!process.env.BREVO_API_KEY) {
      console.warn('[EMAIL WARNING] BREVO_API_KEY not configured. Email not sent.');
      return false;
    }

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = template;
    sendSmtpEmail.sender = { name: senderName, email: senderEmail };
    sendSmtpEmail.to = [{ email: to }];

    await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log(`[EMAIL SENT] ✅ Email sent to: ${to}`);
    return true;
  } catch (error) {
    console.error(`[EMAIL ERROR] Failed to send email to ${to}:`, error.message);
    return false;
  }
};
// Helper for common email styles and layout
const emailLayout = (content) => `
  <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff; color: #1a1a1a;">
    <div style="margin-bottom: 40px; text-align: center;">
      <h1 style="font-size: 28px; font-weight: 300; letter-spacing: 2px; margin: 0; text-transform: uppercase;">Aivana</h1>
    </div>
    <div style="line-height: 1.6; font-size: 16px;">
      ${content}
    </div>
    <div style="margin-top: 60px; padding-top: 30px; border-top: 1px solid #f0f0f0; text-align: center; font-size: 12px; color: #888; letter-spacing: 1px; text-transform: uppercase;">
      &copy; ${new Date().getFullYear()} Aivana. All rights reserved.
    </div>
  </div>
`;

export const generateWelcomeEmail = (user) => {
  return emailLayout(`
    <p>Dear ${user?.name},</p>
    <p>Welcome to Aivana. We are pleased to have you join our community.</p>
    <p>Your account is now active, providing you with full access to our curated collections and personalized styling services.</p>
    <div style="margin: 30px 0; padding: 25px; background-color: #fcfcfc; border: 1px solid #f0f0f0; border-radius: 4px;">
      <p style="margin-top: 0; font-weight: 600;">Account Benefits:</p>
      <ul style="padding-left: 20px; margin-bottom: 0;">
        <li>Priority access to new collections</li>
        <li>Order tracking and history</li>
        <li>Personalized AI-driven styling recommendations</li>
        <li>Simplified checkout process</li>
      </ul>
    </div>
    <div style="margin: 40px 0; text-align: center;">
      <a href="${clientUrl}/shop" style="display: inline-block; padding: 16px 36px; background-color: #1a1a1a; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; border-radius: 4px;">Start Shopping</a>
    </div>
    <p>We look forward to providing you with an exceptional shopping experience.</p>
    <p style="margin-top: 40px;">Best regards,<br>The Aivana Team</p>
  `);
};

export const generateOrderConfirmationEmail = (order, user) => {
  const orderNumber = order._id.toString().substring(order._id.toString().length - 8).toUpperCase();
  return emailLayout(`
    <p>Dear ${user?.name},</p>
    <p>Thank you for your order. We have received your request and are currently processing it for shipment.</p>
    
    <div style="margin: 30px 0; padding: 25px; border: 1px solid #1a1a1a; border-radius: 4px;">
      <p style="margin: 0 0 15px 0; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; font-size: 14px;">Order Summary</p>
      <table style="width: 100%; font-size: 14px;">
        <tr>
          <td style="padding: 5px 0; color: #666;">Order Number:</td>
          <td style="padding: 5px 0; text-align: right; font-weight: 600;">#${orderNumber}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #666;">Total Amount:</td>
          <td style="padding: 5px 0; text-align: right; font-weight: 600;">₹${order.totalPrice.toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #666;">Items:</td>
          <td style="padding: 5px 0; text-align: right;">${order.orderItems.length} item(s)</td>
        </tr>
      </table>
    </div>

    <div style="margin: 40px 0; text-align: center;">
      <a href="${clientUrl}/profile#orders" style="display: inline-block; padding: 16px 36px; background-color: #1a1a1a; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; border-radius: 4px;">View Order Status</a>
    </div>

    <p>You will receive a subsequent notification once your order has been dispatched with tracking details.</p>
    <p style="margin-top: 40px;">Best regards,<br>The Aivana Operations Team</p>
  `);
};

export const generateShipmentConfirmationEmail = (order, shipmentData, user) => {
  const orderNumber = order._id.toString().substring(order._id.toString().length - 8).toUpperCase();
  return emailLayout(`
    <p>Dear ${user?.name},</p>
    <p>Your order has been dispatched and is currently in transit.</p>
    
    <div style="margin: 30px 0; padding: 25px; background-color: #fcfcfc; border: 1px solid #f0f0f0; border-radius: 4px;">
      <p style="margin: 0 0 15px 0; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; font-size: 14px;">Shipping Information</p>
      <table style="width: 100%; font-size: 14px;">
        <tr>
          <td style="padding: 5px 0; color: #666;">Order Number:</td>
          <td style="padding: 5px 0; text-align: right; font-weight: 600;">#${orderNumber}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #666;">Courier:</td>
          <td style="padding: 5px 0; text-align: right;">${shipmentData.courier_name || 'Standard Delivery'}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #666;">Tracking ID (AWB):</td>
          <td style="padding: 5px 0; text-align: right; font-weight: 600;">${shipmentData.awb_code || 'N/A'}</td>
        </tr>
      </table>
    </div>

    <div style="margin: 40px 0; text-align: center;">
      <a href="${clientUrl}/profile#orders" style="display: inline-block; padding: 16px 36px; background-color: #1a1a1a; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; border-radius: 4px;">Track Package</a>
    </div>

    <p>Please use the Tracking ID provided above on the courier's official portal for real-time updates regarding your delivery.</p>
    <p style="margin-top: 40px;">Best regards,<br>The Aivana Logistics Team</p>
  `);
};

export const generateOrderDeliveredEmail = (order, user) => {
  const orderNumber = order._id.toString().substring(order._id.toString().length - 8).toUpperCase();
  return emailLayout(`
    <p>Dear ${user?.name},</p>
    <p>Our records indicate that your order has been successfully delivered.</p>
    
    <div style="margin: 30px 0; padding: 20px; border: 1px solid #f0f0f0; border-radius: 4px; text-align: center;">
      <p style="margin: 0; color: #666; font-size: 14px;">Order Reference</p>
      <p style="margin: 5px 0 0 0; font-weight: 600;">#${orderNumber}</p>
    </div>

    <div style="margin: 40px 0; text-align: center;">
      <a href="${clientUrl}/shop" style="display: inline-block; padding: 16px 36px; background-color: #1a1a1a; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; border-radius: 4px;">Browse New Arrivals</a>
    </div>

    <p>We hope the items meet your expectations. If you require any assistance with your purchase, please contact our support team.</p>
    <p style="margin-top: 40px;">Best regards,<br>The Aivana Support Team</p>
  `);
};

export const generateOtpEmail = (otp, user) => {
  return emailLayout(`
    <p>Dear ${user?.name},</p>
    <p>We have received a request to reset the password associated with your Aivana account.</p>
    
    <div style="margin: 40px 0; padding: 40px 20px; background-color: #fcfcfc; border: 1px solid #f0f0f0; border-radius: 4px; text-align: center;">
      <p style="margin: 0 0 15px 0; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 2px;">Verification Code</p>
      <p style="margin: 0; font-size: 42px; font-weight: 300; letter-spacing: 12px; color: #1a1a1a;">${otp}</p>
    </div>

    <p style="font-size: 14px; color: #666;">
      This verification code is valid for 10 minutes. If you did not initiate this request, please secure your account or contact our security department immediately.
    </p>
    <p style="margin-top: 40px;">Best regards,<br>The Aivana Security Team</p>
  `);
};

export const generateRefundEmail = (order, amount, user) => {
  const orderNumber = order._id.toString().substring(order._id.toString().length - 8).toUpperCase();
  return emailLayout(`
    <p>Dear ${user?.name},</p>
    <p>This email confirms that a refund has been processed for your recent order.</p>
    
    <div style="margin: 30px 0; padding: 25px; background-color: #fcfcfc; border: 1px solid #f0f0f0; border-radius: 4px;">
      <p style="margin: 0 0 15px 0; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; font-size: 14px;">Refund Details</p>
      <table style="width: 100%; font-size: 14px;">
        <tr>
          <td style="padding: 5px 0; color: #666;">Order Number:</td>
          <td style="padding: 5px 0; text-align: right; font-weight: 600;">#${orderNumber}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #666;">Refund Amount:</td>
          <td style="padding: 5px 0; text-align: right; font-weight: 600;">₹${amount.toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #666;">Status:</td>
          <td style="padding: 5px 0; text-align: right; color: #22c55e;">Completed</td>
        </tr>
      </table>
    </div>

    <div style="margin: 40px 0; text-align: center;">
      <a href="${clientUrl}/shop" style="display: inline-block; padding: 16px 36px; background-color: #1a1a1a; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; border-radius: 4px;">Continue Shopping</a>
    </div>

    <p>The funds should appear in your original payment method within 5-7 business days, depending on your bank's processing times.</p>
    <p style="margin-top: 40px;">Best regards,<br>The Aivana Billing Team</p>
  `);
};

