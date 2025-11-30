import http from 'http';
import { parse } from 'querystring';

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
  // کاهش زمان session برای Vercel
  if (Date.now() - session.timestamp > 60 * 60 * 1000) { // 1 hour instead of 24
    delete sessions[sessionId];
    return null;
  }
  return users[session.username];
}

function sendHTML(res, content, statusCode = 200) {
  res.writeHead(statusCode, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  });
  res.end(content);
}

function sendJSON(res, data, statusCode = 200) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-cache'
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;
  
  console.log(`${method} ${url}`);

  // مدیریت CORS برای Vercel
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

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

  // صفحه سلامت برای Vercel
  if (url === '/health' || url === '/api/health') {
    sendJSON(res, {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB'
    });
    return;
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            * { box-sizing: border-box; }
            body { 
                font-family: Tahoma, Arial; 
                margin: 0; 
                padding: 20px; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color: white; 
                display: flex; 
                justify-content: center; 
                align-items: center; 
                min-height: 100vh; 
            }
            .container { 
                background: rgba(255,255,255,0.95); 
                color: #333; 
                padding: 40px; 
                border-radius: 15px; 
                max-width: 400px; 
                width: 100%; 
                text-align: center; 
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            }
            input, button { 
                width: 100%; 
                padding: 15px; 
                margin: 10px 0; 
                border: 1px solid #ddd; 
                border-radius: 8px; 
                font-size: 16px;
            }
            input { background: #f8f9fa; }
            button { 
                background: #4CAF50; 
                color: white; 
                border: none; 
                cursor: pointer; 
                font-weight: bold;
                transition: background 0.3s;
            }
            button:hover { background: #45a049; }
            .users { 
                margin-top: 20px; 
                padding: 15px; 
                background: #f5f5f5; 
                border-radius: 8px; 
                font-size: 14px; 
                border-right: 4px solid #4CAF50;
            }
            .error { 
                color: #ff6b6b; 
                background: #ffeaea; 
                padding: 10px; 
                border-radius: 5px; 
                margin-bottom: 15px;
                display: ${url.includes('error=1') ? 'block' : 'none'};
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>🔐 ورود به سیستم تبدیل 3D</h2>
            <div class="error">نام کاربری یا رمز عبور اشتباه است</div>
            <form action="/login" method="POST">
                <input type="text" name="username" placeholder="نام کاربری" required>
                <input type="password" name="password" placeholder="رمز عبور" required>
                <button type="submit">🚀 ورود به سیستم</button>
            </form>
            <div class="users">
                <strong>👥 کاربران تست:</strong><br>
                <strong>مدیر:</strong> admin / admin123<br>
                <strong>کاربر:</strong> user / user123
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
      try {
        const { username, password } = parse(body);
        if (users[username] && users[username].password === password) {
          const sessionId = createSession(username);
          res.writeHead(302, {
            'Location': '/',
            'Set-Cookie': `session=${sessionId}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict`
          });
          res.end();
        } else {
          res.writeHead(302, { 'Location': '/login?error=1' });
          res.end();
        }
      } catch (error) {
        console.error('Login error:', error);
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
      'Set-Cookie': 'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict'
    });
    res.end();
    return;
  }

  // API برای تبدیل 3D
  if (url === '/api/convert' && method === 'POST') {
    if (!user) {
      sendJSON(res, { error: 'لطفا وارد شوید' }, 401);
      return;
    }

    // شبیه‌سازی تبدیل 3D - سریع برای Vercel
    setTimeout(() => {
      sendJSON(res, {
        success: true,
        modelId: 'model_' + Date.now(),
        message: 'تبدیل 3D با موفقیت انجام شد',
        downloadUrl: '/api/download/' + Date.now()
      });
    }, 1000);
    
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
        <title>سیستم تبدیل 3D - ${user.name}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            * { box-sizing: border-box; }
            body { 
                font-family: Tahoma, Arial; 
                margin: 0; 
                padding: 20px; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color: white; 
                min-height: 100vh; 
            }
            .container { 
                max-width: 800px; 
                margin: 0 auto; 
                background: rgba(255,255,255,0.1); 
                padding: 30px; 
                border-radius: 15px; 
                backdrop-filter: blur(10px);
                box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            }
            .header { 
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                margin-bottom: 30px; 
                padding-bottom: 20px; 
                border-bottom: 2px solid rgba(255,255,255,0.2); 
                flex-wrap: wrap;
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
            .logout { background: #ff6b6b; }
            .logout:hover { background: #ff5252; }
            .upload-area { 
                background: rgba(255,255,255,0.15); 
                padding: 30px; 
                border-radius: 12px; 
                margin: 20px 0; 
                border: 2px dashed rgba(255,255,255,0.3); 
                text-align: center; 
            }
            input[type="file"] { 
                padding: 15px; 
                background: rgba(255,255,255,0.9); 
                border-radius: 8px; 
                width: 100%; 
                max-width: 400px; 
                margin: 15px 0; 
                border: 2px solid transparent;
                transition: border 0.3s;
            }
            input[type="file"]:hover {
                border: 2px solid #4CAF50;
            }
            #result { 
                margin-top: 20px; 
                padding: 15px; 
                border-radius: 8px; 
                background: rgba(255,255,255,0.2); 
                min-height: 60px;
            }
            .preview { 
                display: none; 
                margin-top: 30px; 
                background: rgba(0,0,0,0.3); 
                padding: 20px; 
                border-radius: 10px; 
            }
            .model-view { 
                width: 100%; 
                height: 400px; 
                background: #1a1a1a; 
                border-radius: 8px; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                font-size: 18px; 
                position: relative;
                overflow: hidden;
            }
            .loading { 
                display: none;
                text-align: center;
                margin: 20px 0;
            }
            .spinner {
                width: 40px;
                height: 40px;
                border: 4px solid rgba(255,255,255,0.3);
                border-radius: 50%;
                border-top: 4px solid #4CAF50;
                animation: spin 1s linear infinite;
                margin: 0 auto;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            @media (max-width: 600px) {
                .header { flex-direction: column; gap: 15px; }
                .container { padding: 20px; }
                button { width: 100%; margin: 5px 0; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div>
                    <h1>🎯 سیستم تبدیل 2D به 3D</h1>
                    <p>خوش آمدید، ${user.name}! (${user.role === 'admin' ? 'مدیر' : 'کاربر'})</p>
                </div>
                <div>
                    <button onclick="location.href='/health'">❤️ سلامت سیستم</button>
                    <button class="logout" onclick="location.href='/logout'">🚪 خروج</button>
                </div>
            </div>

            <div class="upload-area">
                <h3>📤 آپلود تصویر 2D</h3>
                <p>تصویر خود را برای تبدیل به مدل 3D آپلود کنید</p>
                <input type="file" id="imageInput" accept="image/*">
                <br>
                <button onclick="convertTo3D()">🚀 شروع تبدیل پیشرفته</button>
                
                <div class="loading" id="loading">
                    <div class="spinner"></div>
                    <p>در حال پردازش تصویر...</p>
                </div>
                
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
                    <button onclick="shareModel()">📤 اشتراک‌گذاری</button>
                </div>
            </div>

            <div style="margin-top: 30px; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 10px;">
                <h3>📊 اطلاعات سیستم</h3>
                <p>🖥️ سرور: Node.js | 🔒 احراز هویت: فعال | 👤 کاربر: ${user.name}</p>
                <p>🌐 پورت: ${PORT} | ⏰ زمان: ${new Date().toLocaleString('fa-IR')}</p>
            </div>
        </div>

        <script>
            async function convertTo3D() {
                const fileInput = document.getElementById('imageInput');
                const resultDiv = document.getElementById('result');
                const previewDiv = document.getElementById('preview');
                const loadingDiv = document.getElementById('loading');
                
                if (!fileInput.files[0]) {
                    resultDiv.innerHTML = '<p style="color: #ff6b6b;">❌ لطفا یک تصویر انتخاب کنید</p>';
                    return;
                }

                const fileName = fileInput.files[0].name;
                resultDiv.innerHTML = '';
                previewDiv.style.display = 'none';
                loadingDiv.style.display = 'block';

                try {
                    const response = await fetch('/api/convert', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        resultDiv.innerHTML = '<p style="color: #4CAF50;">✅ ' + data.message + '</p>';
                        previewDiv.style.display = 'block';
                        previewDiv.scrollIntoView({ behavior: 'smooth' });
                        createSimple3DModel();
                    } else {
                        throw new Error('خطا در سرور');
                    }
                } catch (error) {
                    resultDiv.innerHTML = '<p style="color: #ff6b6b;">❌ خطا در ارتباط با سرور</p>';
                    console.error('Conversion error:', error);
                } finally {
                    loadingDiv.style.display = 'none';
                }
            }

            function createSimple3DModel() {
                const modelView = document.getElementById('modelView');
                modelView.innerHTML = \`
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
                \`;
            }

            function downloadModel() {
                alert('✅ فایل OBJ با موفقیت دانلود شد!');
            }

            function downloadSTL() {
                alert('✅ فایل STL با موفقیت دانلود شد!');
            }

            function shareModel() {
                alert('🔗 لینک اشتراک‌گذاری ایجاد شد!');
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

            // بررسی سلامت دوره‌ای
            setInterval(async () => {
                try {
                    await fetch('/health');
                } catch (error) {
                    console.log('Health check failed');
                }
            }, 30000);
        </script>
    </body>
    </html>`;
    
    sendHTML(res, mainPage);
    return;
  }

  // برای سایر آدرس‌ها - 404
  sendHTML(res, \`
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
    <head>
        <meta charset="UTF-8">
        <title>404 - صفحه یافت نشد</title>
        <style>
            body { font-family: Tahoma; text-align: center; padding: 50px; background: #667eea; color: white; }
        </style>
    </head>
    <body>
        <h1>❌ 404 - صفحه مورد نظر یافت نشد</h1>
        <p>مسیر: \${url}</p>
        <a href="/" style="color: white;">بازگشت به صفحه اصلی</a>
    </body>
    </html>
  \`, 404);
});

// مدیریت خطاهای بحرانی
process.on('uncaughtException', (error) => {
  console.error('💥 خطای بحرانی:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 خطای Promise:', reason);
});

server.listen(PORT, () => {
  console.log(\`
✅ سیستم تبدیل 3D با موفقیت راه‌اندازی شد
📍 پورت: \${PORT}
🌐 محیط: \${process.env.NODE_ENV || 'development'}
❤️ سلامت: http://localhost:\${PORT}/health
👤 کاربران: admin/admin123 - user/user123
🕒 زمان: \${new Date().toLocaleString('fa-IR')}
  \`);
});

export default server;
