export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // هندل API routes
  if (url.pathname.startsWith('/api/')) {
    return handleAPI(request, env, url);
  }
  
  // سرو فایل‌های استاتیک
  return handleStatic(request, env, url);
}

async function handleAPI(request, env, url) {
  const path = url.pathname.replace('/api/', '');
  
  try {
    switch (path) {
      case 'stats':
        return await handleStats(env);
      case 'transactions':
        return await handleTransactions(request, env);
      case 'withdrawals':
        return await handleWithdrawals(request, env);
      default:
        return new Response(JSON.stringify({
          success: false,
          error: 'Endpoint not found'
        }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

async function handleStats(env) {
  // استفاده از KV برای ذخیره داده‌ها
  const stats = await env.KV_3D.get('stats', { type: 'json' }) || {
    totalRevenue: 1250.50,
    totalProfit: 375.15,
    totalTransactions: 8,
    activeUsers: 47,
    conversionRate: 12.5,
    todayTransactions: 2
  };

  return new Response(JSON.stringify({
    success: true,
    data: stats,
    timestamp: new Date().toISOString()
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

async function handleTransactions(request, env) {
  if (request.method === 'GET') {
    const transactions = await env.KV_3D.get('transactions', { type: 'json' }) || [];
    
    return new Response(JSON.stringify({
      success: true,
      data: transactions,
      total: transactions.length
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
  
  if (request.method === 'POST') {
    const data = await request.json();
    const transactions = await env.KV_3D.get('transactions', { type: 'json' }) || [];
    
    const newTransaction = {
      id: transactions.length + 1,
      ...data,
      profit: data.amount * 0.30,
      status: 'completed',
      created_at: new Date().toISOString()
    };
    
    transactions.unshift(newTransaction);
    await env.KV_3D.put('transactions', JSON.stringify(transactions));
    
    // آپدیت آمار
    await updateStats(env, data.amount, data.amount * 0.30);
    
    return new Response(JSON.stringify({
      success: true,
      transaction: newTransaction
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
  
  return new Response(JSON.stringify({
    success: false,
    error: 'Method not allowed'
  }), { status: 405 });
}

async function handleWithdrawals(request, env) {
  if (request.method === 'POST') {
    const data = await request.json();
    const withdrawals = await env.KV_3D.get('withdrawals', { type: 'json' }) || [];
    
    const newWithdrawal = {
      id: withdrawals.length + 1,
      ...data,
      status: 'pending',
      created_at: new Date().toISOString(),
      completed_at: null
    };
    
    withdrawals.push(newWithdrawal);
    await env.KV_3D.put('withdrawals', JSON.stringify(withdrawals));
    
    return new Response(JSON.stringify({
      success: true,
      withdrawal: newWithdrawal
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
  
  return new Response(JSON.stringify({
    success: false,
    error: 'Method not allowed'
  }), { status: 405 });
}

async function updateStats(env, amount, profit) {
  const stats = await env.KV_3D.get('stats', { type: 'json' }) || {
    totalRevenue: 0,
    totalProfit: 0,
    totalTransactions: 0,
    activeUsers: 0,
    conversionRate: 12.5,
    todayTransactions: 0
  };
  
  stats.totalRevenue += amount;
  stats.totalProfit += profit;
  stats.totalTransactions += 1;
  stats.todayTransactions += 1;
  
  await env.KV_3D.put('stats', JSON.stringify(stats));
}

async function handleStatic(request, env, url) {
  // هندل کردن مسیرهای مختلف
  const path = url.pathname;
  
  if (path === '/') {
    return serveFile('index.html', env);
  }
  
  if (path.startsWith('/admin/')) {
    const file = path.replace('/admin/', '');
    return serveFile(`admin/${file}`, env);
  }
  
  if (path.startsWith('/js/')) {
    const file = path.replace('/js/', '');
    return serveFile(`js/${file}`, env);
  }
  
  if (path.startsWith('/css/')) {
    const file = path.replace('/css/', '');
    return serveFile(`css/${file}`, env);
  }
  
  // اگر فایل پیدا نشد، index.html برگردان
  return serveFile('index.html', env);
}

async function serveFile(filename, env) {
  try {
    const file = await env.ASSETS.fetch(`https://assets.tetrashop.com/${filename}`);
    if (file.status === 200) {
      return file;
    }
  } catch (error) {
    console.error('Error serving file:', error);
  }
  
  // Fallback: برگرداندن صفحه اصلی
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>3D Conversion Service</title>
    <meta http-equiv="refresh" content="0; url=/admin/live-management-panel.html">
  </head>
  <body>
    <p>Redirecting...</p>
  </body>
  </html>`;
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}
