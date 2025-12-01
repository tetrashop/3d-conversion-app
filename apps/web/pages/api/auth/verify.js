import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    console.log('🔍 هدر Authorization دریافتی:', authHeader ? authHeader.substring(0, 50) + '...' : 'null');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ توکن در هدر وجود ندارد');
      return res.status(401).json({ message: 'توکن ارائه نشده است' });
    }

    const token = authHeader.split(' ')[1];
    console.log('🔐 توکن دریافتی (20 کاراکتر اول):', token.substring(0, 20) + '...');
    
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    
    try {
      const decoded = jwt.verify(token, secret);
      console.log('✅ توکن تأیید شد. داده‌های decode شده:', decoded);
      
      // بازگرداندن اطلاعات کاربر
      res.status(200).json({
        success: true,
        user: {
          email: decoded.email || 'admin@tetrashop.com',
          role: decoded.role || 'admin',
          userId: decoded.userId || '12345',
          name: decoded.name || 'مدیر سیستم'
        }
      });
      
    } catch (jwtError) {
      console.error('❌ خطای JWT:', jwtError.message);
      return res.status(401).json({ 
        success: false,
        message: 'توکن نامعتبر است: ' + jwtError.message 
      });
    }
    
  } catch (error) {
    console.error('❌ خطای سرور در verify:', error);
    res.status(500).json({ 
      success: false,
      message: 'خطای سرور' 
    });
  }
}
