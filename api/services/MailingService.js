import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import fs from 'fs'
import { fileURLToPath } from 'url';
import path from 'path'
import { dirname } from 'path';
import handlebars from 'handlebars'

dotenv.config()
console.log('Company Name:', process.env.COMPANY_NAME);
console.log('Email From:', process.env.EMAIL_FROM);
console.log('Email Host:', process.env.EMAIL_HOST);
console.log('Email Port:', process.env.EMAIL_PORT);
console.log('Email User:', process.env.EMAIL_USER);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'systemsfloral@gmail.com',
    pass: 'txww jnvj bxhe suvn'
  },
   tls: {
    rejectUnauthorized: true
  } 
})

class MailingService {
  /**
   * Sends a password reset email
   * @param {string} email - Recipient email
   * @param {string} resetToken - Password reset token
   * @param {string} username - User's name
   * @returns {Promise<Object>} - Email sending result
   */
  static async sendPasswordResetEmail(email, resetToken, username) {
    try {
      const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
      
      const templateVars = {
        username: username || 'Valued Customer',
        resetLink,
        companyName: process.env.COMPANY_NAME || 'Our Company',
        supportEmail: process.env.SUPPORT_EMAIL || 'support@company.com',
        expiryTime: '1 hour', // Token expiry time
        year: new Date().getFullYear()
      };
      
      const htmlContent = await this.compileEmailTemplate('passwordReset', templateVars);
      
      const mailOptions = {
        from: `${process.env.COMPANY_NAME} <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: 'Password Reset Request',
        html: htmlContent
      };
      
      const result = await transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${email}: ${result.messageId}`);
      
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error(`Failed to send password reset email: ${error.message}`);
    }
  }
  
  /**
   * Sends an account verification email
   * @param {string} email - Recipient email
   * @param {string} verificationToken - Account verification token
   * @param {string} username - User's name
   * @returns {Promise<Object>} - Email sending result
   */
  static async sendVerificationEmail(email, verificationToken, username) {
    try {
      const verificationLink = `${process.env.CLIENT_URL}/verify-account?token=${verificationToken}`;
      
      const templateVars = {
        username: username || 'New User',
        verificationLink,
        companyName: process.env.COMPANY_NAME || 'Our Company',
        supportEmail: process.env.SUPPORT_EMAIL || 'support@company.com',
        year: new Date().getFullYear()
      };
      
      const htmlContent = await this.compileEmailTemplate('accountVerification', templateVars);
      
      const mailOptions = {
        from: `${process.env.COMPANY_NAME} <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: 'Verify Your Account',
        html: htmlContent
      };
      
      const result = await transporter.sendMail(mailOptions);
      console.log(`Verification email sent to ${email}: ${result.messageId}`);
      
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error(`Failed to send verification email: ${error.message}`);
    }
  }
  
  /**
   * Sends a new order confirmation email
   * @param {string} email - Recipient email
   * @param {Object} orderDetails - Order information
   * @returns {Promise<Object>} - Email sending result
   */
  static async sendNewOrderEmail(email, orderDetails) {
    try {
      console.log("[Email-1] Received order details:", orderDetails);
      
      const plainOrder = orderDetails.toObject ? orderDetails.toObject() : {...orderDetails};
      console.log("[Email-2] Plain order object:", plainOrder);
  
      const templateData = {
        ...plainOrder,
        orderId: plainOrder._id || 'Unknown',
        orderDate: new Date().toLocaleDateString()
      };
      console.log("[Email-3] Template data:", templateData);
  
      const htmlContent = await this.compileEmailTemplate('new-order', templateData);
      console.log("[Email-4] HTML content length:", htmlContent.length);
  
      const mailOptions = {
        from: `${process.env.COMPANY_NAME} <${process.env.EMAIL_FROM}>`,
        to: [email, 'tradingfloral@gmail.com'],
        subject: `Order Confirmation #${plainOrder._id}`,
        html: htmlContent,
        // Add text version for debugging
        text: `Order Confirmation\n\n${JSON.stringify(templateData, null, 2)}`
      };
  
      console.log("[Email-5] Mail options:", mailOptions);
      
      const result = await transporter.sendMail(mailOptions);
      console.log("[Email-6] Email sent successfully:", result.messageId);
      
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('[Email-ERROR] Error sending email:', error);
      throw error;
    }
  }
  /**
   * Sends an order cancellation confirmation email
   * @param {string} email - Recipient email
   * @param {Object} orderDetails - Order information
   * @returns {Promise<Object>} - Email sending result
   */
  static async sendOrderCancellationEmail(email, orderDetails) {
    try {
      const templateVars = {
        customerName: orderDetails.customerName || 'Valued Customer',
        orderId: orderDetails.orderId,
        cancellationDate: new Date().toLocaleDateString(),
        cancellationReason: orderDetails.cancellationReason || 'Customer request',
        refundAmount: orderDetails.refundAmount ? orderDetails.refundAmount.toFixed(2) : '0.00',
        refundMethod: orderDetails.refundMethod || 'Original payment method',
        estimatedRefundTime: orderDetails.estimatedRefundTime || '5-7 business days',
        companyName: process.env.COMPANY_NAME || 'Our Company',
        supportEmail: process.env.SUPPORT_EMAIL || 'support@company.com',
        year: new Date().getFullYear()
      };
      
      const htmlContent = await this.compileEmailTemplate('orderCancellation', templateVars);
      
      const mailOptions = {
        from: `${process.env.COMPANY_NAME} <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: `Order Cancellation #${orderDetails.orderId}`,
        html: htmlContent
      };
      
      const result = await transporter.sendMail(mailOptions);
      console.log(`Order cancellation email sent to ${email}: ${result.messageId}`);
      
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Error sending order cancellation email:', error);
      throw new Error(`Failed to send order cancellation email: ${error.message}`);
    }
  }
  
