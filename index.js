import http from 'http';
import { parse } from 'querystring';
import { randomBytes } from 'crypto';

const PORT = process.env.PORT || 3000;

// ==================== CONFIGURATION ====================
const CONFIG = {
  sessionTimeout: 24 * 60 * 60 * 1000,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  timeout: 8000 // 8 seconds for Vercel
};

// ==================== USER MANAGEMENT ====================
const users = {
  "admin": { "password": "admin123", "role": "admin", "name": "مدیر سیستم" },
  "user": { "password": "user123", "role": "user", "name": "کاربر عادی" }
};

const sessions = {};

// ==================== CORE FUNCTIONS ====================
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
  if (Date.now() - session.timestamp > CONFIG.sessionTimeout) {
    delete sessions[sessionId];
    return null;
  }
  return users[session.username];
}

function parseCookies(request) {
  const cookieHeader = request.headers.cookie;
  if (!cookieHeader) return {};
  
  return cookieHeader.split(';').reduce((acc, cookie) => {
    const [name, value] = cookie.trim().split('=');
    acc[name] = value;
    return acc;
  }, {});
}

// ==================== 3D CONVERSION MODULE ====================
class Conversion3D {
  static analyzeImage(fileData) {
    // شبیه‌سازی تحلیل تصویر - در واقعیت از Canvas API استفاده می‌شود
    return {
      width: 800,
      height: 600,
      complexity: Math.floor(Math.random() * 100),
      colors: ['#ff0000', '#00ff00', '#0000ff'],
      type: 'general'
    };
  }

  static generate3DModel(analysis) {
    // شبیه‌سازی تولید مدل 3D
    return {
      modelId: 'model_' + Date.now(),
      vertices: 5000,
      faces: 8000,
      fileSize: '2.5MB',
      dimensions: '256×256×256'
    };
  }
}

// ==================== ADMIN PANEL MODULE ====================
class AdminPanel {
  static getStats() {
    return {
      totalUsers: Object.keys(users).length,
      activeSessions: Object.keys(sessions).length,
      memoryUsage: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
      uptime: Math.round(process.uptime()) + 's'
    };
  }

  static cleanupSessions() {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [sessionId, session] of Object.entries(sessions)) {
      if (now - session.timestamp > CONFIG.sessionTimeout) {
        delete sessions[sessionId];
        cleaned++;
      }
    }
    
    return { cleaned: cleaned, remaining: Object.keys(sessions).length };
  }
}

// ==================== SHOP MODULE ====================
class ShopManager {
  static products = [
    { id: 1, name: "مدل پایه", price: 0, features: ["تبدیل ساده"] },
    { id: 2, name: "مدل حرفه‌ای", price: 29.99, features: ["تبدیل پیشرفته", "پشتیبانی"] },
    { id: 3, name: "مدل سازمانی", price: 99.99, features: ["همه قابلیت‌ها", "پشتیبانی ویژه"] }
  ];

  static getProducts() {
    return this.products;
  }

  static processOrder(productId, user) {
    const product = this.products.find(p => p.id === productId);
    if (!product) throw new Error('محصول یافت نشد');
    
    return {
      orderId: 'order_' + Date.now(),
      product: product.name,
      price: product.price,
      user: user.name,
      status: 'completed'
    };
  }
}

// ==================== REQUEST HANDLER ====================
function handleRequest(req, res) {
  const startTime = Date.now();
  
  // تنظیم هدرهای CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = req.url.split('?')[0];
  const method = req.method;
  const cookies = parseCookies(req);
  const user = checkSession(cookies.session);

  console.log(`📨 ${method} ${url} - User: ${user ? user.name : 'Guest'}`);

  // مدیریت timeout
  const timeout = setTimeout(() => {
    if (!res.headersSent) {
      sendResponse(res, 503, { error: 'درخواست زمان‌بر شد' });
    }
  }, CONFIG.timeout);

  // مسیرهای API
  if (url.startsWith('/api/')) {
    handleAPI(req, res, url, method, user);
    clearTimeout(timeout);
    return;
  }

  // مسیرهای صفحات
  handlePages(req, res, url, method, user);
  clearTimeout(timeout);
}

