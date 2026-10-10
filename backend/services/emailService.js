const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null; // SMTP not configured
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  });
};

/**
 * Send notification email when a contact form is submitted
 */
const sendContactNotification = async ({ name, email, subject, message }) => {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.log('[Email Service] SMTP credentials not set (SMTP_USER/SMTP_PASS). Message saved to DB only.');
    return false;
  }

  const recipient = process.env.CONTACT_NOTIFICATION_EMAIL || process.env.SMTP_USER;

  const mailOptions = {
    from: `"Portfolio Contact Form" <${process.env.SMTP_USER}>`,
    to: recipient,
    replyTo: `"${name}" <${email}>`,
    subject: `[Portfolio Inquiry] ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; rounded: 12px;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 8px;">New Contact Message Received</h2>
        <p>You have received a new message via your portfolio contact form:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 100px;">From Name:</td>
            <td style="padding: 8px;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Sender Email:</td>
            <td style="padding: 8px;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Subject:</td>
            <td style="padding: 8px;">${subject}</td>
          </tr>
        </table>
        <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #2563eb; border-radius: 4px; margin-top: 15px;">
          <h4 style="margin-top: 0; color: #475569;">Message:</h4>
          <p style="white-space: pre-wrap; margin-bottom: 0;">${message}</p>
        </div>
        <hr style="margin-top: 30px; border: none; border-top: 1px solid #e0e0e0;" />
        <p style="font-size: 12px; color: #6b7280; text-align: center;">Anuj Nigam Portfolio System Notification</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('[Email Service] Email sent successfully: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('[Email Service] Failed to send email via Nodemailer:', error);
    return false;
  }
};

module.exports = {
  sendContactNotification,
};
