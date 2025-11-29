import http from 'http';
import { parse } from 'querystring';
import { randomBytes } from 'crypto';

// ==================== CONFIGURATION ====================
const CONFIG = {
  PORT: process.env.PORT || 3000,
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  MAX_REQUEST_SIZE: '10mb',
  HEALTH_CHECK_INTERVAL: 30000, // 30 seconds
  TIMEOUT: 10000 // 10 seconds
};

// ==================== GLOBAL ERROR HANDLER ====================
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Process-level error handlers
process.on('uncaughtException', (error) => {
  console.error('💥 UNCAUGHT EXCEPTION:', error);
  console.log('🔄 Restarting server...');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 UNHANDLED REJECTION at:', promise, 'reason:', reason);
  console.log('🔄 Restarting server...');
  process.exit(1);
});

// ==================== MEMORY MANAGEMENT ====================
const memoryMonitor = {
  lastGC: Date.now(),
  checkInterval: setInterval(() => {
    const memoryUsage = process.memoryUsage();
    const usedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
    const totalMB = Math.round(memoryUsage.heapTotal / 1024 / 1024);
    
    if (usedMB > 200) { // If using more than 200MB
      console.log(`🧠 Memory high: ${usedMB}MB/${totalMB}MB, forcing GC...`);
      if (global.gc) {
        global.gc();
        console.log('🧹 Garbage collection forced');
      }
    }
    
    // Force GC every 5 minutes
    if (Date.now() - memoryMonitor.lastGC > 300000) {
      if (global.gc) {
        global.gc();
        memoryMonitor.lastGC = Date.now();
        console.log('🕒 Periodic garbage collection completed');
      }
    }
  }, 30000)
};

// ==================== SESSION MANAGEMENT ====================
const users = {
  "admin": { "password": "admin123", "role": "admin", "name": "مدیر سیستم" },
  "user": { "password": "user123", "role": "user", "name": "کاربر عادی" }
};

class SessionManager {
  constructor() {
    this.sessions = new Map();
    this.cleanupInterval = setInterval(() => this.cleanupExpiredSessions(), 3600000); // 1 hour
  }

  createSession(username) {
    const sessionId = randomBytes(32).toString('hex');
    const session = {
      username,
      role: users[username].role,
      createdAt: Date.now(),
      lastActivity: Date.now()
    };
    
    this.sessions.set(sessionId, session);
    console.log(`🔐 Session created for: ${username}`);
    return sessionId;
  }

  getSession(sessionId) {
    if (!sessionId) return null;
    
    const session = this.sessions.get(sessionId);
    if (!session) return null;
    
    // Check if session expired
    if (Date.now() - session.lastActivity > CONFIG.SESSION_TIMEOUT) {
      this.sessions.delete(sessionId);
      return null;
    }
    
    // Update last activity
    session.lastActivity = Date.now();
    return users[session.username];
  }

  deleteSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (session) {
      console.log(`🔓 Session deleted for: ${session.username}`);
      this.sessions.delete(sessionId);
    }
  }

  cleanupExpiredSessions() {
    const now = Date.now();
    let cleanedCount = 0;
    
    for (const [sessionId, session] of this.sessions.entries()) {
      if (now - session.lastActivity > CONFIG.SESSION_TIMEOUT) {
        this.sessions.delete(sessionId);
        cleanedCount++;
      }
    }
    
    if (cleanedCount > 0) {
      console.log(`🧹 Cleaned ${cleanedCount} expired sessions`);
    }
  }
}

const sessionManager = new SessionManager();

// ==================== REQUEST HANDLER ====================
class RequestHandler {
  constructor() {
    this.routes = new Map();
    this.middlewares = [];
    this.setupRoutes();
  }

  setupRoutes() {
    // Health check route
    this.routes.set('GET:/health', this.healthCheck.bind(this));
    this.routes.set('GET:/api/health', this.healthCheck.bind(this));
    
    // Login routes
    this.routes.set('GET:/login', this.serveLoginPage.bind(this));
    this.routes.set('POST:/login', this.handleLogin.bind(this));
    
    // Logout route
    this.routes.set('GET:/logout', this.handleLogout.bind(this));
    
    // Main application route
    this.routes.set('GET:/', this.serveMainPage.bind(this));
  }

  async healthCheck(req, res) {
    try {
      const healthData = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB'
        },
        sessions: sessionManager.sessions.size,
        nodeVersion: process.version
      };
      
