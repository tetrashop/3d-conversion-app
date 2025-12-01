import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;
    console.log('درخواست لاگین برای:', email);

    // بررسی اعتبار کاربر (می‌توانید با دیتابیس جایگزین کنید)
    if (password !== 'admin') {
      return res.status(401).json({ message: 'ایمیل یا رمز عبور نادرست است' });
    }

    // ایجاد توکن JWT
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const token = jwt.sign(
      { email, userId: '12345', role: 'admin' },
      secret,
      { expiresIn: '1h' }
    );

    // پاسخ موفق
    res.status(200).json({
      message: 'ورود موفق',
      token,
      user: { email, userId: '12345', role: 'admin' }
    });
  } catch (error) {
    console.error('خطا در API لاگین:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
}
