import http from 'http';
import { parse } from 'querystring';
import { randomBytes } from 'crypto';

// استفاده از پورت Vercel یا پیش‌فرض
const PORT = process.env.PORT || 3000;

// [بقیه کدهای شما بدون تغییر می‌ماند...]
// فقط مطمئن شو که این خط در انتها باشد:
const server = http.createServer((req, res) => {
  // [کدهای سرور شما]
});

// این خط مهم است - برای Vercel
server.listen(PORT, '0.0.0.0', () => {
  console.log(`
🎉 سیستم تبدیل 3D در Vercel راه‌اندازی شد
📍 پورت: ${PORT}
🌐 محیط: ${process.env.VERCEL ? 'Production' : 'Development'}
✅ سرور فعال و آماده به کار
  `);
});

export default server;
