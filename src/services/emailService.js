/**
 * Email service for sending emails (mock implementation)
 * Real implementation would use SendGrid or another email service
 */
const { BadRequestError } = require('../utils/errors');

// Log warning that emails are being simulated
console.warn('Using mock email service. All emails will be simulated.');

class EmailService {
  /**
   * Send contact form email
   * @param {Object} contactData - Contact form data
   * @param {string} contactData.name - Sender's name
   * @param {string} contactData.email - Sender's email
   * @param {string} contactData.phone - Sender's phone (optional)
   * @param {string} contactData.subject - Email subject
   * @param {string} contactData.message - Email message
   * @returns {Promise<boolean>} True if email sent successfully
   */
  async sendContactFormEmail(contactData) {
    try {
      if (!contactData.name || !contactData.email || !contactData.message) {
        throw new BadRequestError('Name, email, and message are required fields');
      }

      // Create formatted email content
      const emailContent = this.formatContactFormEmail(contactData);
      
      // Create email message 
      const msg = {
        to: process.env.CONTACT_EMAIL || 'info@beatlenuttrails.com',
        from: process.env.FROM_EMAIL || 'noreply@beatlenuttrails.com', // Verified sender email
        subject: `Contact Form: ${contactData.subject || 'General Inquiry'}`,
        text: emailContent.text,
        html: emailContent.html,
        replyTo: contactData.email,
      };

      // Log the email that would be sent
      console.log('Email would be sent:', msg);
      
      // Simulate sending the email
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return true;
    } catch (error) {
      console.error('Email sending error:', error);
      throw error;
    }
  }

  /**
   * Format contact form email content
   * @param {Object} contactData - Contact form data
   * @returns {Object} Object with text and html versions of the email
   */
  formatContactFormEmail(contactData) {
    // Plain text version
    const text = `
New contact form submission from ${contactData.name}
Email: ${contactData.email}
${contactData.phone ? `Phone: ${contactData.phone}` : ''}
Subject: ${contactData.subject || 'General Inquiry'}

Message:
${contactData.message}
`;

    // HTML version
    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      color: #333;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    .header {
      background-color: #2A4030;
      color: white;
      padding: 10px 20px;
      border-radius: 5px 5px 0 0;
    }
    .content {
      padding: 20px;
    }
    .field {
      margin-bottom: 10px;
    }
    .label {
      font-weight: bold;
      margin-right: 10px;
    }
    .message {
      background-color: #f9f9f9;
      padding: 15px;
      border-radius: 5px;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>New Contact Form Submission</h2>
    </div>
    <div class="content">
      <div class="field">
        <span class="label">Name:</span>
        <span>${contactData.name}</span>
      </div>
      <div class="field">
        <span class="label">Email:</span>
        <span>${contactData.email}</span>
      </div>
      ${contactData.phone ? `
      <div class="field">
        <span class="label">Phone:</span>
        <span>${contactData.phone}</span>
      </div>` : ''}
      <div class="field">
        <span class="label">Subject:</span>
        <span>${contactData.subject || 'General Inquiry'}</span>
      </div>
      <div class="message">
        <h3>Message:</h3>
        <p>${contactData.message.replace(/\n/g, '<br>')}</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

    return { text, html };
  }

  /**
   * Send notification email to admin
   * @param {Object} data - Notification data
   * @returns {Promise<boolean>} True if email sent successfully
   */
  async sendAdminNotification(data) {
    try {
      // Create email message 
      const msg = {
        to: process.env.ADMIN_EMAIL || 'admin@beatlenuttrails.com',
        from: process.env.FROM_EMAIL || 'noreply@beatlenuttrails.com',
        subject: data.subject,
        text: data.message,
        html: data.html || data.message.replace(/\n/g, '<br>'),
      };

      // Log the notification that would be sent
      console.log('Admin notification would be sent:', msg);
      
      // Simulate sending the notification
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return true;
    } catch (error) {
      console.error('Admin email sending error:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();