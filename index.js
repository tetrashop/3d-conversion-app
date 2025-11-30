import http from 'http';
import { parse } from 'querystring';
import { randomBytes } from 'crypto';

const PORT = process.env.PORT || 3000;

// مدیریت کاربران
const users = {
  "admin": { "password": "admin123", "role": "admin", "name": "مدیر سیستم" },
  "user": { "password": "user123", "role": "user", "name": "کاربر عادی" }
};

const sessions = {};

function createSession(username) {
  const sessionId = randomBytes(16).toString('hex');
  sessions[sessionId] = { username, timestamp: Date.now() };
  return sessionId;
}

function checkSession(sessionId) {
  return sessions[sessionId] ? users[sessions[sessionId].username] : null;
}

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;
  
  console.log(`📨 ${method} ${url}`);

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // صفحه لاگین
  if (url === '/login' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
          <meta charset="UTF-8">
          <title>ورود - سیستم تبدیل 3D</title>
          <style>
            body { 
              font-family: Tahoma; 
              background: linear-gradient(135deg, #667eea, #764ba2);
              margin: 0; padding: 20px;
              color: white;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            .login-box {
              background: rgba(255,255,255,0.1);
              padding: 40px;
              border-radius: 10px;
              backdrop-filter: blur(10px);
              width: 100%;
              max-width: 400px;
            }
            input, button {
              width: 100%;
              padding: 12px;
              margin: 10px 0;
              border: none;
              border-radius: 5px;
              box-sizing: border-box;
            }
            button {
              background: #4CAF50;
              color: white;
              cursor: pointer;
              font-size: 16px;
            }
          </style>
      </head>
      <body>
          <div class="login-box">
            <h2 style="text-align: center;">🔐 ورود به سیستم تبدیل 3D</h2>
            <form action="/login" method="POST">
              <input type="text" name="username" placeholder="نام کاربری" required>
              <input type="password" name="password" placeholder="رمز عبور" required>
              <button type="submit">🚀 ورود به سیستم</button>
            </form>
            <div style="margin-top: 20px; background: rgba(255,255,255,0.2); padding: 15px; border-radius: 5px;">
              <strong>حساب‌های تست:</strong><br>
              نام کاربری: admin - رمز: admin123<br>
              نام کاربری: user - رمز: user123
            </div>
          </div>
      </body>
      </html>
    `);
    return;
  }

  // پردازش لاگین
  if (url === '/login' && method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      const { username, password } = parse(body);
      if (users[username] && users[username].password === password) {
        const sessionId = createSession(username);
        res.writeHead(302, {
          'Location': '/',
          'Set-Cookie': `session=${sessionId}; Path=/; Max-Age=86400`
        });
        res.end();
      } else {
        res.writeHead(302, { 'Location': '/login?error=1' });
        res.end();
      }
    });
    return;
  }

  // بررسی session
  let user = null;
  const cookies = req.headers.cookie;
  if (cookies) {
    const sessionMatch = cookies.match(/session=([^;]+)/);
    if (sessionMatch) {
      user = checkSession(sessionMatch[1]);
    }
  }

  // اگر لاگین نکرده
  if (!user && url !== '/login') {
    res.writeHead(302, { 'Location': '/login' });
    res.end();
    return;
  }

  // صفحه اصلی - سیستم تبدیل 3D
  if (url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
          <meta charset="UTF-8">
          <title>سیستم تبدیل 3D - ${user.name}</title>
          <style>
            body { 
              font-family: Tahoma; 
              background: linear-gradient(135deg, #667eea, #764ba2);
              margin: 0; padding: 20px;
              color: white;
            }
            .container {
              max-width: 1000px;
              margin: 0 auto;
              background: rgba(255,255,255,0.1);
              padding: 30px;
              border-radius: 15px;
            }
            .nav { 
              display: flex; 
              gap: 10px; 
              margin-bottom: 20px;
              flex-wrap: wrap;
            }
            .nav button { 
              background: #4CAF50; 
              color: white; 
              border: none; 
              padding: 12px 20px;
              border-radius: 8px; 
              cursor: pointer;
              font-size: 14px;
            }
            .user-info { 
              background: rgba(255,255,255,0.2); 
              padding: 20px; 
              border-radius: 10px; 
              margin-bottom: 30px;
              border-right: 4px solid #4CAF50;
            }
            .conversion-box {
              background: rgba(255,255,255,0.15);
              padding: 25px;
              border-radius: 12px;
              margin: 20px 0;
              border: 2px dashed rgba(255,255,255,0.3);
            }
            .file-input {
              width: 100%;
              padding: 15px;
              background: rgba(255,255,255,0.9);
              border: 2px solid transparent;
              border-radius: 8px;
              font-size: 16px;
              margin: 10px 0;
              color: #333;
            }
            .convert-btn {
              background: #FF9800;
              color: white;
              border: none;
              padding: 15px 30px;
              border-radius: 8px;
              cursor: pointer;
              font-size: 18px;
              font-weight: bold;
              margin-top: 15px;
              width: 100%;
            }
            .result-box {
              margin-top: 20px;
              padding: 15px;
              border-radius: 8px;
              background: rgba(255,255,255,0.2);
              min-height: 50px;
            }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="nav">
                  <button onclick="location.href='/'">🏠 صفحه اصلی</button>
                  <button onclick="location.href='/shop'">🛍️ فروشگاه</button>
                  ${user.role === 'admin' ? '<button onclick="location.href=\'/admin\'">⚙️ مدیریت</button>' : ''}
                  <button onclick="location.href='/logout'" style="background: #ff6b6b;">🚪 خروج</button>
              </div>
              
              <div class="user-info">
                  <h2>👋 خوش آمدید، ${user.name}</h2>
                  <p>سطح دسترسی: ${user.role === 'admin' ? 'مدیر سیستم' : 'کاربر عادی'}</p>
                  <p>📍 پورت: ${PORT} | وضعیت: فعال ✅</p>
              </div>
              
              <h1>🔄 سیستم تبدیل هوشمند 2D به 3D</h1>
              
              <div class="conversion-box">
                  <h3>📤 آپلود تصویر 2D</h3>
                  <p>تصویر خود را آپلود کنید تا به صورت هوشمند به مدل 3D تبدیل شود</p>
                  
                  <input type="file" id="imageInput" class="file-input" accept="image/*">
                  
                  <div id="fileInfo" style="margin: 15px 0;"></div>
                  
                  <button class="convert-btn" onclick="startConversion()">🚀 شروع تبدیل هوشمند</button>
                  
                  <div class="result-box" id="result"></div>
              </div>

              <div style="margin-top: 30px; padding: 20px; background: rgba(0,0,0,0.2); border-radius: 10px;">
                  <h3>📊 اطلاعات سیستم</h3>
                  <p>🖥️ سرور: Node.js | 🔒 احراز هویت: فعال | 👤 کاربر: ${user.name}</p>
                  <p>🎯 قابلیت: تبدیل تصاویر 2D به مدل‌های سه بعدی هوشمند</p>
              </div>
          </div>

          <script>
              document.getElementById('imageInput').addEventListener('change', function(e) {
                  const file = e.target.files[0];
                  const fileInfo = document.getElementById('fileInfo');
                  
                  if (file) {
                      fileInfo.innerHTML = \`
                          <p><strong>📄 نام فایل:</strong> \${file.name}</p>
                          <p><strong>📊 سایز فایل:</strong> \${formatFileSize(file.size)}</p>
                          <p><strong>🎨 نوع فایل:</strong> \${file.type}</p>
                      \`;
                  } else {
                      fileInfo.innerHTML = '';
                  }
              });

              function formatFileSize(bytes) {
                  if (bytes === 0) return '0 Bytes';
                  const k = 1024;
                  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
                  const i = Math.floor(Math.log(bytes) / Math.log(k));
                  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
              }

              function startConversion() {
                  const fileInput = document.getElementById('imageInput');
                  const resultDiv = document.getElementById('result');
                  
                  if (!fileInput.files[0]) {
                      resultDiv.innerHTML = '<p style="color: #ff6b6b;">❌ لطفا یک تصویر انتخاب کنید</p>';
                      return;
                  }

                  const file = fileInput.files[0];
                  resultDiv.innerHTML = '<p>🔍 در حال تحلیل هوشمند فایل "' + file.name + '"...</p>';

                  // شبیه‌سازی پردازش
                  setTimeout(() => {
                      resultDiv.innerHTML = \`
                          <p style="color: #4CAF50; font-weight: bold;">✅ تبدیل با موفقیت انجام شد!</p>
                          <p>🎯 مدل تولید شده: <strong>مدل سه بعدی هوشمند</strong></p>
                          <p>📏 ابعاد: 512×384×256</p>
                          <p>🔢 تعداد vertices: 4,500</p>
                          <p>💾 حجم فایل: 3.2 MB</p>
                          <p style="margin-top: 15px;">📥 <a href="#" style="color: #4CAF50;">دانلود فایل OBJ</a></p>
                      \`;
                  }, 2000);
              }
          </script>
      </body>
      </html>
    `);
    return;
  }

  // صفحه فروشگاه
  if (url === '/shop') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
          <meta charset="UTF-8">
          <title>فروشگاه - سیستم تبدیل 3D</title>
          <style>
            body { 
              font-family: Tahoma; 
              background: linear-gradient(135deg, #667eea, #764ba2);
              margin: 0; padding: 20px;
              color: white;
            }
            .container { max-width: 1000px; margin: 0 auto; background: rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; }
            .nav { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
            .nav button { background: #4CAF50; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; }
            .product { background: rgba(255,255,255,0.15); padding: 25px; margin: 20px 0; border-radius: 12px; }
            .buy-btn { background: #FF9800; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 16px; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="nav">
                  <button onclick="location.href='/'">🏠 صفحه اصلی</button>
                  <button onclick="location.href='/shop'">🛍️ فروشگاه</button>
                  ${user.role === 'admin' ? '<button onclick="location.href=\'/admin\'">⚙️ مدیریت</button>' : ''}
                  <button onclick="location.href='/logout'" style="background: #ff6b6b;">🚪 خروج</button>
              </div>
              
              <h1>🛍️ فروشگاه محصولات 3D</h1>
              
              <div class="product">
                  <h3>🎯 پکیج تبدیل پیشرفته</h3>
                  <p>دسترسی کامل به تمام ویژگی‌های سیستم تبدیل 3D</p>
                  <p><strong>قیمت: 29,000 تومان</strong></p>
                  <button class="buy-btn">💰 خرید محصول</button>
                  <p style="color: #ff6b6b; margin-top: 10px;">❌ سیستم درآمدزایی در حال توسعه</p>
              </div>
          </div>
      </body>
      </html>
    `);
    return;
  }

  // صفحه مدیریت
  if (url === '/admin' && user.role === 'admin') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
          <meta charset="UTF-8">
          <title>مدیریت - سیستم تبدیل 3D</title>
          <style>
            body { font-family: Tahoma; background: linear-gradient(135deg, #667eea, #764ba2); margin: 0; padding: 20px; color: white; }
            .container { max-width: 1000px; margin: 0 auto; background: rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; }
            .nav { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
            .nav button { background: #4CAF50; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; }
            .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
            .stat-box { background: rgba(255,255,255,0.15); padding: 20px; border-radius: 10px; text-align: center; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="nav">
                  <button onclick="location.href='/'">🏠 صفحه اصلی</button>
                  <button onclick="location.href='/shop'">🛍️ فروشگاه</button>
                  <button onclick="location.href='/admin'">⚙️ مدیریت</button>
                  <button onclick="location.href='/logout'" style="background: #ff6b6b;">🚪 خروج</button>
              </div>
              
              <h1>⚙️ پنل مدیریت سیستم</h1>
              
              <div class="stats">
                  <div class="stat-box">
                      <h3>👥 کاربران فعال</h3>
                      <p style="font-size: 24px; margin: 10px 0;">2</p>
                  </div>
                  <div class="stat-box">
                      <h3>🔄 تبدیل‌های امروز</h3>
                      <p style="font-size: 24px; margin: 10px 0;">0</p>
                  </div>
                  <div class="stat-box">
                      <h3>💰 درآمد کل</h3>
                      <p style="font-size: 24px; margin: 10px 0;">0 تومان</p>
                  </div>
                  <div class="stat-box">
                      <h3>⏱ وضعیت سرور</h3>
                      <p style="font-size: 24px; margin: 10px 0; color: #4CAF50;">فعال</p>
                  </div>
              </div>
              
              <div style="background: rgba(255,255,255,0.15); padding: 20px; border-radius: 10px; margin-top: 20px;">
                  <h3>📊 اطلاعات فنی سیستم</h3>
                  <p>🖥️ سرور: Node.js | پورت: ${PORT}</p>
                  <p>🌐 محیط: ${process.env.VERCEL ? 'Production' : 'Development'}</p>
                  <p>🔧 نسخه: 1.0.0</p>
                  <p>✅ وضعیت: پایدار و فعال</p>
              </div>
          </div>
      </body>
      </html>
    `);
    return;
  }

  // خروج
  if (url === '/logout') {
    res.writeHead(302, {
      'Location': '/login',
      'Set-Cookie': 'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
    });
    res.end();
    return;
  }

  // 404
  res.writeHead(404);
  res.end('صفحه پیدا نشد - 404');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`
🎉 سیستم تبدیل 3D راه‌اندازی شد
📍 پورت: ${PORT}
🌐 آدرس: http://localhost:${PORT}
🏠 صفحه اصلی: /
🛍️ فروشگاه: /shop  
⚙️ مدیریت: /admin
🔐 لاگین: /login
✅ بدون conflict - کاملاً تمیز
🕒 زمان: ${new Date().toLocaleString('fa-IR')}
  `);
});

export default server;
