export default async function handler(req, res) {
  console.log('🔐 درخواست تأیید توکن دریافت شد');
  res.status(200).json({
    success: true,
    user: {
      email: 'admin@tetrashop.com',
      role: 'مدیر ارشد',
      plan: 'حرفه‌ای',
      userId: 'usr_001',
      name: 'مدیر سیستم',
      credits: 5000
    }
  });
}
