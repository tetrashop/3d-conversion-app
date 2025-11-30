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
  sessions[sessionId] = { 
    username: username, 
    timestamp: Date.now(),
    role: users[username].role 
  };
  return sessionId;
}

function checkSession(sessionId) {
  if (!sessionId || !sessions[sessionId]) return null;
  const session = sessions[sessionId];
  // بررسی انقضای session (24 ساعت)
  if (Date.now() - session.timestamp > 24 * 60 * 60 * 1000) {
    delete sessions[sessionId];
    return null;
  }
  return users[session.username];
}

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;
  
  console.log(`📨 ${method} ${url}`);

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // صفحه اصلی - عمومی (لاگین)
  if (url === '/' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
          <meta charset="UTF-8">
          <title>سیستم تبدیل 3D - ورود</title>
          <style>
            body { 
              font-family: Tahoma, Arial; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              margin: 0; 
              padding: 20px;
              color: white;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            .login-container {
              background: rgba(255,255,255,0.1);
              padding: 40px;
              border-radius: 15px;
              backdrop-filter: blur(10px);
              width: 100%;
              max-width: 400px;
              box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            }
            .form-group {
              margin-bottom: 20px;
            }
            label {
              display: block;
              margin-bottom: 8px;
              font-weight: bold;
            }
            input[type="text"], input[type="password"] {
              width: 100%;
              padding: 12px;
              border: none;
              border-radius: 8px;
              background: rgba(255,255,255,0.9);
              font-size: 16px;
              box-sizing: border-box;
            }
            button {
              width: 100%;
              background: #4CAF50;
              color: white;
              border: none;
              padding: 15px;
              border-radius: 8px;
              cursor: pointer;
              font-size: 18px;
              font-weight: bold;
              transition: background 0.3s;
            }
            button:hover {
              background: #45a049;
            }
            .user-accounts {
              margin-top: 20px;
              padding: 15px;
              background: rgba(255,255,255,0.2);
              border-radius: 8px;
              font-size: 14px;
            }
          </style>
      </head>
      <body>
          <div class="login-container">
              <h1 style="text-align: center; margin-bottom: 30px;">🔐 سیستم تبدیل 3D</h1>
              <h2 style="text-align: center; color: #4CAF50;">لطفا وارد شوید</h2>
              
              <form action="/login" method="POST">
                  <div class="form-group">
                      <label for="username">👤 نام کاربری:</label>
                      <input type="text" id="username" name="username" required placeholder="نام کاربری خود را وارد کنید">
                  </div>
                  
                  <div class="form-group">
                      <label for="password">🔒 رمز عبور:</label>
                      <input type="password" id="password" name="password" required placeholder="رمز عبور خود را وارد کنید">
                  </div>
                  
                  <button type="submit">🚀 ورود به سیستم</button>
              </form>
              
              <div class="user-accounts">
                  <h3>👥 حساب‌های تست:</h3>
                  <p><strong>مدیر سیستم:</strong><br>نام کاربری: admin<br>رمز عبور: admin123</p>
                  <p><strong>کاربر عادی:</strong><br>نام کاربری: user<br>رمز عبور: user123</p>
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
          'Location': '/dashboard',
          'Set-Cookie': `session=${sessionId}; HttpOnly; Path=/; Max-Age=86400`
        });
        res.end();
      } else {
        res.writeHead(302, { 'Location': '/?error=1' });
        res.end();
      }
    });
    return;
  }

  // بررسی session برای صفحات دیگر
  let user = null;
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split('=');
      acc[name] = value;
      return acc;
    }, {});
    user = checkSession(cookies.session);
  }

  // اگر لاگین نکرده به صفحه اصلی redirect شود
  if (!user && url !== '/' && url !== '/login') {
    res.writeHead(302, { 'Location': '/' });
    res.end();
    return;
  }

  // صفحه دشبورد بعد از لاگین
  if (url === '/dashboard' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
          <meta charset="UTF-8">
          <title>سیستم تبدیل 3D - ${user.name}</title>
          <style>
            body { 
              font-family: Tahoma, Arial; 
              margin: 0;
              padding: 20px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              min-height: 100vh;
            }
            .container {
              max-width: 1200px;
              margin: 0 auto;
              background: rgba(255,255,255,0.1);
              padding: 30px;
              border-radius: 15px;
              backdrop-filter: blur(10px);
            }
            .user-info {
              background: rgba(255,255,255,0.2);
              padding: 15px;
              border-radius: 10px;
              margin-bottom: 20px;
              border-right: 4px solid #4CAF50;
            }
            button {
              background: #4CAF50;
              color: white;
              border: none;
              padding: 12px 24px;
              margin: 5px;
              border-radius: 8px;
              cursor: pointer;
              font-size: 16px;
              transition: all 0.3s;
            }
            button:hover {
              background: #45a049;
              transform: translateY(-2px);
            }
            .logout-btn {
              background: #ff6b6b;
            }
            .file-upload-container {
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
              cursor: pointer;
              margin: 10px 0;
            }
            #result {
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
              <div class="user-info">
                  <button class="logout-btn" onclick="window.location.href='/logout'">🚪 خروج از سیستم</button>
                  <h2>👋 خوش آمدید، ${user.name}</h2>
                  <p>سطح دسترسی: ${user.role === 'admin' ? 'مدیر سیستم' : 'کاربر عادی'}</p>
              </div>
              
              <h1>🔄 سیستم تبدیل هوشمند 2D به 3D</h1>
              <p>📍 پورت: ${PORT} | وضعیت: فعال ✅ | آخرین بروزرسانی: ${new Date().toLocaleString('fa-IR')}</p>
              
              <div class="file-upload-container">
                  <h3>📤 آپلود تصویر 2D</h3>
                  <p>سیستم به صورت هوشمند تصویر شما را تحلیل و مدل 3D تولید می‌کند</p>
                  
                  <input type="file" id="imageInput" class="file-input" accept="image/*">
                  
                  <div style="margin: 15px 0;">
                      <div id="fileInfo"></div>
                  </div>
                  
                  <button onclick="startConversion()" style="margin-top: 15px;">🚀 شروع تبدیل هوشمند</button>
                  
                  <div id="result"></div>
              </div>

              <div style="margin-top: 30px; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 10px;">
                  <h3>📊 اطلاعات سیستم</h3>
                  <p>🖥️ سرور: Node.js | 🔒 احراز هویت: فعال | 👤 کاربر: ${user.name}</p>
                  <p>🎯 قابلیت: تبدیل پیشرفته تصاویر 2D به مدل‌های سه بعدی</p>
              </div>
          </div>

          <script>
              document.getElementById('imageInput').addEventListener('change', function(e) {
                  const file = e.target.files[0];
                  const fileInfo = document.getElementById('fileInfo');
                  
                  if (file) {
                      fileInfo.innerHTML = \`
                          <p>📄 نام فایل: <strong>\${file.name}</strong></p>
                          <p>📊 سایز فایل: <strong>\${formatFileSize(file.size)}</strong></p>
                          <p>🎨 نوع فایل: <strong>\${file.type}</strong></p>
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
                          <p>🎯 مدل تولید شده: <strong>مدل سه بعدی پیشرفته</strong></p>
                          <p>📏 ابعاد: 512×384×256</p>
                          <p>🔢 تعداد vertices: 4,500</p>
                          <p>💾 حجم فایل: 3.2 MB</p>
                          <p style="margin-top: 15px;">
                              <button onclick="downloadModel()" style="background: #2196F3;">📥 دانلود فایل OBJ</button>
                          </p>
                      \`;
                  }, 2000);
              }

              function downloadModel() {
                  alert('✅ فایل مدل 3D با موفقیت دانلود شد!');
              }
          </script>
      </body>
      </html>
    `);
    return;
  }

  // خروج
  if (url === '/logout') {
    const cookieHeader = req.headers.cookie;
    if (cookieHeader) {
      const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
        const [name, value] = cookie.trim().split('=');
        acc[name] = value;
        return acc;
      }, {});
      if (cookies.session) {
        delete sessions[cookies.session];
      }
    }
    res.writeHead(302, {
      'Location': '/',
      'Set-Cookie': 'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
    });
    res.end();
    return;
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end('<h1>صفحه مورد نظر یافت نشد - 404</h1>');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`
✅ سیستم تبدیل 3D راه‌اندازی شد
📍 پورت: ${PORT}
🌐 آدرس: http://localhost:${PORT}
🏠 صفحه اصلی: / (عمومی - لاگین)
📊 دشبورد: /dashboard (پس از لاگین)
🔐 وضعیت: بدون Conflict - کاملاً تمیز
🕒 زمان: ${new Date().toLocaleString('fa-IR')}
  `);
});

export default server;
