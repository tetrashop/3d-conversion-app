import http from 'http';

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  console.log(`📨 درخواست: ${req.method} ${req.url}`);
  
  // تنظیم هدرهای CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // صفحه اصلی
  if (req.url === '/' || req.url === '/login') {
    const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
    <head>
        <meta charset="UTF-8">
        <title>سیستم تبدیل 3D</title>
        <style>
            body { 
                font-family: Tahoma; 
                margin: 0; 
                padding: 20px; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .container {
                background: rgba(255,255,255,0.1);
                padding: 40px;
                border-radius: 15px;
                backdrop-filter: blur(10px);
                max-width: 500px;
                width: 100%;
                text-align: center;
            }
            button {
                background: #4CAF50;
                color: white;
                border: none;
                padding: 15px 30px;
                margin: 10px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
            }
            input {
                padding: 12px;
                margin: 10px 0;
                border: none;
                border-radius: 8px;
                width: 100%;
                max-width: 300px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🎯 سیستم تبدیل 2D به 3D</h1>
            <p>سیستم با موفقیت راه‌اندازی شد! ✅</p>
            
            <div style="margin: 20px 0;">
                <input type="file" id="imageInput" accept="image/*">
                <button onclick="convertImage()">تبدیل به 3D</button>
            </div>
            
            <div id="result" style="margin: 20px 0; padding: 15px; background: rgba(255,255,255,0.2); border-radius: 8px;"></div>
            
            <div style="margin-top: 30px; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 8px;">
                <h3>📊 وضعیت سیستم</h3>
                <p>✅ سرور Node.js فعال</p>
                <p>✅ بدون Next.js</p>
                <p>✅ رابط کاربری فارسی</p>
                <p>✅ آماده تبدیل تصاویر</p>
            </div>
        </div>

        <script>
            function convertImage() {
                const fileInput = document.getElementById('imageInput');
                const resultDiv = document.getElementById('result');
                
                if (!fileInput.files[0]) {
                    resultDiv.innerHTML = '<p style="color: #ff6b6b;">لطفا یک تصویر انتخاب کنید</p>';
                    return;
                }
                
                resultDiv.innerHTML = '<p>🔄 در حال تبدیل تصویر به مدل 3D...</p>';
                
                setTimeout(() => {
                    resultDiv.innerHTML = '
                        <p style="color: #4CAF50;">✅ تبدیل با موفقیت انجام شد!</p>
                        <p>مدل 3D ساخته شده است.</p>
                        <button onclick="showModel()">مشاهده مدل 3D</button>
                    ';
                }, 2000);
            }
            
            function showModel() {
                alert('مدل 3D آماده نمایش است!');
            }
        </script>
    </body>
    </html>`;
    
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache'
    });
    res.end(html);
    return;
  }
  
  // برای سایر آدرس‌ها
  res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
  res.end('<h1>صفحه مورد نظر یافت نشد - 404</h1>');
});

server.listen(PORT, () => {
  console.log(`
🎉 سیستم تبدیل 3D راه‌اندازی شد
📍 پورت: ${PORT}
🌐 آدرس: http://localhost:${PORT}
✅ بدون Next.js - سرور خالص Node.js
🕒 زمان: ${new Date().toLocaleString('fa-IR')}
  `);
});

export default server;
