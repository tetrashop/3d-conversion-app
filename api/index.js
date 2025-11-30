export default async function handler(request, response) {
  const { method, url, headers, body } = request;
  
  console.log(`📨 ${method} ${url}`);
  
  // مدیریت CORS
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (method === 'OPTIONS') {
    return response.status(200).end();
  }

  // سیستم کاربران ساده
  const users = {
    'admin': { password: 'admin123', name: 'مدیر سیستم', role: 'admin' },
    'user': { password: 'user123', name: 'کاربر عادی', role: 'user' }
  };

  // سیستم session ساده (در memory - فقط برای demo)
  let sessions = {};

  function createSession(username) {
    const sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    sessions[sessionId] = {
      username,
      createdAt: Date.now(),
      role: users[username].role
    };
    return sessionId;
  }

  function validateSession(sessionId) {
    if (!sessionId || !sessions[sessionId]) return null;
    
    const session = sessions[sessionId];
    // Session 24 ساعته
    if (Date.now() - session.createdAt > 24 * 60 * 60 * 1000) {
      delete sessions[sessionId];
      return null;
    }
    
    return users[session.username];
  }

  function getCookie(cookieHeader, name) {
    if (!cookieHeader) return null;
    const match = cookieHeader.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  function sendHTML(content, statusCode = 200) {
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.status(statusCode).send(content);
  }

  // روتینگ اصلی
  try {
    const sessionId = getCookie(headers.cookie, 'session');
    const user = validateSession(sessionId);

    if (url === '/' || url === '/index.html') {
      if (user) {
        response.setHeader('Location', '/dashboard');
        return response.status(302).end();
      }
      
      const errorParam = url.includes('error=1') ? '1' : (url.includes('error=2') ? '2' : '0');
      
      return sendHTML(`
        <!DOCTYPE html>
        <html dir="rtl" lang="fa">
        <head>
            <meta charset="UTF-8">
            <title>ورود - سیستم تبدیل 3D</title>
            <style>
                body { 
                    font-family: Tahoma; 
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    margin: 0; 
                    padding: 20px;
                    color: white;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                }
                .login-box {
                    background: rgba(255,255,255,0.1);
                    padding: 40px;
                    border-radius: 15px;
                    backdrop-filter: blur(10px);
                    width: 100%;
                    max-width: 400px;
                }
                input, button {
                    width: 100%;
                    padding: 15px;
                    margin: 10px 0;
                    border: none;
                    border-radius: 8px;
                    box-sizing: border-box;
                    font-size: 16px;
                }
                button {
                    background: #4CAF50;
                    color: white;
                    cursor: pointer;
                    font-weight: bold;
                }
                .alert {
                    background: rgba(255,107,107,0.2);
                    padding: 12px;
                    border-radius: 6px;
                    margin: 15px 0;
                    border-right: 4px solid #ff6b6b;
                }
            </style>
        </head>
        <body>
            <div class="login-box">
                <h2 style="text-align: center;">🔐 سیستم تبدیل 3D</h2>
                <p style="text-align: center; color: #4CAF50;">لطفا وارد شوید</p>
                
                ${errorParam === '1' ? '<div class="alert">❌ نام کاربری یا رمز عبور اشتباه است</div>' : ''}
                ${errorParam === '2' ? '<div class="alert">❌ لطفا ابتدا وارد شوید</div>' : ''}
                
                <form action="/api/login" method="POST">
                    <input type="text" name="username" placeholder="نام کاربری" required>
                    <input type="password" name="password" placeholder="رمز عبور" required>
                    <button type="submit">🚀 ورود به سیستم</button>
                </form>
                
                <div style="margin-top: 20px; background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px;">
                    <strong>👥 حساب‌های تست:</strong><br>
                    admin / admin123<br>
                    user / user123
                </div>
            </div>
        </body>
        </html>
      `);
    }

    if (url === '/api/login' && method === 'POST') {
      const { username, password } = body || {};
      
      const user = users[username];
      if (user && user.password === password) {
        const newSessionId = createSession(username);
        response.setHeader('Location', '/dashboard');
        response.setHeader('Set-Cookie', `session=${newSessionId}; Path=/; HttpOnly; Max-Age=86400; SameSite=Lax`);
        return response.status(302).end();
      } else {
        response.setHeader('Location', '/?error=1');
        return response.status(302).end();
      }
    }

    if (url === '/dashboard') {
      if (!user) {
        response.setHeader('Location', '/?error=2');
        return response.status(302).end();
      }

      return sendHTML(`
        <!DOCTYPE html>
        <html dir="rtl" lang="fa">
        <head>
            <meta charset="UTF-8">
            <title>دشبورد - ${user.name}</title>
            <style>
                body { 
                    font-family: Tahoma; 
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    margin: 0; 
                    padding: 20px;
                    color: white;
                }
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    background: rgba(255,255,255,0.1);
                    padding: 30px;
                    border-radius: 15px;
                    backdrop-filter: blur(10px);
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    flex-wrap: wrap;
                    gap: 15px;
                }
                .user-card {
                    background: rgba(255,255,255,0.2);
                    padding: 20px;
                    border-radius: 10px;
                    border-right: 4px solid #4CAF50;
                }
                .btn {
                    background: #4CAF50;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    text-decoration: none;
                    display: inline-block;
                    margin: 5px;
                }
                .btn-danger { background: #ff6b6b; }
                .conversion-area {
                    background: rgba(255,255,255,0.15);
                    padding: 30px;
                    border-radius: 12px;
                    margin: 25px 0;
                    border: 2px dashed rgba(255,255,255,0.3);
                }
                .file-input {
                    width: 100%;
                    padding: 15px;
                    background: rgba(255,255,255,0.9);
                    border: none;
                    border-radius: 8px;
                    margin: 15px 0;
                    color: #333;
                    font-size: 16px;
                }
                .result-box {
                    margin-top: 20px;
                    padding: 20px;
                    border-radius: 8px;
                    background: rgba(255,255,255,0.2);
                    min-height: 60px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div>
                        <h1>🔄 سیستم تبدیل 3D</h1>
                        <p>📍 محیط: ${process.env.NODE_ENV || 'production'} | وضعیت: فعال ✅</p>
                    </div>
                    <div>
                        <a href="/dashboard" class="btn">🏠 دشبورد</a>
                        <a href="/api/logout" class="btn btn-danger">🚪 خروج</a>
                    </div>
                </div>

                <div class="user-card">
                    <h2>👋 خوش آمدید، ${user.name}</h2>
                    <p>سطح دسترسی: ${user.role === 'admin' ? 'مدیر سیستم' : 'کاربر عادی'}</p>
                    <p>آخرین ورود: ${new Date().toLocaleString('fa-IR')}</p>
                </div>

                <div class="conversion-area">
                    <h3>📤 تبدیل تصویر به مدل 3D</h3>
                    <p>تصویر 2D خود را آپلود کنید تا به مدل سه بعدی تبدیل شود</p>
                    
                    <input type="file" id="imageInput" class="file-input" accept="image/*">
                    <div id="fileInfo" style="margin: 15px 0;"></div>
                    
                    <button class="btn" onclick="startConversion()" style="background: #FF9800;">
                        🚀 شروع تبدیل هوشمند
                    </button>
                    
                    <div class="result-box" id="result">
                        <p style="margin: 0; opacity: 0.7;">⏳ منتظر آپلود فایل...</p>
                    </div>
                </div>

                <div style="margin-top: 30px; padding: 20px; background: rgba(0,0,0,0.2); border-radius: 10px;">
                    <h3>📊 وضعیت سیستم</h3>
                    <p>🖥️ پلتفرم: Vercel Serverless | 🔒 احراز هویت: فعال | 👤 کاربران: ${Object.keys(users).length}</p>
                    <p>🕒 زمان سرور: ${new Date().toLocaleString('fa-IR')}</p>
                </div>
            </div>

            <script>
                let currentFile = null;

                document.getElementById('imageInput').addEventListener('change', function(e) {
                    currentFile = e.target.files[0];
                    const fileInfo = document.getElementById('fileInfo');
                    
                    if (currentFile) {
                        fileInfo.innerHTML = \`
                            <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px;">
                                <p>📄 <strong>\${currentFile.name}</strong></p>
                                <p>📊 سایز: \${formatFileSize(currentFile.size)}</p>
                                <p>🎨 نوع: \${currentFile.type || 'ناشناخته'}</p>
                            </div>
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
                    const resultDiv = document.getElementById('result');
                    
                    if (!currentFile) {
                        resultDiv.innerHTML = '<div style="color: #ff6b6b;">❌ لطفا یک فایل انتخاب کنید</div>';
                        return;
                    }

                    resultDiv.innerHTML = \`
                        <div style="text-align: center;">
                            <p>🔍 در حال تحلیل "\${currentFile.name}"...</p>
                            <p>⏳ لطفا صبر کنید</p>
                        </div>
                    \`;

                    // شبیه‌سازی فرآیند تبدیل
                    setTimeout(() => {
                        const success = Math.random() > 0.1; // 90% موفقیت
                        
                        if (success) {
                            resultDiv.innerHTML = \`
                                <div style="color: #4CAF50;">
                                    <p style="font-weight: bold; font-size: 18px;">✅ تبدیل موفق!</p>
                                    <p>🎯 مدل: <strong>مدل سه بعدی پیشرفته</strong></p>
                                    <p>📏 ابعاد: 512×384×256</p>
                                    <p>🔢 vertices: 4,500</p>
                                    <p>💾 حجم: 3.2 MB</p>
                                    <button class="btn" onclick="downloadModel()" style="margin-top: 15px;">
                                        📥 دانلود فایل OBJ
                                    </button>
                                </div>
                            \`;
                        } else {
                            resultDiv.innerHTML = '<div style="color: #ff6b6b;">❌ خطا در پردازش فایل. لطفا مجدد تلاش کنید.</div>';
                        }
                    }, 3000);
                }

                function downloadModel() {
                    alert('✅ فایل مدل 3D با موفقیت دانلود شد!');
                }
            </script>
        </body>
        </html>
      `);
    }

    if (url === '/api/logout') {
      response.setHeader('Location', '/');
      response.setHeader('Set-Cookie', 'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
      return response.status(302).end();
    }

    // 404 - صفحه پیدا نشد
    return sendHTML(`
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head><meta charset="UTF-8"><title>404</title></head>
      <body style="font-family: Tahoma; background: #667eea; color: white; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
          <div style="text-align: center;">
              <h1>❌ 404 - صفحه پیدا نشد</h1>
              <p>صفحه مورد نظر شما وجود ندارد</p>
              <a href="/" style="color: white; background: #4CAF50; padding: 10px 20px; border-radius: 5px; text-decoration: none;">بازگشت به صفحه اصلی</a>
          </div>
      </body>
      </html>
    `, 404);

  } catch (error) {
    console.error('❌ خطا در پردازش درخواست:', error);
    response.status(500).json({ error: 'خطای داخلی سرور' });
  }
}
