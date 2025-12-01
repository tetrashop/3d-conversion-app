import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // لاگ کامل درخواست
    console.log('=== LOGIN API DEBUG ===');
    console.log('📨 Request method:', req.method);
    console.log('📦 Raw body:', req.body);
    console.log('📋 Headers:', JSON.stringify(req.headers, null, 2));
    
    // بررسی Content-Type
    const contentType = req.headers['content-type'] || '';
    console.log('📄 Content-Type:', contentType);
    
    let email, password;
    
    // بررسی فرمت درخواست
    if (contentType.includes('application/json')) {
      email = req.body.email;
      password = req.body.password;
      console.log('✅ Parsed as JSON');
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      email = req.body.email;
      password = req.body.password;
      console.log('✅ Parsed as Form URL Encoded');
    } else {
      // بررسی خودکار
      email = req.body.email || req.body.Email || req.body.EMAIL;
      password = req.body.password || req.body.Password || req.body.PASSWORD;
      console.log('⚠️ Unknown format, attempting auto-parse');
    }
    
    console.log('📧 Email extracted:', email);
    console.log('🔐 Password extracted:', password);
    console.log('===========================');
    
    // بررسی وجود داده‌ها
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'ایمیل و رمز عبور الزامی است',
        debug: { email: !!email, password: !!password }
      });
    }
    
    // 🔥 رمزهای عبور قابل قبول (تمام حالت‌ها)
    const acceptedPasswords = [
      'admin123',      // حالت پیش‌فرض
      'admin',         // حالت ساده
      'Admin123',      // با حروف بزرگ
      'ADMIN123',      // تمام حروف بزرگ
      'password',      // رمز رایج
      '123456',        // رمز ساده
      'tetrashop',     // نام پروژه
      'admin@123'      // شامل کاراکتر خاص
    ];
    
    // بررسی ایمیل و رمز عبور
    const isEmailValid = email === 'admin@tetrashop.com';
    const isPasswordValid = acceptedPasswords.includes(password);
    
    console.log('🔍 Email valid?', isEmailValid);
    console.log('🔍 Password valid?', isPasswordValid);
    console.log('🔍 Password received:', password);
    console.log('🔍 Accepted passwords:', acceptedPasswords);
    
    if (!isEmailValid || !isPasswordValid) {
      return res.status(401).json({ 
        message: 'ایمیل یا رمز عبور نادرست است',
        debug: {
          emailValid: isEmailValid,
          passwordValid: isPasswordValid,
          passwordLength: password ? password.length : 0,
          acceptedPasswords: acceptedPasswords
        }
      });
    }
    
    // ایجاد توکن
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const token = jwt.sign(
      { email, userId: '12345', role: 'admin' },
      secret,
      { expiresIn: '24h' }
    );
    
    console.log('✅ Login successful for:', email);
    
    res.status(200).json({
      success: true,
      message: 'ورود موفق',
      token,
      user: { email, userId: '12345', role: 'admin' }
    });
    
  } catch (error) {
    console.error('❌ Login API error:', error);
    res.status(500).json({ 
      message: 'خطای سرور',
      error: error.message 
    });
  }
}
