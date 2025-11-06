/**
 * سرویس پرداخت زرین پال
 * برای فعال سازی: https://next.zarinpal.com
 */

export class PaymentService {
  constructor(merchantId) {
    this.merchantId = merchantId || 'test'; // در production جایگزین کنید
    this.baseURL = 'https://api.zarinpal.com/pg/v4/payment';
  }

  async createPayment(amount, description, callbackUrl, metadata = {}) {
    try {
      // در محیط تست از درگاه تستی استفاده می‌کنیم
      const payload = {
        merchant_id: this.merchantId,
        amount: amount * 10, // تبدیل به ریال
        description,
        callback_url: callbackUrl,
        metadata
      };

      // شبیه‌سازی درگاه پرداخت - در production با API واقعی جایگزین شود
      const paymentData = {
        success: true,
        data: {
          code: 100,
          authority: `A0000000000000000000000000000${Date.now()}`,
          fee_type: 'Merchant',
          fee: 0
        },
        errors: []
      };

      return {
        success: true,
        paymentUrl: `https://sandbox.zarinpal.com/pg/StartPay/${paymentData.data.authority}`,
        authority: paymentData.data.authority
      };
    } catch (error) {
      return {
        success: false,
        error: 'خطا در ایجاد درگاه پرداخت'
      };
    }
  }

  async verifyPayment(authority, amount) {
    try {
      // شبیه‌سازی تایید پرداخت
      // در production با API واقعی زرین پال جایگزین شود
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        data: {
          code: 100,
          ref_id: Math.floor(Math.random() * 1000000),
          fee_type: 'Merchant',
          fee: 0
        }
      };
    } catch (error) {
      return {
        success: false,
        error: 'خطا در تایید پرداخت'
      };
    }
  }
}

// ایجاد instance پیش‌فرض
export const paymentService = new PaymentService();
