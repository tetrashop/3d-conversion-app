import http from 'http';
import { parse } from 'querystring';
import { randomBytes } from 'crypto';

const PORT = 3000;

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

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // صفحه لاگین - ساده و تمیز
  if (url === '/login' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
          <meta charset="UTF-8">
          <title>ورود</title>
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
            }
          </style>
      </head>
      <body>
          <div class="login-box">
            <h2>🔐 ورود به سیستم</h2>
            <form action="/login" method="POST">
              <input type="text" name="username" placeholder="نام کاربری" required>
              <input type="password" name="password" placeholder="رمز عبور" required>
              <button type="submit">🚀 ورود</button>
            </form>
            <div style="margin-top: 20px; background: rgba(255,255,255,0.2); padding: 15px; border-radius: 5px;">
              <strong>حساب‌های تست:</strong><br>
              admin / admin123<br>
              user / user123
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

  // بررسی session برای صفحات دیگر
  let user = null;
  const cookies = req.headers.cookie;
  if (cookies) {
    const sessionMatch = cookies.match(/session=([^;]+)/);
    if (sessionMatch) {
      user = checkSession(sessionMatch[1]);
    }
  }

  // اگر لاگین نکرده به لاگین redirect
  if (!user && url !== '/login') {
    res.writeHead(302, { 'Location': '/login' });
    res.end();
    return;
  }

  // صفحه اصلی
  if (url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
          <meta charset="UTF-8">
          <title>سیستم تبدیل 3D</title>
          <style>
            body { 
              font-family: Tahoma; 
              background: linear-gradient(135deg, #667eea, #764ba2);
              margin: 0; padding: 20px;
              color: white;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
              background: rgba(255,255,255,0.1);
              padding: 20px;
              border-radius: 10px;
              backdrop-filter: blur(10px);
            }
            button {
              background: #4CAF50;
              color: white;
              border: none;
              padding: 10px 20px;
              margin: 5px;
              border-radius: 5px;
              cursor: pointer;
            }
          </style>
      </head>
      <body>
          <div class="container">
            <button onclick="location.href='/logout'">🚪 خروج</button>
            <h1>👋 خوش آمدید، ${user.name}</h1>
            <h2>سیستم تبدیل 2D به 3D</h2>
            <p>این سیستم فعال است و کار می‌کند!</p>
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
  res.end('صفحه پیدا نشد');
});

server.listen(PORT, () => {
  console.log(`
✅ سرور راه‌اندازی شد
📍 پورت: ${PORT}  
🌐 آدرس: http://localhost:${PORT}
🕒 زمان: ${new Date().toLocaleString('fa-IR')}
  `);
});
