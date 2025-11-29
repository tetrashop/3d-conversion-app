import http from 'http';

const PORT = process.env.PORT || 3000;

// ساده‌ترین سرور ممکن - بدون هیچ پیچیدگی
const server = http.createServer((req, res) => {
  console.log(`📨 دریافت درخواست: ${req.method} ${req.url}`);
  
  // پاسخ فوری برای تمام درخواست‌ها
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  
  if (req.url === '/health' || req.url === '/api/health') {
    res.end(JSON.stringify({ 
      status: 'ok', 
      message: 'سرور فعال است',
      timestamp: new Date().toISOString()
    }));
    return;
  }
  
  if (req.url === '/favicon.ico') {
    res.statusCode = 204; // No Content
    res.end();
    return;
  }
  
  // صفحه اصلی
  const html = `
  <!DOCTYPE html>
  <html dir="rtl" lang="fa">
  <head>
    <meta charset="UTF-8">
    <title>سیستم تبدیل 3D - فعال</title>
    <style>
      body { 
        font-family: Tahoma; 
        margin: 0; 
        padding: 40px; 
        background: #667eea; 
        color: white; 
        text-align: center; 
      }
      .box { 
        background: rgba(255,255,255,0.2); 
        padding: 30px; 
        border-radius: 10px; 
        margin: 20px auto; 
        max-width: 500px; 
      }
    </style>
  </head>
  <body>
    <div class="box">
      <h1>✅ سرور فعال شد!</h1>
      <p>مشکل 504 حل شده است</p>
      <p><strong>زمان:</strong> ${new Date().toLocaleString('fa-IR')}</p>
      <p><strong>پورت:</strong> ${PORT}</p>
    </div>
    <div class="box">
      <h3>📊 تست سلامت:</h3>
      <a href="/health" style="color: yellow;">/health</a>
    </div>
  </body>
  </html>`;
  
  res.end(html);
});

server.listen(PORT, () => {
  console.log(`🎉 سرور ساده روی پورت ${PORT} راه‌اندازی شد`);
});

// مدیریت خطاهای بحرانی
process.on('uncaughtException', (error) => {
  console.error('خطای بحرانی:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('خطای promise:', reason);
});