// ==================== API HANDLER ====================
function handleAPI(req, res, url, method, user) {
  if (url === '/api/health') {
    sendResponse(res, 200, {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB'
    });
    return;
  }

  if (url === '/api/convert' && method === 'POST') {
    if (!user) {
      sendResponse(res, 401, { error: 'لطفا وارد شوید' });
      return;
    }

    // شبیه‌سازی تبدیل 3D
    const analysis = Conversion3D.analyzeImage({});
    const model = Conversion3D.generate3DModel(analysis);
    
    sendResponse(res, 200, {
      success: true,
      model: model,
      analysis: analysis,
      message: 'تبدیل با موفقیت انجام شد'
    });
    return;
  }

  if (url === '/api/admin/stats' && method === 'GET') {
    if (!user || user.role !== 'admin') {
      sendResponse(res, 403, { error: 'دسترسی غیرمجاز' });
      return;
    }

    const stats = AdminPanel.getStats();
    sendResponse(res, 200, stats);
    return;
  }

  if (url === '/api/admin/cleanup' && method === 'POST') {
    if (!user || user.role !== 'admin') {
      sendResponse(res, 403, { error: 'دسترسی غیرمجاز' });
      return;
    }

    const result = AdminPanel.cleanupSessions();
    sendResponse(res, 200, result);
    return;
  }

  if (url === '/api/shop/products' && method === 'GET') {
    const products = ShopManager.getProducts();
    sendResponse(res, 200, { products });
    return;
  }

  if (url === '/api/shop/order' && method === 'POST') {
    if (!user) {
      sendResponse(res, 401, { error: 'لطفا وارد شوید' });
      return;
    }

    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        const { productId } = parse(body);
        const order = ShopManager.processOrder(parseInt(productId), user);
        sendResponse(res, 200, order);
      } catch (error) {
        sendResponse(res, 400, { error: error.message });
      }
    });
    return;
  }

  sendResponse(res, 404, { error: 'API یافت نشد' });
}

// ==================== PAGES HANDLER ====================
function handlePages(req, res, url, method, user) {
  if (url === '/login' && method === 'GET') {
    if (user) {
      redirect(res, '/');
      return;
    }
    sendHTML(res, generateLoginPage());
    return;
  }

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
        redirect(res, '/login?error=1');
      }
    });
    return;
  }

  if (url === '/logout') {
    const cookies = parseCookies(req);
    if (cookies.session) {
      delete sessions[cookies.session];
    }
    res.writeHead(302, {
      'Location': '/login',
      'Set-Cookie': 'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
    });
    res.end();
    return;
  }

  if (!user && url !== '/login') {
    redirect(res, '/login');
    return;
  }

  if (url === '/') {
    sendHTML(res, generateMainPage(user));
    return;
  }

  if (url === '/admin' && user.role === 'admin') {
    sendHTML(res, generateAdminPage(user));
    return;
  }

  if (url === '/shop') {
    sendHTML(res, generateShopPage(user));
    return;
  }

  if (url === '/convert') {
    sendHTML(res, generateConvertPage(user));
    return;
  }

  sendHTML(res, generate404Page());
}