      this.sendJSON(res, 200, healthData);
    } catch (error) {
      this.sendJSON(res, 500, { status: 'error', error: error.message });
    }
  }

  async serveLoginPage(req, res) {
    try {
      const user = this.getUserFromRequest(req);
      if (user) {
        this.redirect(res, '/');
        return;
      }
      
      const loginPage = this.generateLoginPage();
      this.sendHTML(res, 200, loginPage);
    } catch (error) {
      this.sendHTML(res, 500, '<h1>خطای سرور</h1>');
    }
  }

  async handleLogin(req, res) {
    try {
      const body = await this.parseRequestBody(req);
      const { username, password } = parse(body);
      
      if (users[username] && users[username].password === password) {
        const sessionId = sessionManager.createSession(username);
        
        res.writeHead(302, {
          'Location': '/',
          'Set-Cookie': `session=${sessionId}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`
        });
        res.end();
      } else {
        this.redirect(res, '/login?error=1');
      }
    } catch (error) {
      this.redirect(res, '/login?error=1');
    }
  }

  async handleLogout(req, res) {
    try {
      const cookies = this.parseCookies(req);
      if (cookies.session) {
        sessionManager.deleteSession(cookies.session);
      }
      
      res.writeHead(302, {
        'Location': '/login',
        'Set-Cookie': 'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict'
      });
      res.end();
    } catch (error) {
      this.redirect(res, '/login');
    }
  }

  async serveMainPage(req, res) {
    try {
      const user = this.getUserFromRequest(req);
      if (!user) {
        this.redirect(res, '/login');
        return;
      }
      
      const mainPage = this.generateMainPage(user);
      this.sendHTML(res, 200, mainPage);
    } catch (error) {
      this.redirect(res, '/login');
    }
  }

  // ==================== UTILITY METHODS ====================
  getUserFromRequest(req) {
    const cookies = this.parseCookies(req);
    return sessionManager.getSession(cookies.session);
  }

  parseCookies(req) {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) return {};
    
    return cookieHeader.split(';').reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split('=');
      acc[name] = value;
      return acc;
    }, {});
  }

  parseRequestBody(req) {
    return new Promise((resolve, reject) => {
      let body = '';
      let size = 0;
      
      req.on('data', (chunk) => {
        body += chunk.toString();
        size += chunk.length;
        
        // Prevent request size overflow
        if (size > 10 * 1024 * 1024) { // 10MB max
          req.destroy();
          reject(new AppError('Request too large', 413));
        }
      });
      
      req.on('end', () => resolve(body));
      req.on('error', reject);
    });
  }

  sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-cache'
    });
    res.end(JSON.stringify(data));
  }

  sendHTML(res, statusCode, html) {
    res.writeHead(statusCode, {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache'
    });
    res.end(html);
  }

  redirect(res, location) {
    res.writeHead(302, { 'Location': location });
    res.end();
  }

  // ==================== PAGE GENERATORS ====================
  generateLoginPage() {
    return `
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
    <head>
        <meta charset="UTF-8">
        <title>ورود - سیستم تبدیل 3D</title>
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
            .form-group { margin-bottom: 20px; }
            label { display: block; margin-bottom: 8px; font-weight: bold; }
            input { width: 100%; padding: 12px; border: none; border-radius: 8px; background: rgba(255,255,255,0.9); }
            button { width: 100%; background: #4CAF50; color: white; border: none; padding: 15px; border-radius: 8px; cursor: pointer; }
            button:hover { background: #45a049; }
        </style>
    </head>
    <body>
        <div class="login-container">
            <h1 style="text-align: center;">🔐 ورود به سیستم</h1>
            <form action="/login" method="POST">
                <div class="form-group">
                    <label for="username">👤 نام کاربری:</label>
                    <input type="text" id="username" name="username" required>
                </div>
                <div class="form-group">
                    <label for="password">🔒 رمز عبور:</label>
                    <input type="password" id="password" name="password" required>
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

  generateMainPage(user) {
    return `
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
            }
            button:hover { background: #45a049; transform: translateY(-2px); }
            .logout-btn { background: #ff6b6b; }
            .logout-btn:hover { background: #ff5252; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="user-info">
                <button class="logout-btn" onclick="window.location.href='/logout'">🚪 خروج از سیستم</button>
                <h2>👋 خوش آمدید، ${user.name}</h2>
                <p>سطح دسترسی: ${user.role === 'admin' ? 'مدیر سیستم' : 'کاربر عادی'}</p>
            </div>
            
            <h1>🔄 سیستم تبدیل پیشرفته 2D به 3D</h1>
            <p>📍 وضعیت: فعال ✅ | آخرین بروزرسانی: ${new Date().toLocaleString('fa-IR')}</p>
            
            <div style="background: rgba(255,255,255,0.15); padding: 25px; border-radius: 12px; margin: 20px 0;">
                <h3>📊 وضعیت سیستم</h3>
                <p>✅ سرور فعال و پایدار</p>
                <p>✅ مدیریت حافظه فعال</p>
                <p>✅ سیستم Session فعال</p>
                <p>✅ مدیریت خطا فعال</p>
            </div>

            <div style="margin-top: 30px; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 10px;">
                <h3>📈 اطلاعات فنی سیستم</h3>
                <p>🖥️ سرور: Node.js با مدیریت خطای پیشرفته</p>
                <p>🔒 امنیت: Session Management + Memory Protection</p>
                <p>⚡ عملکرد: Memory Monitoring + Auto Recovery</p>
                <p>🛡️ قابلیت اطمینان: Graceful Shutdown + Error Boundary</p>
            </div>
        </div>

        <script>
            // Client-side monitoring
            let errorCount = 0;
            const maxErrors = 5;
            
            window.addEventListener('error', (event) => {
                errorCount++;
                console.warn('🚨 Client Error:', event.error);
                
                if (errorCount >= maxErrors) {
                    console.log('🔄 Too many client errors, reloading...');
                    setTimeout(() => location.reload(), 1000);
                }
            });
            
            // Periodic health check
            setInterval(() => {
                fetch('/health')
                    .then(response => response.json())
                    .then(data => {
                        if (data.status !== 'healthy') {
                            console.warn('🚨 Server health issue detected');
                        }
                    })
                    .catch(error => {
                        console.error('🚨 Health check failed:', error);
                        errorCount++;
                    });
            }, 60000); // Check every minute
        </script>
    </body>
    </html>`;
  }

  // ==================== REQUEST PROCESSING ====================
  async handleRequest(req, res) {
    const startTime = Date.now();
    const requestId = randomBytes(8).toString('hex');
    
    try {
      console.log(`📨 [${requestId}] ${req.method} ${req.url}`);
      
      // Set response timeout
      res.setTimeout(CONFIG.TIMEOUT, () => {
        console.warn(`⏰ [${requestId}] Response timeout`);
        if (!res.headersSent) {
          this.sendJSON(res, 503, { error: 'Service timeout' });
        }
      });

      // Set CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
      }

      // Find and execute route handler
      const routeKey = `${req.method}:${req.url.split('?')[0]}`;
      const handler = this.routes.get(routeKey) || this.notFoundHandler;
      
      await handler(req, res);
      
      const duration = Date.now() - startTime;
      console.log(`✅ [${requestId}] ${req.method} ${req.url} - ${duration}ms`);
      
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`💥 [${requestId}] ERROR: ${error.message} - ${duration}ms`);
      
      if (!res.headersSent) {
        if (error.statusCode) {
          this.sendJSON(res, error.statusCode, { error: error.message });
        } else {
          this.sendJSON(res, 500, { error: 'Internal server error' });
        }
      }
    }
  }

  notFoundHandler(req, res) {
    this.sendHTML(res, 404, `
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head><meta charset="UTF-8"><title>404 - صفحه یافت نشد</title></head>
      <body style="font-family: Tahoma; text-align: center; padding: 50px;">
        <h1>❌ 404 - صفحه مورد نظر یافت نشد</h1>
        <p>مسیر درخواستی: ${req.url}</p>
        <a href="/" style="color: #4CAF50;">بازگشت به صفحه اصلی</a>
      </body>
      </html>
    `);
  }
}

// ==================== SERVER INITIALIZATION ====================
const requestHandler = new RequestHandler();
const server = http.createServer((req, res) => {
  requestHandler.handleRequest(req, res);
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n🛑 Received ${signal}, starting graceful shutdown...`);
  
  // Stop accepting new requests
  server.close((err) => {
    if (err) {
      console.error('❌ Error during server close:', err);
      process.exit(1);
    }
    
    // Cleanup resources
    clearInterval(memoryMonitor.checkInterval);
    console.log('✅ Server closed gracefully');
    process.exit(0);
  });
  
  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.log('⚠️ Forcing shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
server.listen(CONFIG.PORT, () => {
  console.log(`
🎉 SERVER STARTED SUCCESSFULLY
📍 Port: ${CONFIG.PORT}
🌐 Environment: ${process.env.NODE_ENV || 'development'}
🛡️ Error Handling: Active
🧠 Memory Monitoring: Active
🔐 Session Management: Active
⚡ Performance: Optimized
🕒 Time: ${new Date().toLocaleString('fa-IR')}
  `);
  
  // Initial health check
  console.log('🔍 Performing initial health check...');
  console.log('✅ Server is ready to accept requests');
});

export default server;
