const WebSocket = require('ws');

// استفاده از همان دیتابیس شبیه‌سازی شده
let database = {
    transactions: [
        {
            id: 1,
            user_id: 101,
            amount: 100.00,
            profit: 30.00,
            currency: 'USD',
            description: 'تبدیل تصویر پرتره به 3D',
            status: 'completed',
            created_at: new Date('2024-01-15T10:30:00Z')
        }
    ],
    withdrawals: []
};

const wss = new WebSocket.Server({ port: 8080 });

console.log('🚀 WebSocket Server running on port 8080');

// مدیریت اتصال کلاینت‌ها
wss.on('connection', (ws) => {
    console.log('🔗 کلاینت جدید متصل شد');

    // ارسال داده‌های اولیه
    sendInitialData(ws);

    // گوش دادن به پیام‌های کلاینت
    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message);
            console.log('📨 پیام دریافتی:', data);
            
            switch (data.action) {
                case 'subscribe_stats':
                    // مشترک شدن در آمار Real-time
                    break;
                    
                case 'new_transaction':
                    // ثبت تراکنش جدید
                    await handleNewTransaction(data.data);
                    broadcastToAll({ 
                        type: 'transaction_update', 
                        data: data.data 
                    });
                    break;
                    
                case 'withdrawal_request':
                    // درخواست برداشت
                    await handleWithdrawalRequest(data.data);
                    broadcastToAll({ 
                        type: 'withdrawal_update', 
                        data: data.data 
                    });
                    break;
                    
                case 'ping':
                    // پاسخ به ping
                    ws.send(JSON.stringify({ type: 'pong' }));
                    break;
            }
        } catch (error) {
            console.error('Error processing message:', error);
            ws.send(JSON.stringify({ 
                type: 'error', 
                message: error.message 
            }));
        }
    });

    ws.on('close', () => {
        console.log('🔌 کلاینت قطع شد');
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

// ارسال داده‌های اولیه
async function sendInitialData(ws) {
    try {
        const completedTransactions = database.transactions.filter(t => t.status === 'completed');
        
        const stats = {
            totalRevenue: completedTransactions.reduce((sum, t) => sum + t.amount, 0),
            totalProfit: completedTransactions.reduce((sum, t) => sum + t.profit, 0),
            totalTransactions: completedTransactions.length,
            activeUsers: new Set(completedTransactions.map(t => t.user_id)).size,
            conversionRate: 12.5
        };

        ws.send(JSON.stringify({
            type: 'initial_data',
            data: {
                stats,
                recentTransactions: database.transactions.slice(0, 5)
            }
        }));
        
        console.log('✅ داده‌های اولیه ارسال شد');
    } catch (error) {
        console.error('Error sending initial data:', error);
    }
}

// مدیریت تراکنش جدید
async function handleNewTransaction(transactionData) {
    try {
        const { user_id, amount, currency = 'USD', description } = transactionData;
        const profit = amount * 0.30;

        const newTransaction = {
            id: database.transactions.length + 1,
            user_id: user_id || Math.floor(Math.random() * 1000) + 100,
            amount: parseFloat(amount),
            profit: parseFloat(profit.toFixed(2)),
            currency,
            description: description || 'پرداخت سرویس تبدیل 3D',
            status: 'completed',
            created_at: new Date()
        };

        database.transactions.unshift(newTransaction);
        console.log('✅ تراکنش جدید ثبت شد:', newTransaction);
        
        return newTransaction;
    } catch (error) {
        console.error('Error handling new transaction:', error);
        throw error;
    }
}

// مدیریت درخواست برداشت
async function handleWithdrawalRequest(withdrawalData) {
    try {
        const { amount, currency, wallet_address, network } = withdrawalData;

        const newWithdrawal = {
            id: database.withdrawals.length + 1,
            amount: parseFloat(amount),
            currency,
            wallet_address,
            network: network || (currency.includes('TRC20') ? 'TRC20' : 'ERC20'),
            status: 'pending',
            tx_hash: null,
            created_at: new Date(),
            completed_at: null
        };

        database.withdrawals.push(newWithdrawal);
        console.log('✅ درخواست برداشت ثبت شد:', newWithdrawal);
        
        return newWithdrawal;
    } catch (error) {
        console.error('Error handling withdrawal request:', error);
        throw error;
    }
}

// ارسال به همه کلاینت‌ها
function broadcastToAll(message) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

// بروزرسانی دوره‌ی آمار هر 5 ثانیه
setInterval(async () => {
    try {
        const completedTransactions = database.transactions.filter(t => t.status === 'completed');
        
        const stats = {
            totalRevenue: completedTransactions.reduce((sum, t) => sum + t.amount, 0),
            totalProfit: completedTransactions.reduce((sum, t) => sum + t.profit, 0),
            totalTransactions: completedTransactions.length,
            activeUsers: new Set(
                database.transactions
                    .filter(t => new Date(t.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000))
                    .map(t => t.user_id)
            ).size,
            conversionRate: 12.5
        };

        broadcastToAll({
            type: 'stats_update',
            data: stats,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error broadcasting stats:', error);
    }
}, 5000); // هر 5 ثانیه

// هندل graceful shutdown
process.on('SIGINT', () => {
    console.log('🛑 shutting down WebSocket server...');
    wss.close(() => {
        console.log('✅ WebSocket server closed');
        process.exit(0);
    });
});
