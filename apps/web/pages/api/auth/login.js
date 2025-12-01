export default function handler(req, res) {
  console.log('🔐 LOGIN API called:', req.method);
  
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }
  
  try {
    const { email, password } = req.body || {};
    
    console.log('Login attempt:', { email });
    
    // Simple validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'ایمیل و رمز عبور الزامی است'
      });
    }
    
    // Test accounts
    const testAccounts = {
      'admin@tetrashop.com': { password: 'admin123', name: 'مدیر', role: 'admin' },
      'user@tetrashop.com': { password: 'user123', name: 'کاربر', role: 'user' }
    };
    
    const user = testAccounts[email];
    
    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'ایمیل یا رمز عبور اشتباه است'
      });
    }
    
    // Success
    return res.status(200).json({
      success: true,
      message: 'ورود موفقیت‌آمیز!',
      user: {
        email,
        name: user.name,
        role: user.role
      },
      token: `token_${Date.now()}`,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'خطای سرور'
    });
  }
}
