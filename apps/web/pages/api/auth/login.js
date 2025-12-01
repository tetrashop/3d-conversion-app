export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  // کاربران سیستم (می‌توانید از دیتابیس استفاده کنید)
  const users = [
    {
      id: 1,
      email: 'admin@tetrashop.com',
      password: 'admin123',
      name: 'مدیر سیستم',
      role: 'admin',
    },
    {
      id: 2,
      email: 'user@tetrashop.com',
      password: 'user123',
      name: 'کاربر عادی',
      role: 'user',
    },
    {
      id: 3,
      email: 'support@tetrashop.com',
      password: 'support123',
      name: 'پشتیبانی',
      role: 'support',
    },
  ];

  // پیدا کردن کاربر با ایمیل
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(401).json({ 
      message: 'ایمیل یا رمز عبور اشتباه است' 
    });
  }

  // بررسی رمز عبور
  if (user.password !== password) {
    return res.status(401).json({ 
      message: 'ایمیل یا رمز عبور اشتباه است' 
    });
  }

  // حذف رمز عبور از پاسخ
  const { password: _, ...userWithoutPassword } = user;

  // ساخت توکن ساده (در production از JWT استفاده کنید)
  const token = Buffer.from(`${user.email}:${Date.now()}`).toString('base64');

  // پاسخ موفقیت‌آمیز
  res.status(200).json({
    message: 'ورود موفقیت‌آمیز بود',
    token,
    user: userWithoutPassword,
  });
}