// ==================== PAGE GENERATORS ====================
function generateLoginPage() {
  return `
  <!DOCTYPE html>
  <html dir="rtl" lang="fa">
  <head>
      <meta charset="UTF-8">
      <title>ورود - سیستم یکپارچه 3D</title>
      <style>
          body { font-family: Tahoma; margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
          .container { background: rgba(255,255,255,0.1); padding: 40px; border-radius: 15px; backdrop-filter: blur(10px); max-width: 400px; width: 100%; }
          .form-group { margin-bottom: 20px; }
          input { width: 100%; padding: 12px; border: none; border-radius: 8px; background: rgba(255,255,255,0.9); }
          button { width: 100%; background: #4CAF50; color: white; border: none; padding: 15px; border-radius: 8px; cursor: pointer; }
      </style>
  </head>
  <body>
      <div class="container">
          <h1 style="text-align: center;">🔐 ورود به سیستم یکپارچه</h1>
          <form action="/login" method="POST">
              <div class="form-group">
                  <label>نام کاربری:</label>
                  <input type="text" name="username" required>
              </div>
              <div class="form-group">
                  <label>رمز عبور:</label>
                  <input type="password" name="password" required>
              </div>
              <button type="submit">🚀 ورود به سیستم</button>
          </form>
          <div style="margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.2); border-radius: 8px;">
              <h3>👥 حساب‌های تست:</h3>
              <p><strong>مدیر سیستم:</strong><br>نام کاربری: admin<br>رمز عبور: admin123</p>
              <p><strong>کاربر عادی:</strong><br>نام کاربری: user<br>رمز عبور: user123</p>
          </div>
      </div>
  </body>
  </html>`;
}

function generateMainPage(user) {
  return `
  <!DOCTYPE html>
  <html dir="rtl" lang="fa">
  <head>
      <meta charset="UTF-8">
      <title>پنل اصلی - سیستم یکپارچه</title>
      <style>
          body { font-family: Tahoma; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; min-height: 100vh; }
          .container { max-width: 1200px; margin: 0 auto; background: rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; backdrop-filter: blur(10px); }
          .nav { display: flex; gap: 10px; margin-bottom: 30px; flex-wrap: wrap; }
          .nav a { background: #4CAF50; color: white; padding: 15px 25px; border-radius: 8px; text-decoration: none; transition: transform 0.3s; }
          .nav a:hover { transform: translateY(-3px); background: #45a049; }
          .admin-btn { background: #ff6b6b !important; }
          .admin-btn:hover { background: #ff5252 !important; }
          .shop-btn { background: #ffa726 !important; }
          .shop-btn:hover { background: #ff9800 !important; }
          .user-info { background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px; margin-bottom: 20px; }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="user-info">
              <h2>👋 خوش آمدید، ${user.name}</h2>
              <p>سطح دسترسی: ${user.role === 'admin' ? 'مدیر سیستم' : 'کاربر عادی'}</p>
              <a href="/logout" style="background: #6c757d; padding: 10px 15px; border-radius: 5px; color: white; text-decoration: none;">🚪 خروج</a>
          </div>
          
          <h1>🏠 پنل اصلی سیستم یکپارچه</h1>
          <p>✅ تمام ماژول‌ها در یک سرور مرکزی فعال هستند</p>
          
          <div class="nav">
              <a href="/convert">🔄 تبدیل 3D</a>
              <a href="/shop" class="shop-btn">🛍️ فروشگاه</a>
              ${user.role === 'admin' ? '<a href="/admin" class="admin-btn">⚙️ پنل مدیریت</a>' : ''}
              <a href="/api/health" target="_blank">❤️ سلامت سیستم</a>
          </div>

          <div style="background: rgba(255,255,255,0.15); padding: 20px; border-radius: 10px; margin-top: 30px;">
              <h3>📊 وضعیت سیستم</h3>
              <p>✅ سرور مرکزی: فعال</p>
              <p>✅ ماژول تبدیل 3D: یکپارچه</p>
              <p>✅ ماژول فروشگاه: یکپارچه</p>
              <p>✅ ماژول مدیریت: ${user.role === 'admin' ? 'فعال' : 'غیرفعال'}</p>
              <p>🌐 پورت: ${PORT} | ⏰ آپتایم: ${Math.round(process.uptime())} ثانیه</p>
          </div>
      </div>
  </body>
  </html>`;
}

