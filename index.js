import http from 'http';

const PORT = process.env.PORT || 3000;

console.log('🚀 Starting server on port:', PORT);

const server = http.createServer((req, res) => {
  console.log(`📨 دریافت درخواست: ${req.method} ${req.url}`);
  
  // مدیریت CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // صفحه سلامت
  if (req.url === '/health' || req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      message: 'سرور فعال است'
    }));
    return;
  }

  // صفحه اصلی
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
        <meta charset="UTF-8">
        <title>سیستم تبدیل 3D - فعال</title>
        <style>
          body { 
            font-family: Tahoma, Arial; 
            margin: 0;
            padding: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            text-align: center;
          }
          .container {
            background: rgba(255,255,255,0.1);
            padding: 40px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
            max-width: 600px;
            margin: 0 auto;
          }
          h1 { color: #4CAF50; }
          .status { 
            background: rgba(76, 175, 80, 0.2);
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>✅ سرور فعال است</h1>
          <div class="status">
            <p><strong>آدرس:</strong> ${req.url}</p>
            <p><strong>زمان:</strong> ${new Date().toLocaleString('fa-IR')}</p>
            <p><strong>پورت:</strong> ${PORT}</p>
          </div>
          <p>سیستم تبدیل 3D با موفقیت راه‌اندازی شده است</p>
          <p>برای تست سلامت سرور: <a href="/health" style="color: #4CAF50;">/health</a></p>
        </div>
      </body>
      </html>
    `);
    return;
  }

  // 404 برای سایر مسیرها
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <h1>صفحه مورد نظر یافت نشد - 404</h1>
    <p>مسیر: ${req.url}</p>
    <a href="/">بازگشت به صفحه اصلی</a>
  `);
});

// مدیریت graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 دریافت SIGTERM، بستن سرور...');
  server.close(() => {
    console.log('✅ سرور بسته شد');
    process.exit(0);
  });
});

server.listen(PORT, () => {
  console.log(`
🎉 سرور با موفقیت راه‌اندازی شد
📍 پورت: ${PORT}
🌐 وضعیت: فعال ✅
🕒 زمان: ${new Date().toLocaleString('fa-IR')}
  `);
});

export default server;
