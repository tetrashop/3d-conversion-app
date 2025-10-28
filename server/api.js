const express = require('express');
const router = express.Router();

// شبیه‌سازی دیتابیس - در مرحله بعد با MySQL واقعی جایگزین می‌شود
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
        },
        {
            id: 2,
            user_id: 102,
            amount: 150.00,
            profit: 45.00,
            currency: 'USD',
            description: 'تبدیل تصویر محصول به 3D',
            status: 'completed',
            created_at: new Date('2024-01-15T11:15:00Z')
        },
        {
            id: 3,
            user_id: 103,
            amount: 200.00,
            profit: 60.00,
            currency: 'USD',
            description: 'تبدیل تصویر معماری به 3D',
            status: 'pending',
            created_at: new Date('2024-01-15T12:00:00Z')
        }
    ],
    withdrawals: [],
    users: [
        { id: 101, username: 'user1', email: 'user1@example.com' },
        { id: 102, username: 'user2', email: 'user2@example.com' },
        { id: 103, username: 'user3', email: 'user3@example.com' }
    ]
};

// 📊 دریافت آمار Real-time
router.get('/stats', async (req, res) => {
    try {
        const completedTransactions = database.transactions.filter(t => t.status === 'completed');
        
        const totalRevenue = completedTransactions.reduce((sum, t) => sum + t.amount, 0);
        const totalProfit = completedTransactions.reduce((sum, t) => sum + t.profit, 0);
        const totalTransactions = completedTransactions.length;
        
        // کاربران فعال (تراکنش در 24 ساعت گذشته)
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const activeUsers = new Set(
            database.transactions
                .filter(t => new Date(t.created_at) > oneDayAgo)
                .map(t => t.user_id)
        ).size;

        // نرخ تبدیل (فرضی)
        const conversionRate = 12.5;

        res.json({
            success: true,
            data: {
                totalRevenue,
                totalProfit,
                totalTransactions,
                activeUsers,
                conversionRate,
                todayTransactions: database.transactions.filter(t => 
                    new Date(t.created_at).toDateString() === new Date().toDateString()
                ).length
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// 💰 ثبت تراکنش جدید
router.post('/transactions', async (req, res) => {
    try {
        const { user_id, amount, currency = 'USD', description } = req.body;
        
        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                error: 'مبلغ تراکنش معتبر نیست'
            });
        }

        const profit = amount * 0.30; // 30% سود
        
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

        res.json({
            success: true,
            transaction: newTransaction,
            message: 'تراکنش با موفقیت ثبت شد'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// 🏧 درخواست برداشت
router.post('/withdrawals', async (req, res) => {
    try {
        const { amount, currency, wallet_address, network } = req.body;
        
        if (!amount || !currency || !wallet_address) {
            return res.status(400).json({
                success: false,
                error: 'لطفا تمام فیلدها را پر کنید'
            });
        }

        // بررسی موجودی
        const totalProfit = database.transactions
            .filter(t => t.status === 'completed')
            .reduce((sum, t) => sum + t.profit, 0);

        const pendingWithdrawals = database.withdrawals
            .filter(w => w.status === 'pending')
            .reduce((sum, w) => sum + w.amount, 0);

        const availableBalance = totalProfit - pendingWithdrawals;

        if (amount > availableBalance) {
            return res.status(400).json({
                success: false,
                error: `موجودی کافی نیست. موجودی قابل برداشت: ${availableBalance.toFixed(2)} $`
            });
        }

        // ثبت درخواست برداشت
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

        res.json({
            success: true,
            withdrawal: newWithdrawal,
            message: 'درخواست برداشت با موفقیت ثبت شد'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// 📋 تاریخچه تراکنش‌ها
router.get('/transactions', async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);

        let filteredTransactions = database.transactions;

        if (status) {
            filteredTransactions = filteredTransactions.filter(t => t.status === status);
        }

        // مرتب‌سازی بر اساس تاریخ (جدیدترین اول)
        filteredTransactions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        const startIndex = (pageNum - 1) * limitNum;
        const endIndex = startIndex + limitNum;
        const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

        res.json({
            success: true,
            data: paginatedTransactions,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total: filteredTransactions.length,
                totalPages: Math.ceil(filteredTransactions.length / limitNum)
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// 📋 تاریخچه برداشت‌ها
router.get('/withdrawals', async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);

        let filteredWithdrawals = database.withdrawals;

        if (status) {
            filteredWithdrawals = filteredWithdrawals.filter(w => w.status === status);
        }

        // مرتب‌سازی بر اساس تاریخ (جدیدترین اول)
        filteredWithdrawals.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        const startIndex = (pageNum - 1) * limitNum;
        const endIndex = startIndex + limitNum;
        const paginatedWithdrawals = filteredWithdrawals.slice(startIndex, endIndex);

        res.json({
            success: true,
            data: paginatedWithdrawals,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total: filteredWithdrawals.length,
                totalPages: Math.ceil(filteredWithdrawals.length / limitNum)
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// 👥 دریافت لیست کاربران
router.get('/users', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);

        const startIndex = (pageNum - 1) * limitNum;
        const endIndex = startIndex + limitNum;
        const paginatedUsers = database.users.slice(startIndex, endIndex);

        // محاسبه آمار هر کاربر
        const usersWithStats = paginatedUsers.map(user => {
            const userTransactions = database.transactions.filter(t => t.user_id === user.id);
            const totalSpent = userTransactions.reduce((sum, t) => sum + t.amount, 0);
            const totalProfit = userTransactions.reduce((sum, t) => sum + t.profit, 0);

            return {
                ...user,
                stats: {
                    totalTransactions: userTransactions.length,
                    totalSpent,
                    totalProfit,
                    lastActivity: userTransactions.length > 0 ? 
                        new Date(Math.max(...userTransactions.map(t => new Date(t.created_at)))) : 
                        null
                }
            };
        });

        res.json({
            success: true,
            data: usersWithStats,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total: database.users.length,
                totalPages: Math.ceil(database.users.length / limitNum)
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// 🗑️ حذف تراکنش (برای مدیریت)
router.delete('/transactions/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const index = database.transactions.findIndex(t => t.id === id);

        if (index === -1) {
            return res.status(404).json({
                success: false,
                error: 'تراکنش یافت نشد'
            });
        }

        const deletedTransaction = database.transactions.splice(index, 1)[0];

        res.json({
            success: true,
            message: 'تراکنش با موفقیت حذف شد',
            transaction: deletedTransaction
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

module.exports = router;
