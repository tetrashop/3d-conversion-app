export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount, orderId, method } = req.body;
  
  // شبیه‌سازی پردازش پرداخت
  console.log('💳 پرداخت در حال بررسی:', { amount, orderId, method });
  
  // 80% موفقیت، 20% خطا (برای تست)
  const isSuccess = Math.random() > 0.2;
  
  setTimeout(() => {
    if (isSuccess) {
      const transactionId = 'TXN-' + Date.now().toString().slice(-8);
      
      res.status(200).json({
        success: true,
        message: 'پرداخت موفقیت‌آمیز بود',
        data: {
          transactionId,
          orderId,
          amount,
          paidAt: new Date().toISOString(),
          method,
          status: 'completed'
        }
      });
      
      console.log('✅ پرداخت موفق:', transactionId);
    } else {
      res.status(400).json({
        success: false,
        error: 'پرداخت ناموفق بود. لطفا دوباره تلاش کنید.',
        code: 'PAYMENT_FAILED'
      });
      
      console.log('❌ پرداخت ناموفق برای:', orderId);
    }
  }, 1500);
}