  /**
   * Sends a promotional email
   * @param {string|Array} emails - Recipient email(s)
   * @param {Object} campaignDetails - Promotional campaign details
   * @returns {Promise<Object>} - Email sending result
   */
  static async sendPromotionalEmail(emails, campaignDetails) {
    try {
      // Make sure emails is an array
      const recipients = Array.isArray(emails) ? emails : [emails];
      
      const templateVars = {
        campaignName: campaignDetails.name,
        heading: campaignDetails.heading,
        subheading: campaignDetails.subheading,
        promoCode: campaignDetails.promoCode,
        discountValue: campaignDetails.discountValue,
        expiryDate: campaignDetails.expiryDate,
        bannerImage: campaignDetails.bannerImage || `${process.env.CLIENT_URL}/images/promo-banner.jpg`,
        callToActionLink: campaignDetails.callToActionLink || process.env.CLIENT_URL,
        callToActionText: campaignDetails.callToActionText || 'Shop Now',
        companyName: process.env.COMPANY_NAME || 'Our Company',
        companyAddress: process.env.COMPANY_ADDRESS || '123 Business St, City, Country',
        unsubscribeLink: `${process.env.CLIENT_URL}/unsubscribe?email=[EMAIL]`,
        year: new Date().getFullYear()
      };
      
      const htmlContent = await this.compileEmailTemplate('promotional', templateVars);
      
      const mailOptions = {
        from: `${process.env.COMPANY_NAME} <${process.env.EMAIL_FROM}>`,
        to: recipients.join(','),
        subject: campaignDetails.subject || `Special Offer Inside!`,
        html: htmlContent
      };
      
      // Add optional headers for tracking if provided
      if (campaignDetails.trackingId) {
        mailOptions.headers = {
          'X-Campaign-ID': campaignDetails.trackingId
        };
      }
      
      const result = await transporter.sendMail(mailOptions);
      console.log(`Promotional email sent to ${recipients.length} recipients: ${result.messageId}`);
      
      return { success: true, messageId: result.messageId, recipientCount: recipients.length };
    } catch (error) {
      console.error('Error sending promotional email:', error);
      throw new Error(`Failed to send promotional email: ${error.message}`);
    }
  }
  
  // Helper methods
  
  /**
   * Compiles an email template with provided variables
   * @param {string} templateName - Name of the template file
   * @param {Object} variables - Template variables
   * @returns {Promise<string>} - Compiled HTML content
   */
  static async compileEmailTemplate(templateName, data) {
    try {
      const templatePath = path.join(__dirname, '..', 'templates', 'emails', `${templateName}.html`);
      const templateContent = await fs.promises.readFile(templatePath, 'utf8');
      const handlebarsInstance = handlebars.create({ strict: false });
      const template = handlebarsInstance.compile(templateContent, {
        noEscape: true,
        strict: false
      });
      return template(data);
    } catch (error) {
      console.error('Template compilation failed:', error);
      throw error;
    }
  }
  
