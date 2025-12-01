export default async function handler(req, res) {
  console.log('🔐 Login API called');
  
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed. Use POST.' 
    });
  }
  
  try {
    const { email, password } = req.body || {};
    
    console.log('Login attempt for:', email);
    
    // لیست کاربران
    const users = {
      'admin@tetrashop.com': { 
        password: 'admin123', 
        name: 'مدیر سیستم', 
        role: 'admin' 
      },
      'user@tetrashop.com': { 
        password: 'user123', 
        name: 'کاربر عادی', 
        role: 'user' 
      },
      'support@tetrashop.com': { 
        password: 'support123', 
        name: 'پشتیبانی', 
        role: 'support' 
      }
    };
    
    const user = users[email];
    
    if (!user || user.password !== password) {
      return res.status(401).json({ 
        success: false,
        message: 'ایمیل یا رمز عبور اشتباه است' 
      });
    }
    
    const { password: _, ...userWithoutPassword } = user;
    
    return res.status(200).json({
      success: true,
      message: 'ورود موفقیت‌آمیز بود',
      user: {
        ...userWithoutPassword,
        email
      },
      token: `token_${Date.now()}`,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Login API error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'خطای سرور' 
    });
  }
}
