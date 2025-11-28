const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.static('.'));

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>سامانه تبدیل 3D و مالی - پورت 3001</title>
        <meta charset="utf-8">
        <style>
          body { font-family: Tahoma, sans-serif; margin: 40px; background: #f5f5f5; }
          .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
          .tab { display: inline-block; padding: 10px 20px; margin: 5px; background: #007acc; color: white; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🚀 سامانه تبدیل 3D و مالی - TERMUX</h1>
          <p>📍 آدرس محلی: <a href="http://localhost:${PORT}">http://localhost:${PORT}</a></p>
          <p>💰 تب مالی: تبدیل ارزهای دیجیتال</p>
          <p>🔄 تب تبدیل 3D: تبدیل مدل‌های سه‌بعدی</p>
          <p>📊 تب وضعیت: سلامت سامانه و تراکنش‌ها</p>
          <div style="margin-top: 20px;">
            <div class="tab">💰 مالی</div>
            <div class="tab">🔄 تبدیل 3D</div>
            <div class="tab">📊 وضعیت</div>
          </div>
        </div>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`
============================================================
🚀 سامانه تبدیل 3D و مالی - TERMUX
📍 آدرس محلی: http://localhost:${PORT}
💰 تب مالی: تبدیل ارزهای دیجیتال
🔄 تب تبدیل 3D: تبدیل مدل‌های سه‌بعدی
📊 تب وضعیت: سلامت سامانه و تراکنش‌ها
============================================================
  `);
});
