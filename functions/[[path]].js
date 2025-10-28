export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // هندل API routes
  if (url.pathname.startsWith('/api/')) {
    return handleAPI(request, env, url);
  }
  
  // سرو فایل‌های استاتیک
  return handleStatic(request, url);
}

async function handleAPI(request, env, url) {
  const path = url.pathname.replace('/api/', '');
  
  try {
    switch (path) {
      case 'stats':
        return await handleStats();
      case 'transactions':
        if (request.method === 'GET') return await getTransactions();
        if (request.method === 'POST') return await createTransaction(request);
        break;
      case 'withdrawals':
        if (request.method === 'POST') return await createWithdrawal(request);
        break;
      default:
        return jsonResponse({ error: 'Endpoint not found' }, 404);
    }
  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
}

// هندلرهای API
async function handleStats() {
  const stats = {
    totalRevenue: 1250.50,
    totalProfit: 375.15,
    totalTransactions: 8,
    activeUsers: 47,
    conversionRate: 12.5,
    todayTransactions: 2,
    timestamp: new Date().toISOString()
  };
  
  return jsonResponse({ success: true, data: stats });
}

async function getTransactions() {
  const transactions = [
    {
      id: 1,
      user_id: 101,
      amount: 100,
      profit: 30,
      currency: 'USD',
      description: 'تبدیل تصویر پرتره به 3D',
      status: 'completed',
      created_at: new Date('2024-01-15T10:30:00Z').toISOString()
    },
    {
      id: 2,
      user_id: 102,
      amount: 150,
      profit: 45,
      currency: 'USD',
      description: 'تبدیل تصویر محصول به 3D',
      status: 'completed',
      created_at: new Date('2024-01-15T11:15:00Z').toISOString()
    }
  ];
  
  return jsonResponse({ success: true, data: transactions });
}

async function createTransaction(request) {
  const data = await request.json();
  const newTransaction = {
    id: Date.now(),
    ...data,
    profit: data.amount * 0.30,
    status: 'completed',
    created_at: new Date().toISOString()
  };
  
  return jsonResponse({ success: true, transaction: newTransaction });
}

async function createWithdrawal(request) {
  const data = await request.json();
  const newWithdrawal = {
    id: Date.now(),
    ...data,
    status: 'pending',
    created_at: new Date().toISOString()
  };
  
  return jsonResponse({ success: true, withdrawal: newWithdrawal });
}

// هندل فایل‌های استاتیک
async function handleStatic(request, url) {
  const path = url.pathname;
  
  // صفحه اصلی
  if (path === '/' || path === '') {
    return serveHTML(`
      <!DOCTYPE html>
      <html lang="fa" dir="rtl">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>سرویس تبدیل 3D</title>
          <style>
              body { 
                  font-family: Tahoma, Arial, sans-serif; 
                  text-align: center; 
                  padding: 50px; 
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                  margin: 0;
                  min-height: 100vh;
                  display: flex;
                  align-items: center;
                  justify-content: center;
              }
              .container {
                  background: rgba(255,255,255,0.1);
                  padding: 40px;
                  border-radius: 15px;
                  backdrop-filter: blur(10px);
                  max-width: 600px;
                  width: 90%;
              }
              h1 {
                  margin-bottom: 20px;
                  font-size: 2.5em;
              }
              p {
                  margin-bottom: 30px;
                  font-size: 1.2em;
                  line-height: 1.6;
              }
              .links {
                  display: flex;
                  gap: 15px;
                  justify-content: center;
                  flex-wrap: wrap;
              }
              a {
                  color: white;
                  text-decoration: none;
                  background: #3498db;
                  padding: 15px 30px;
                  border-radius: 8px;
                  display: inline-block;
                  transition: all 0.3s;
                  font-weight: bold;
              }
              a:hover {
                  background: #2980b9;
                  transform: translateY(-2px);
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>🚀 سرویس تبدیل تصویر 2D به 3D</h1>
              <p>سیستم مدیریت مالی حرفه‌ای با قابلیت برداشت لحظه‌ای و پنل مدیریت Real-time</p>
              <div class="links">
                  <a href="/admin/live-management-panel.html">🎯 پنل مدیریت اصلی</a>
                  <a href="/admin/profit-dashboard.html">💰 دشبورد مالی</a>
              </div>
          </div>
      </body>
      </html>
    `);
  }
  
  // برای فایل‌های استاتیک، اجازه می‌دهیم Cloudflare Pages به صورت خودکار سرو کند
  return new Response('File not found', { status: 404 });
}

// helper functions
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

function serveHTML(html, status = 200) {
  return new Response(html, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
