/**
 * Contact form controller
 */
const emailService = require('../services/emailService');

const contactController = {
  /**
   * Submit contact form
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  submitContact: async (req, res, next) => {
    try {
      const { name, email, phone, subject, message } = req.body;
      
      // Send email
      await emailService.sendContactFormEmail({
        name,
        email,
        phone,
        subject,
        message
      });
      
      // Optional: Store contact form submission in database
      // const contact = await contactRepository.create({ name, email, phone, subject, message });
      
      // Send notification to admin for new contact form
      await emailService.sendAdminNotification({
        subject: 'New Contact Form Submission',
        message: `New contact form submission from ${name} (${email}). Subject: ${subject || 'General Inquiry'}`
      });
      
      // Return success response
      res.status(200).json({
        status: 'success',
        message: 'Contact form submitted successfully. We will get back to you soon.'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = contactController;