function generateConvertPage(user) {
  return `
  <!DOCTYPE html>
  <html dir="rtl" lang="fa">
  <head>
      <meta charset="UTF-8">
      <title>تبدیل 3D - سیستم یکپارچه</title>
      <style>
          body { font-family: Tahoma; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; min-height: 100vh; }
          .container { max-width: 800px; margin: 0 auto; background: rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; backdrop-filter: blur(10px); }
          button { background: #4CAF50; color: white; border: none; padding: 15px 30px; border-radius: 8px; cursor: pointer; margin: 10px; }
          button:hover { background: #45a049; }
          .result { background: rgba(255,255,255,0.15); padding: 20px; border-radius: 10px; margin-top: 20px; display: none; }
      </style>
  </head>
  <body>
      <div class="container">
          <a href="/" style="color: white; text-decoration: none;">← بازگشت به صفحه اصلی</a>
          <h1>🔄 تبدیل 3D - یکپارچه</h1>
          <p>ماژول تبدیل در همان سرور مرکزی اجرا می‌شود</p>
          
          <button onclick="startConversion()">🚀 شروع تبدیل پیشرفته</button>
          
          <div id="result" class="result"></div>
      </div>

      <script>
          async function startConversion() {
              const resultDiv = document.getElementById('result');
              resultDiv.style.display = 'block';
              resultDiv.innerHTML = '<p>🔍 در حال پردازش...</p>';
              
              try {
                  const response = await fetch('/api/convert', { method: 'POST' });
                  const data = await response.json();
                  
                  if (data.success) {
                      resultDiv.innerHTML = \`
                          <h3>✅ تبدیل موفق</h3>
                          <p>مدل: \${data.model.modelId}</p>
                          <p>vertices: \${data.model.vertices}</p>
                          <p>ابعاد: \${data.model.dimensions}</p>
                      \`;
                  } else {
                      resultDiv.innerHTML = '<p style="color: #ff6b6b;">❌ خطا در تبدیل</p>';
                  }
              } catch (error) {
                  resultDiv.innerHTML = '<p style="color: #ff6b6b;">❌ خطای ارتباط با سرور</p>';
              }
          }
      </script>
  </body>
  </html>`;
}

function generateShopPage(user) {
  return `
  <!DOCTYPE html>
  <html dir="rtl" lang="fa">
  <head>
      <meta charset="UTF-8">
      <title>فروشگاه - سیستم یکپارچه</title>
      <style>
          body { font-family: Tahoma; margin: 0; padding: 20px; background: linear-gradient(135deg, #ffa726 0%, #ff9800 100%); color: white; min-height: 100vh; }
          .container { max-width: 1000px; margin: 0 auto; background: rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; backdrop-filter: blur(10px); }
          .products { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-top: 30px; }
          .product { background: rgba(255,255,255,0.15); padding: 20px; border-radius: 10px; }
          .product button { background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; width: 100%; }
      </style>
  </head>
  <body>
      <div class="container">
          <a href="/" style="color: white; text-decoration: none;">← بازگشت به صفحه اصلی</a>
          <h1>🛍️ فروشگاه - یکپارچه</h1>
          <p>ماژول فروشگاه در همان سرور مرکزی اجرا می‌شود</p>
          
          <div class="products" id="products"></div>
      </div>

      <script>
          async function loadProducts() {
              try {
                  const response = await fetch('/api/shop/products');
                  const data = await response.json();
                  
                  const productsDiv = document.getElementById('products');
                  productsDiv.innerHTML = data.products.map(product => \`
                      <div class="product">
                          <h3>\${product.name}</h3>
                          <p>قیمت: \${product.price === 0 ? 'رایگان' : '\$' + product.price}</p>
                          <ul>\${product.features.map(f => '<li>' + f + '</li>').join('')}</ul>
                          <button onclick="buyProduct(\${product.id})">خرید</button>
                      </div>
                  \`).join('');
              } catch (error) {
                  console.error('خطا در بارگذاری محصولات:', error);
              }
          }
          
          async function buyProduct(productId) {
              try {
                  const response = await fetch('/api/shop/order', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                      body: 'productId=' + productId
                  });
                  const data = await response.json();
                  alert('✅ سفارش شما ثبت شد: ' + data.orderId);
              } catch (error) {
                  alert('❌ خطا در ثبت سفارش');
              }
          }
          
          loadProducts();
      </script>
  </body>
  </html>`;
}

