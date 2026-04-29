import brevo from '@getbrevo/brevo';

// Initialize Brevo API client
const defaultClient = brevo.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new brevo.TransactionalEmailsApi();

const senderEmail = process.env.BREVO_SENDER_EMAIL || 'noreply@aivana.com';
const senderName = process.env.BREVO_SENDER_NAME || 'Aivana';

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

export const generateWelcomeEmail = (user) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h1 style="color: #333; text-align: center;">Welcome to Aivana! 🎉</h1>
        <p style="font-size: 16px; color: #555; line-height: 1.6;">Hi ${user?.name},</p>
        <p style="font-size: 16px; color: #555; line-height: 1.6;">
          Thank you for joining Aivana! We're thrilled to have you as part of our fashion community.
        </p>
        <p style="font-size: 16px; color: #555; line-height: 1.6;">
          You can now:
          <ul>
            <li>Browse our curated fashion collection</li>
            <li>Create wishlists and save your favorites</li>
            <li>Track your orders in real-time</li>
            <li>Get personalized product recommendations with our AI chatbot</li>
          </ul>
        </p>
        <p style="font-size: 16px; color: #555; line-height: 1.6;">
          Start shopping now and enjoy exclusive benefits!
        </p>
        <p style="font-size: 14px; color: #999; text-align: center; margin-top: 30px;">
          XOXO, The Aivana Styling Team ✨
        </p>
      </div>
    </div>
  `;
};

export const generateOrderConfirmationEmail = (order, user) => {
  const orderNumber = order._id.toString().substring(order._id.toString().length - 8).toUpperCase();
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h1 style="color: #333; text-align: center;">Order Confirmed! 🛍️</h1>
        <p style="font-size: 16px; color: #555; line-height: 1.6;">Hi ${user?.name},</p>
        <p style="font-size: 16px; color: #555; line-height: 1.6;">
          Thank you for your order! We're excited to get your items to you.
        </p>
        
        <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Order Number:</strong> #${orderNumber}</p>
          <p style="margin: 5px 0;"><strong>Total Amount:</strong> ₹${order.totalPrice.toFixed(2)}</p>
          <p style="margin: 5px 0;"><strong>Items:</strong> ${order.orderItems.length} item(s)</p>
        </div>

        <p style="font-size: 16px; color: #555; line-height: 1.6;">
          <strong>What's next?</strong><br>
          Your order is being processed and will ship within 24 hours. You'll receive a tracking update via email as soon as your package is on its way!
        </p>

        <p style="font-size: 14px; color: #999; text-align: center; margin-top: 30px;">
          XOXO, The Aivana Styling Team ✨
        </p>
      </div>
    </div>
  `;
};

export const generateShipmentConfirmationEmail = (order, shipmentData, user) => {
  const orderNumber = order._id.toString().substring(order._id.toString().length - 8).toUpperCase();
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h1 style="color: #333; text-align: center;">Your Order is Shipped! 📦</h1>
        <p style="font-size: 16px; color: #555; line-height: 1.6;">Hi ${user?.name},</p>
        <p style="font-size: 16px; color: #555; line-height: 1.6;">
          Great news! Your order has been shipped and is on its way to you!
        </p>
        
        <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Order Number:</strong> #${orderNumber}</p>
          <p style="margin: 5px 0;"><strong>Courier:</strong> ${shipmentData.courier_name || 'Express Delivery'}</p>
          <p style="margin: 5px 0;"><strong>AWB Code:</strong> ${shipmentData.awb_code || 'N/A'}</p>
          <p style="margin: 5px 0;"><strong>Status:</strong> ${shipmentData.status || 'In Transit'}</p>
        </div>

        <p style="font-size: 16px; color: #555; line-height: 1.6;">
          <strong>Track Your Package:</strong><br>
          You can track your shipment using the AWB code above on the courier's website for real-time updates.
        </p>

        <p style="font-size: 14px; color: #999; text-align: center; margin-top: 30px;">
          XOXO, The Aivana Styling Team ✨
        </p>
      </div>
    </div>
  `;
};

export const generateOrderDeliveredEmail = (order, user) => {
  const orderNumber = order._id.toString().substring(order._id.toString().length - 8).toUpperCase();
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h1 style="color: #333; text-align: center;">Order Delivered! 🎉</h1>
        <p style="font-size: 16px; color: #555; line-height: 1.6;">Hi ${user?.name},</p>
        <p style="font-size: 16px; color: #555; line-height: 1.6;">
          Your order has been successfully delivered! We hope you love your new items from Aivana!
        </p>
        
        <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Order Number:</strong> #${orderNumber}</p>
        </div>

        <p style="font-size: 16px; color: #555; line-height: 1.6;">
          <strong>Share Your Feedback:</strong><br>
          We'd love to hear from you! Please rate and review the items to help us serve you better and help other customers.
        </p>

        <p style="font-size: 14px; color: #999; text-align: center; margin-top: 30px;">
          XOXO, The Aivana Styling Team ✨
        </p>
      </div>
    </div>
  `;
};
