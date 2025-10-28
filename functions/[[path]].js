export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // هندل API routes
  if (url.pathname.startsWith('/api/')) {
    return handleAPI(request, env, url);
  }
  
  // برای فایل‌های استاتیک، هیچ کاری نکن - Cloudflare Pages خودش هندل می‌کند
  return new Response(null, { status: 404 });
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