  /**
   * Generates a basic email template as fallback
   * @param {string} templateType - Type of email template
   * @param {Object} variables - Template variables
   * @returns {string} - Basic HTML email content
   */
/*   static generateBasicTemplate(templateType, variables) {
    const companyName = variables.companyName || process.env.COMPANY_NAME || 'Our Company';
    const year = new Date().getFullYear();
    
    let title, content;
    
    switch (templateType) {
      case 'passwordReset':
        title = 'Password Reset';
        content = `
          <p>Hello ${variables.username},</p>
          <p>You have requested to reset your password. Please click the link below to set a new password:</p>
          <p><a href="${variables.resetLink}" style="display:inline-block;background:#4CAF50;color:white;padding:10px 20px;text-decoration:none;border-radius:4px;">Reset Password</a></p>
          <p>If you didn't request this, you can safely ignore this email.</p>
        `;
        break;
      case 'accountVerification':
        title = 'Verify Your Account';
        content = `
          <p>Hello ${variables.username},</p>
          <p>Thank you for registering. Please click the link below to verify your account:</p>
          <p><a href="${variables.verificationLink}" style="display:inline-block;background:#2196F3;color:white;padding:10px 20px;text-decoration:none;border-radius:4px;">Verify Account</a></p>
        `;
        break;
      case 'newOrder':
        title = `Order Confirmation #${variables.orderId}`;
        content = `
          <p>Hello ${variables.customerName},</p>
          <p>Thank you for your order! Your order #${variables.orderId} has been received and is being processed.</p>
          <p>Order Total: $${variables.total}</p>
          <p>Estimated Delivery: ${variables.estimatedDelivery}</p>
        `;
        break;
      case 'orderCancellation':
        title = `Order Cancellation #${variables.orderId}`;
        content = `
          <p>Hello ${variables.customerName},</p>
          <p>Your order #${variables.orderId} has been cancelled as requested.</p>
          <p>Refund Amount: $${variables.refundAmount}</p>
          <p>Refund Method: ${variables.refundMethod}</p>
          <p>Estimated Refund Time: ${variables.estimatedRefundTime}</p>
        `;
        break;
      case 'promotional':
        title = variables.heading || 'Special Offer';
        content = `
          <p>${variables.subheading || 'Check out our latest offers!'}</p>
          <p>Use code: <strong>${variables.promoCode || 'PROMO'}</strong> for ${variables.discountValue || 'special discount'}!</p>
          <p><a href="${variables.callToActionLink}" style="display:inline-block;background:#FF5722;color:white;padding:10px 20px;text-decoration:none;border-radius:4px;">${variables.callToActionText || 'Shop Now'}</a></p>
        `;
        break;
      default:
        title = 'Notification';
        content = `<p>This is a notification from ${companyName}.</p>`;
    }
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #444;">${companyName}</h1>
        </div>
        
        <div style="background: #f9f9f9; border-radius: 5px; padding: 20px; margin-bottom: 20px;">
          <h2 style="color: #555;">${title}</h2>
          ${content}
        </div>
        
        <div style="text-align: center; font-size: 12px; color: #777; margin-top: 30px; padding-top: 10px; border-top: 1px solid #eee;">
          <p>&copy; ${year} ${companyName}. All rights reserved.</p>
          <p>If you have any questions, please contact us at ${variables.supportEmail || 'support@company.com'}</p>
        </div>
      </body>
      </html>
    `;
  }
   */
  /**
   * Tests the email configuration by sending a test email
   * @param {string} testEmail - Email address to send test to
   * @returns {Promise<Object>} - Test result
   */
  static async testEmailConfiguration(testEmail) {
    try {
      const mailOptions = {
        from: `${process.env.COMPANY_NAME} <${process.env.EMAIL_FROM}>`,
        to: testEmail,
        subject: 'Email Configuration Test',
        html: `
          <h1>Email Configuration Test</h1>
          <p>This is a test email to verify that your email configuration is working correctly.</p>
          <p>Timestamp: ${new Date().toISOString()}</p>
        `
      };
      
      const result = await transporter.sendMail(mailOptions);
      console.log(`Test email sent to ${testEmail}: ${result.messageId}`);
      
      return { 
        success: true, 
        messageId: result.messageId,
        details: {
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT,
          user: process.env.EMAIL_USER,
          from: process.env.EMAIL_FROM
        }
      };
    } catch (error) {
      console.error('Email configuration test failed:', error);
      throw new Error(`Email configuration test failed: ${error.message}`);
    }
  }
}

export default MailingService;