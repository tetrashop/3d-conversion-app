import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;
    console.log('🔐 درخواست لاگین برای:', email);
    console.log('🔑 رمز عبور دریافتی:', password);

    // 🔥 تغییر این خط: رمز عبور دلخواه خود را اینجا قرار دهید
    const correctPassword = 'admin123'; // ← رمز عبور واقعی خود را وارد کنید
    
    if (password !== correctPassword) {
      console.log('❌ رمز عبور نادرست. وارد شده:', password, '، انتظار می‌رفت:', correctPassword);
      return res.status(401).json({ message: 'ایمیل یا رمز عبور نادرست است' });
    }

    // ایجاد توکن JWT
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const token = jwt.sign(
      { 
        email: email,
        userId: '12345', 
        role: 'admin',
        name: 'مدیر سیستم' // می‌توانید اطلاعات بیشتر اضافه کنید
      },
      secret,
      { expiresIn: '24h' } // توکن به مدت 24 ساعت معتبر است
    );

    // پاسخ موفق با اطلاعات کامل
    res.status(200).json({
      success: true,
      message: 'ورود موفقیت‌آمیز بود',
      token: token,
      user: { 
        email: email,
        userId: '12345', 
        role: 'admin',
        name: 'مدیر سیستم'
      }
    });
    
    console.log('✅ لاگین موفق برای:', email);
    
  } catch (error) {
    console.error('❌ خطا در API لاگین:', error);
    res.status(500).json({ 
      success: false,
      message: 'خطای سرور داخلی' 
    });
  }
}