function generateAdminPage(user) {
  return `
  <!DOCTYPE html>
  <html dir="rtl" lang="fa">
  <head>
      <meta charset="UTF-8">
      <title>مدیریت - سیستم یکپارچه</title>
      <style>
          body { font-family: Tahoma; margin: 0; padding: 20px; background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%); color: white; min-height: 100vh; }
          .container { max-width: 1000px; margin: 0 auto; background: rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; backdrop-filter: blur(10px); }
          .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
          .stat-box { background: rgba(255,255,255,0.15); padding: 15px; border-radius: 8px; text-align: center; }
          button { background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin: 5px; }
      </style>
  </head>
  <body>
      <div class="container">
          <a href="/" style="color: white; text-decoration: none;">← بازگشت به صفحه اصلی</a>
          <h1>⚙️ پنل مدیریت - یکپارچه</h1>
          <p>ماژول مدیریت در همان سرور مرکزی اجرا می‌شود</p>
          
          <div class="stats" id="stats"></div>
          
          <button onclick="loadStats()">🔄 بروزرسانی آمار</button>
          <button onclick="cleanupSessions()">🧹 پاکسازی سشن‌ها</button>
      </div>

      <script>
          async function loadStats() {
              try {
                  const response = await fetch('/api/admin/stats');
                  const data = await response.json();
                  
                  const statsDiv = document.getElementById('stats');
                  statsDiv.innerHTML = \`
                      <div class="stat-box">
                          <h3>👥 کاربران</h3>
                          <p>\${data.totalUsers} کاربر</p>
                      </div>
                      <div class="stat-box">
                          <h3>🔐 سشن‌ها</h3>
                          <p>\${data.activeSessions} فعال</p>
                      </div>
                      <div class="stat-box">
                          <h3>🧠 حافظه</h3>
                          <p>\${data.memoryUsage}</p>
                      </div>
                      <div class="stat-box">
                          <h3>⏰ آپتایم</h3>
                          <p>\${data.uptime}</p>
                      </div>
                  \`;
              } catch (error) {
                  console.error('خطا در بارگذاری آمار:', error);
              }
          }
          
          async function cleanupSessions() {
              try {
                  const response = await fetch('/api/admin/cleanup', { method: 'POST' });
                  const data = await response.json();
                  alert('✅ سشن‌های منقضی پاکسازی شد: ' + data.cleaned);
                  loadStats();
              } catch (error) {
                  alert('❌ خطا در پاکسازی');
              }
          }
          
          loadStats();
      </script>
  </body>
  </html>`;
}

function generate404Page() {
  return `
  <!DOCTYPE html>
  <html dir="rtl" lang="fa">
  <head><meta charset="UTF-8"><title>404</title></head>
  <body style="font-family: Tahoma; text-align: center; padding: 50px; background: #667eea; color: white;">
      <h1>❌ 404 - صفحه مورد نظر یافت نشد</h1>
      <a href="/" style="color: white;">بازگشت به صفحه اصلی</a>
  </body>
  </html>`;
}

// ==================== UTILITY FUNCTIONS ====================
function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-cache'
  });
  res.end(JSON.stringify(data));
}

function sendHTML(res, html) {
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-cache'
  });
  res.end(html);
}

function redirect(res, location) {
  res.writeHead(302, { 'Location': location });
  res.end();
}

// ==================== SERVER INITIALIZATION ====================
const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`
🎉 سیستم یکپارچه راه‌اندازی شد
📍 پورت: ${PORT}
🏠 صفحه اصلی: /
🔄 تبدیل 3D: /convert  
🛍️ فروشگاه: /shop
⚙️ مدیریت: /admin
❤️ سلامت: /api/health
✅ تمام ماژول‌ها در یک سرور مرکزی
🕒 زمان: ${new Date().toLocaleString('fa-IR')}
  `);
});

// مدیریت خطاها
process.on('uncaughtException', (error) => {
  console.error('💥 خطای بحرانی:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 خطای Promise:', reason);
});

export default server;
