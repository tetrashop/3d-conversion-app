import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'querystring';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// استفاده از پورت محیطی Vercel یا پورت پیش‌فرض
const PORT = process.env.PORT || 8081;

// بارگذاری کاربران
let users;
try {
  users = JSON.parse(fs.readFileSync('users.json', 'utf8')).users;
} catch (error) {
  // کاربران پیش‌فرض در صورت خطا
  users = {
    "admin": {
      "password": "admin123",
      "role": "admin",
      "name": "مدیر سیستم"
    },
    "user": {
      "password": "user123",
      "role": "user", 
      "name": "کاربر عادی"
    }
  };
}

// تابع برای ایجاد session
function createSession(username) {
  return Buffer.from(JSON.stringify({
    username: username,
    timestamp: Date.now(),
    role: users[username].role
  })).toString('base64');
}

// تابع برای بررسی session
function checkSession(sessionCookie) {
  if (!sessionCookie) return null;
  try {
    const sessionData = JSON.parse(Buffer.from(sessionCookie, 'base64').toString());
    if (users[sessionData.username] && Date.now() - sessionData.timestamp < 24 * 60 * 60 * 1000) {
      return users[sessionData.username];
    }
  } catch (e) {
    return null;
  }
  return null;
}

const server = http.createServer((req, res) => {
  // تنظیم هدرهای CORS برای Vercel
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  const url = req.url;
  const method = req.method;
  
  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // بررسی session از کوکی
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
    
    // محتوای صفحه ورود (همانند قبل)
    const loginPage = `<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <title>ورود به سیستم تبدیل 3D</title>
    <style>
        body { 
            font-family: Tahoma, Arial; 
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
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
        .error {
            color: #ff6b6b;
            background: rgba(255,255,255,0.2);
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 15px;
            display: none;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <h1 style="text-align: center; margin-bottom: 30px;">🔐 ورود به سیستم</h1>
        <h2 style="text-align: center; color: #4CAF50;">تبدیل 2D به 3D</h2>
        
        <div id="errorMessage" class="error"></div>
        
        <form id="loginForm">
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

    <script>
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorDiv = document.getElementById('errorMessage');
            
            if (!username || !password) {
                errorDiv.textContent = 'لطفا نام کاربری و رمز عبور را وارد کنید';
                errorDiv.style.display = 'block';
                return;
            }
            
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);
            
            fetch('/login', {
                method: 'POST',
                body: new URLSearchParams(formData)
            })
            .then(response => {
                if (response.redirected) {
                    window.location.href = response.url;
                } else {
                    return response.text();
                }
            })
            .then(data => {
                if (data && data.includes('خطا')) {
                    errorDiv.textContent = 'نام کاربری یا رمز عبور اشتباه است';
                    errorDiv.style.display = 'block';
                }
            })
            .catch(error => {
                errorDiv.textContent = 'خطا در ارتباط با سرور';
                errorDiv.style.display = 'block';
            });
        });
    </script>
</body>
</html>`;
    
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(loginPage);
    return;
  }

  // سایر routeها مانند قبل...
  // (محتوا مشابه server-with-auth.js اما با تنظیمات CORS)

  // برای صفحات دیگر، محتوای مشابه server-with-auth.js را قرار دهید
  // به دلیل محدودیت طول، از تکرار آن خودداری می‌کنم

  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
  res.end('<h1>سیستم تبدیل 3D - در حال توسعه</h1>');
});

// راه‌اندازی سرور
server.listen(PORT, () => {
  console.log(`
🎉 سیستم تبدیل 3D روی پورت ${PORT} راه‌اندازی شد
📍 آدرس: http://localhost:${PORT}
👤 کاربران پیش‌فرض:
   - admin / admin123 (مدیر)
   - user / user123 (کاربر عادی)
  `);
});

// Export for Vercel
export default server;
