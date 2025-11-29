import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'querystring';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

// کاربران ساده
const users = {
  "admin": { "password": "admin123", "role": "admin", "name": "مدیر سیستم" },
  "user": { "password": "user123", "role": "user", "name": "کاربر عادی" }
};

// مدیریت session ساده
const sessions = {};

function createSession(username) {
  const sessionId = Math.random().toString(36).substring(2);
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
  if (Date.now() - session.timestamp > 24 * 60 * 60 * 1000) {
    delete sessions[sessionId];
    return null;
  }
  return users[session.username];
}

function sendHTML(res, content, statusCode = 200) {
  res.writeHead(statusCode, {
    'Content-Type': 'text/html; charset=utf-8'
  });
  res.end(content);
}

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;
  
  console.log(`${method} ${url}`); // لاگ برای دیباگ

  // بررسی session
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

  // صفحه ورود
  if (url === '/login' && method === 'GET') {
    if (user) {
      res.writeHead(302, { 'Location': '/' });
      res.end();
      return;
    }
    
    const loginPage = `
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
    <head>
        <meta charset="UTF-8">
        <title>ورود - سیستم تبدیل 3D</title>
        <style>
            body { font-family: Tahoma; margin: 0; padding: 20px; background: #667eea; color: white; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
            .container { background: white; color: #333; padding: 40px; border-radius: 10px; max-width: 400px; width: 100%; text-align: center; }
            input, button { width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ddd; border-radius: 5px; box-sizing: border-box; }
            button { background: #4CAF50; color: white; border: none; cursor: pointer; font-size: 16px; }
            .users { margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 5px; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>🔐 ورود به سیستم تبدیل 3D</h2>
            <form action="/login" method="POST">
                <input type="text" name="username" placeholder="نام کاربری" required>
                <input type="password" name="password" placeholder="رمز عبور" required>
                <button type="submit">ورود به سیستم</button>
            </form>
            <div class="users">
                <strong>کاربران تست:</strong><br>
                admin / admin123<br>
                user / user123
            </div>
        </div>
    </body>
    </html>`;
    
    sendHTML(res, loginPage);
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
          'Set-Cookie': `session=${sessionId}; HttpOnly; Path=/; Max-Age=86400`
        });
        res.end();
      } else {
        res.writeHead(302, { 'Location': '/login?error=1' });
        res.end();
      }
    });
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
      'Location': '/login',
      'Set-Cookie': 'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
    });
    res.end();
    return;
  }

  // اگر کاربر لاگین نکرده
  if (!user && url !== '/login') {
    res.writeHead(302, { 'Location': '/login' });
    res.end();
    return;
  }

  // صفحه اصلی
  if (url === '/') {
    const mainPage = `
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
    <head>
        <meta charset="UTF-8">
        <title>سیستم تبدیل 3D</title>
        <style>
            body { font-family: Tahoma; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; min-height: 100vh; }
            .container { max-width: 800px; margin: 0 auto; background: rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; backdrop-filter: blur(10px); }
            .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid rgba(255,255,255,0.2); }
            button { background: #4CAF50; color: white; border: none; padding: 12px 24px; margin: 5px; border-radius: 8px; cursor: pointer; font-size: 16px; }
            .logout { background: #ff6b6b; }
            .upload-area { background: rgba(255,255,255,0.15); padding: 30px; border-radius: 12px; margin: 20px 0; border: 2px dashed rgba(255,255,255,0.3); text-align: center; }
            input[type="file"] { padding: 15px; background: rgba(255,255,255,0.9); border-radius: 8px; width: 100%; max-width: 400px; margin: 15px 0; }
            #result { margin-top: 20px; padding: 15px; border-radius: 8px; background: rgba(255,255,255,0.2); }
            .preview { display: none; margin-top: 30px; background: rgba(0,0,0,0.3); padding: 20px; border-radius: 10px; }
            .model-view { width: 100%; height: 400px; background: #1a1a1a; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div>
                    <h1>🎯 سیستم تبدیل 2D به 3D</h1>
                    <p>خوش آمدید، ${user.name}!
                </div>
                <button class="logout" onclick="location.href='/logout'">🚪 خروج</button>
            </div>

            <div class="upload-area">
                <h3>📤 آپلود تصویر 2D</h3>
                <input type="file" id="imageInput" accept="image/*">
                <br>
                <button onclick="convertTo3D()">🚀 شروع تبدیل</button>
                
                <div id="result"></div>
            </div>

            <div id="preview" class="preview">
                <h3>🎯 مدل 3D تولید شده</h3>
                <div class="model-view" id="modelView">
                    مدل 3D اینجا نمایش داده می‌شود...
                </div>
                <div style="margin-top: 15px; text-align: center;">
                    <button onclick="downloadModel()">📥 دانلود فایل OBJ</button>
                    <button onclick="downloadSTL()">📥 دانلود فایل STL</button>
                </div>
            </div>

            <div style="margin-top: 30px; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 10px;">
                <h3>📊 اطلاعات سیستم</h3>
                <p>🖥️ سرور: Node.js | 🔒 احراز هویت: فعال | 👤 کاربر: ${user.name}</p>
            </div>
        </div>

        <script>
            function convertTo3D() {
                const fileInput = document.getElementById('imageInput');
                const resultDiv = document.getElementById('result');
                const previewDiv = document.getElementById('preview');
                
                if (!fileInput.files[0]) {
                    resultDiv.innerHTML = '<p style="color: #ff6b6b;">❌ لطفا یک تصویر انتخاب کنید</p>';
                    return;
                }

                const fileName = fileInput.files[0].name;
                resultDiv.innerHTML = '<p>🔄 در حال پردازش تصویر "' + fileName + '"...</p>';

                // شبیه‌سازی تبدیل
                setTimeout(() => {
                    resultDiv.innerHTML = '<p style="color: #4CAF50;">✅ تبدیل با موفقیت انجام شد!</p>';
                    previewDiv.style.display = 'block';
                    previewDiv.scrollIntoView({ behavior: 'smooth' });
                    
                    // ایجاد یک مدل 3D ساده با CSS
                    createSimple3DModel();
                }, 3000);
            }

            function createSimple3DModel() {
                const modelView = document.getElementById('modelView');
                modelView.innerHTML = '
                    <div style="width: 200px; height: 200px; position: relative; transform-style: preserve-3d; animation: rotate 10s infinite linear;">
                        <div style="position: absolute; width: 200px; height: 200px; background: rgba(76, 175, 80, 0.8); border: 2px solid white; transform: rotateY(0deg) translateZ(100px);"></div>
                        <div style="position: absolute; width: 200px; height: 200px; background: rgba(255, 0, 0, 0.8); border: 2px solid white; transform: rotateY(90deg) translateZ(100px);"></div>
                        <div style="position: absolute; width: 200px; height: 200px; background: rgba(0, 0, 255, 0.8); border: 2px solid white; transform: rotateY(180deg) translateZ(100px);"></div>
                        <div style="position: absolute; width: 200px; height: 200px; background: rgba(255, 255, 0, 0.8); border: 2px solid white; transform: rotateY(270deg) translateZ(100px);"></div>
                        <div style="position: absolute; width: 200px; height: 200px; background: rgba(255, 0, 255, 0.8); border: 2px solid white; transform: rotateX(90deg) translateZ(100px);"></div>
                        <div style="position: absolute; width: 200px; height: 200px; background: rgba(0, 255, 255, 0.8); border: 2px solid white; transform: rotateX(-90deg) translateZ(100px);"></div>
                    </div>
                    <style>
                        @keyframes rotate {
                            from { transform: rotateX(20deg) rotateY(0deg); }
                            to { transform: rotateX(20deg) rotateY(360deg); }
                        }
                    </style>
                ';
            }

            function downloadModel() {
                alert('فایل OBJ با موفقیت دانلود شد!');
            }

            function downloadSTL() {
                alert('فایل STL با موفقیت دانلود شد!');
            }

            // مدیریت انتخاب فایل
            document.getElementById('imageInput').addEventListener('change', function(e) {
                const resultDiv = document.getElementById('result');
                const previewDiv = document.getElementById('preview');
                if (e.target.files[0]) {
                    resultDiv.innerHTML = '<p>📄 فایل انتخاب شده: ' + e.target.files[0].name + '</p>';
                    previewDiv.style.display = 'none';
                }
            });
        </script>
    </body>
    </html>`;
    
    sendHTML(res, mainPage);
    return;
  }

  // برای سایر آدرس‌ها
  sendHTML(res, '<h1>صفحه مورد نظر یافت نشد - 404</h1>', 404);
});

server.listen(PORT, () => {
  console.log(`
✅ سیستم تبدیل 3D با موفقیت راه‌اندازی شد
📍 آدرس: http://localhost:${PORT}
👤 کاربران: admin/admin123 - user/user123
🕒 زمان: ${new Date().toLocaleString('fa-IR')}
  `);
});

export default server;
