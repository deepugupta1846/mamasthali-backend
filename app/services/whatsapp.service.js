const axios = require('axios');

/**
 * WhatsApp Service
 * Supports multiple providers:
 * 1. Twilio WhatsApp API
 * 2. WhatsApp Business API (via API Gateway)
 * 3. Custom WhatsApp API endpoint
 */

class WhatsAppService {
  constructor() {
    // Configuration from environment variables
    this.provider = process.env.WHATSAPP_PROVIDER || ''; // 'twilio', 'custom', or 'business-api'
    this.twilioAccountSid = process.env.TWILIO_ACCOUNT_SID || '';
    this.twilioAuthToken = process.env.TWILIO_AUTH_TOKEN || '';
    this.twilioFromNumber = process.env.TWILIO_WHATSAPP_FROM || ''; // Format: whatsapp:+14155238886
    this.customApiUrl = process.env.WHATSAPP_API_URL;
    this.customApiKey = process.env.WHATSAPP_API_KEY;
    this.adminWhatsAppNumber = process.env.ADMIN_WHATSAPP_NUMBER || '';
  }

  /**
   * Format phone number for WhatsApp (remove spaces, ensure country code)
   */
  formatPhoneNumber(phone) {
    if (!phone) return null;
    
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');
    
    // If number starts with 0, remove it
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }
    
    // If doesn't start with country code, assume India (+91)
    if (!cleaned.startsWith('91') && cleaned.length === 10) {
      cleaned = '91' + cleaned;
    }
    
    return cleaned;
  }

  /**
   * Send WhatsApp message via Twilio
   */
  async sendViaTwilio(to, message) {
    try {
      if (!this.twilioAccountSid || !this.twilioAuthToken || !this.twilioFromNumber) {
        throw new Error('Twilio credentials not configured');
      }

      const formattedTo = this.formatPhoneNumber(to);
      if (!formattedTo) {
        throw new Error('Invalid phone number');
      }

      const response = await axios.post(
        `https://api.twilio.com/2010-04-01/Accounts/${this.twilioAccountSid}/Messages.json`,
        new URLSearchParams({
          From: this.twilioFromNumber,
          To: `whatsapp:+${formattedTo}`,
          Body: message,
        }),
        {
          auth: {
            username: this.twilioAccountSid,
            password: this.twilioAuthToken,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      return { success: true, messageId: response.data.sid };
    } catch (error) {
      console.error('Twilio WhatsApp Error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Send WhatsApp message via custom API
   */
  async sendViaCustomAPI(to, message) {
    try {
      if (!this.customApiUrl) {
        throw new Error('Custom WhatsApp API URL not configured');
      }

      const formattedTo = this.formatPhoneNumber(to);
      if (!formattedTo) {
        throw new Error('Invalid phone number');
      }

      const response = await axios.post(
        this.customApiUrl,
        {
          to: `+${formattedTo}`,
          message: message,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            ...(this.customApiKey && { 'Authorization': `Bearer ${this.customApiKey}` }),
          },
        }
      );

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Custom WhatsApp API Error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Send WhatsApp message (main method)
   */
  async sendMessage(to, message) {
    try {
      switch (this.provider) {
        case 'twilio':
          return await this.sendViaTwilio(to, message);
        case 'custom':
          return await this.sendViaCustomAPI(to, message);
        default:
          // Fallback: Log message (for development/testing)
          console.log(`[WhatsApp Message (${this.provider})]`);
          console.log(`To: ${to}`);
          console.log(`Message: ${message}`);
          return { success: true, message: 'Message logged (no provider configured)' };
      }
    } catch (error) {
      console.error('WhatsApp Send Error:', error);
      // Don't throw error - order should still be created even if WhatsApp fails
      return { success: false, error: error.message };
    }
  }

  /**
   * Send order notification to admin
   */
  async sendOrderNotificationToAdmin(order, user) {
    try {
      if (!this.adminWhatsAppNumber) {
        console.log('Admin WhatsApp number not configured, skipping notification');
        return { success: false, message: 'Admin number not configured' };
      }

      const message = `🍽️ *New Order Received*\n\n` +
        `Order ID: #${order.id}\n` +
        `Customer: ${user.full_name || 'N/A'}\n` +
        `Phone: ${user.phone || 'N/A'}\n` +
        `Meal Type: ${order.meal_type || 'N/A'}\n` +
        `Quantity: ${order.quantity || 1}\n` +
        `Amount: ₹${order.total_amount || 0}\n` +
        `Delivery Date: ${order.delivery_date || 'N/A'}\n` +
        `Delivery Time: ${order.delivery_time || 'N/A'}\n` +
        `Address: ${order.address || 'N/A'}\n\n` +
        `Order Status: ${order.order_status || 'placed'}\n` +
        `Payment Status: ${order.payment_status || 'pending'}`;

      return await this.sendMessage(this.adminWhatsAppNumber, message);
    } catch (error) {
      console.error('Error sending order notification to admin:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send order confirmation to user
   */
  async sendOrderConfirmationToUser(order, user) {
    try {
      if (!user.phone) {
        console.log('User phone number not available, skipping notification');
        return { success: false, message: 'User phone not available' };
      }

      const message = `✅ *Order Confirmed!*\n\n` +
        `Thank you ${user.full_name || 'valued customer'} for your order!\n\n` +
        `*Order Details:*\n` +
        `Order ID: #${order.id}\n` +
        `Meal Type: ${order.meal_type || 'N/A'}\n` +
        `Quantity: ${order.quantity || 1}\n` +
        `Total Amount: ₹${order.total_amount || 0}\n` +
        `Delivery Date: ${order.delivery_date || 'N/A'}\n` +
        `Delivery Time: ${order.delivery_time || 'N/A'}\n` +
        `Delivery Address: ${order.address || 'N/A'}\n\n` +
        `Your order has been received and will be prepared soon. We'll notify you once it's out for delivery.\n\n` +
        `Thank you for choosing Mama's Thali! 🍛`;

      return await this.sendMessage(user.phone, message);
    } catch (error) {
      console.error('Error sending order confirmation to user:', error);
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
module.exports = new WhatsAppService();

