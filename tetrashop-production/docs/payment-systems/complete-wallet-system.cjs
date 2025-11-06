const express = require('express');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

// میدلورها
app.use(express.json());
app.use(express.static('.'));

// سیستم کامل با مدیریت موجودی واقعی
class CompleteWalletSystem {
    constructor() {
        this.walletFile = 'wallet-data.json';
        this.rates = {
            'BTC': { price: 0, change: 0, lastUpdate: '' },
            'ETH': { price: 0, change: 0, lastUpdate: '' },
            'USDT': { price: 60000, change: 0, lastUpdate: '' },
            'IRT': { price: 1, change: 0, lastUpdate: '' }
        };
        this.loadWalletData();
    }

    // بارگذاری داده‌های کیف پول از فایل
    loadWalletData() {
        try {
            if (fs.existsSync(this.walletFile)) {
                const data = fs.readFileSync(this.walletFile, 'utf8');
                this.wallet = JSON.parse(data);
                console.log('✅ داده‌های کیف پول بارگذاری شد');
            } else {
                // ایجاد کیف پول پیش‌فرض با موجودی اولیه
                this.wallet = {
                    balances: {
                        'IRT': 10000000,    // 10 میلیون تومان
                        'BTC': 0.005,       // 0.005 بیت‌کوین
                        'ETH': 0.1,         // 0.1 اتریوم
                        'USDT': 500         // 500 تتر
                    },
                    transactions: [],
                    totalValueIRT: 0,
                    lastUpdate: new Date().toISOString()
                };
                this.saveWalletData();
                console.log('✅ کیف پول جدید ایجاد شد');
            }
            this.calculateTotalValue();
        } catch (error) {
            console.error('❌ خطا در بارگذاری کیف پول:', error);
            this.createDefaultWallet();
        }
    }

    // ذخیره داده‌های کیف پول در فایل
    saveWalletData() {
        try {
            fs.writeFileSync(this.walletFile, JSON.stringify(this.wallet, null, 2));
        } catch (error) {
            console.error('❌ خطا در ذخیره کیف پول:', error);
        }
    }

    // ایجاد کیف پول پیش‌فرض
    createDefaultWallet() {
        this.wallet = {
            balances: {
                'IRT': 10000000,
                'BTC': 0.005,
                'ETH': 0.1,
                'USDT': 500
            },
            transactions: [],
            totalValueIRT: 0,
            lastUpdate: new Date().toISOString()
        };
        this.saveWalletData();
    }

    // محاسبه کل ارزش پرتفو به تومان
    calculateTotalValue() {
        let total = 0;
        for (const [currency, balance] of Object.entries(this.wallet.balances)) {
            if (currency === 'IRT') {
                total += balance;
            } else if (this.rates[currency] && this.rates[currency].price) {
                total += balance * this.rates[currency].price;
            }
        }
        this.wallet.totalValueIRT = Math.round(total);
        this.wallet.lastUpdate = new Date().toISOString();
        this.saveWalletData();
    }

    // دریافت قیمت‌های واقعی
    async fetchRealRates() {
        try {
            console.log('📡 دریافت قیمت‌های واقعی...');
            
            // استفاده از نوبیتکس
            const btcResponse = await axios.get('https://api.nobitex.ir/v2/orderbook/BTCIRT');
            const ethResponse = await axios.get('https://api.nobitex.ir/v2/orderbook/ETHIRT');
            
            const btcData = btcResponse.data;
            const ethData = ethResponse.data;
            
            const btcBestBid = parseFloat(btcData.bids[0][0]);
            const btcBestAsk = parseFloat(btcData.asks[0][0]);
            const btcPrice = Math.round((btcBestBid + btcBestAsk) / 2);
            
            const ethBestBid = parseFloat(ethData.bids[0][0]);
            const ethBestAsk = parseFloat(ethData.asks[0][0]);
            const ethPrice = Math.round((ethBestBid + ethBestAsk) / 2);
            
            this.rates['BTC'] = { price: btcPrice, lastUpdate: new Date().toISOString() };
            this.rates['ETH'] = { price: ethPrice, lastUpdate: new Date().toISOString() };
            
            console.log('✅ قیمت‌های واقعی دریافت شد');
            
            // محاسبه ارزش پرتفو با قیمت‌های جدید
            this.calculateTotalValue();
            
            return true;
        } catch (error) {
            console.error('❌ خطا در دریافت قیمت‌ها:', error.message);
            return false;
        }
    }

    // بررسی موجودی کافی
    hasSufficientBalance(amount, currency) {
        return this.wallet.balances[currency] >= amount;
    }

    // انجام تراکنش واقعی
    executeRealTransaction(transactionData) {
        const { amount, fromCurrency, toCurrency, type = 'exchange' } = transactionData;
        
        // بررسی موجودی کافی
        if (!this.hasSufficientBalance(parseFloat(amount), fromCurrency)) {
            throw new Error(`موجودی ${fromCurrency} کافی نیست`);
        }

        // محاسبه مقدار تبدیل شده
        const convertedAmount = this.calculateConversion(parseFloat(amount), fromCurrency, toCurrency);

        // کسر از موجودی مبدا
        this.wallet.balances[fromCurrency] -= parseFloat(amount);
        
        // افزودن به موجودی مقصد
        this.wallet.balances[toCurrency] += convertedAmount;

        // ثبت تراکنش
        const transaction = {
            id: 'TX_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            type: type,
            fromCurrency: fromCurrency,
            toCurrency: toCurrency,
            amount: parseFloat(amount),
            convertedAmount: convertedAmount,
            rate: this.rates[toCurrency].price,
            fromBalanceBefore: this.wallet.balances[fromCurrency] + parseFloat(amount),
            toBalanceBefore: this.wallet.balances[toCurrency] - convertedAmount,
            fromBalanceAfter: this.wallet.balances[fromCurrency],
            toBalanceAfter: this.wallet.balances[toCurrency],
            status: 'completed',
            timestamp: new Date().toISOString()
        };

        this.wallet.transactions.unshift(transaction); // اضافه به ابتدای لیست
        this.calculateTotalValue();
        this.saveWalletData();

        return transaction;
    }

    // واریز موجودی
    deposit(amount, currency) {
        this.wallet.balances[currency] += parseFloat(amount);
        
        const transaction = {
            id: 'DEP_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            type: 'deposit',
            currency: currency,
            amount: parseFloat(amount),
            balanceBefore: this.wallet.balances[currency] - parseFloat(amount),
            balanceAfter: this.wallet.balances[currency],
            status: 'completed',
            timestamp: new Date().toISOString()
        };

        this.wallet.transactions.unshift(transaction);
        this.calculateTotalValue();
        this.saveWalletData();

        return transaction;
    }

    // برداشت موجودی
    withdraw(amount, currency) {
        if (!this.hasSufficientBalance(parseFloat(amount), currency)) {
            throw new Error(`موجودی ${currency} کافی نیست`);
        }

        this.wallet.balances[currency] -= parseFloat(amount);
        
        const transaction = {
            id: 'WITH_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            type: 'withdraw',
            currency: currency,
            amount: parseFloat(amount),
            balanceBefore: this.wallet.balances[currency] + parseFloat(amount),
            balanceAfter: this.wallet.balances[currency],
            status: 'completed',
            timestamp: new Date().toISOString()
        };

        this.wallet.transactions.unshift(transaction);
        this.calculateTotalValue();
        this.saveWalletData();

        return transaction;
    }

    // محاسبه تبدیل
    calculateConversion(amount, fromCurrency, toCurrency) {
        const fromRate = this.rates[fromCurrency].price;
        const toRate = this.rates[toCurrency].price;
        
        if (fromCurrency === toCurrency) return amount;
        
        if (fromCurrency === 'IRT') {
            return amount / toRate;
        } else if (toCurrency === 'IRT') {
            return amount * fromRate;
        } else {
            return (amount * fromRate) / toRate;
        }
    }

    // دریافت اطلاعات کیف پول
    getWalletInfo() {
        return {
            balances: this.wallet.balances,
            totalValueIRT: this.wallet.totalValueIRT,
            lastUpdate: this.wallet.lastUpdate,
            rates: this.rates
        };
    }

    // دریافت تراکنش‌ها
    getTransactions(limit = 50) {
        return this.wallet.transactions.slice(0, limit);
    }
}

const walletSystem = new CompleteWalletSystem();

// به روزرسانی دوره‌ی قیمت‌ها
setInterval(() => {
    walletSystem.fetchRealRates();
}, 120000);

// دریافت اولیه قیمت‌ها
walletSystem.fetchRealRates();

// ==================== مسیرهای API ====================

// اطلاعات کیف پول
app.get('/api/wallet', (req, res) => {
    res.json({
        success: true,
        wallet: walletSystem.getWalletInfo(),
        timestamp: new Date().toISOString()
    });
});

// موجودی واقعی
app.get('/api/balances', (req, res) => {
    res.json({
        success: true,
        balances: walletSystem.wallet.balances,
        totalValue: walletSystem.wallet.totalValueIRT,
        timestamp: new Date().toISOString()
    });
});

// تراکنش واقعی
app.post('/api/real-exchange', async (req, res) => {
    const { amount, fromCurrency, toCurrency } = req.body;
    
    // به روزرسانی قیمت‌ها قبل از تراکنش
    await walletSystem.fetchRealRates();
    
    try {
        const transaction = walletSystem.executeRealTransaction({
            amount: parseFloat(amount),
            fromCurrency: fromCurrency,
            toCurrency: toCurrency
        });
        
        res.json({
            success: true,
            message: 'تبدیل با موفقیت انجام شد',
            transaction: transaction,
            newBalances: walletSystem.wallet.balances,
            totalValue: walletSystem.wallet.totalValueIRT,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// واریز
app.post('/api/deposit', (req, res) => {
    const { amount, currency } = req.body;
    
    try {
        const transaction = walletSystem.deposit(parseFloat(amount), currency);
        
        res.json({
            success: true,
            message: 'واریز با موفقیت انجام شد',
            transaction: transaction,
            newBalance: walletSystem.wallet.balances[currency],
            totalValue: walletSystem.wallet.totalValueIRT,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// برداشت
app.post('/api/withdraw', (req, res) => {
    const { amount, currency } = req.body;
    
    try {
        const transaction = walletSystem.withdraw(parseFloat(amount), currency);
        
        res.json({
            success: true,
            message: 'برداشت با موفقیت انجام شد',
            transaction: transaction,
            newBalance: walletSystem.wallet.balances[currency],
            totalValue: walletSystem.wallet.totalValueIRT,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// تاریخچه تراکنش‌ها
app.get('/api/transaction-history', (req, res) => {
    const limit = parseInt(req.query.limit) || 20;
    
    res.json({
        success: true,
        transactions: walletSystem.getTransactions(limit),
        total: walletSystem.wallet.transactions.length,
        timestamp: new Date().toISOString()
    });
});

// صفحه اصلی با کیف پول واقعی
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>کیف پول واقعی ارز دیجیتال</title>
        <style>
            body { 
                font-family: Tahoma, Arial, sans-serif;
                margin: 0;
                padding: 20px;
                background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
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
                border: 1px solid rgba(255,255,255,0.2);
            }
            .wallet-card {
                background: rgba(255,255,255,0.15);
                padding: 20px;
                margin: 15px 0;
                border-radius: 10px;
                border: 1px solid rgba(255,255,255,0.2);
            }
            .balance-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px;
                margin: 5px 0;
                background: rgba(255,255,255,0.1);
                border-radius: 8px;
            }
            .total-value {
                background: linear-gradient(45deg, #00ff88, #00ccff);
                color: #000;
                padding: 15px;
                border-radius: 10px;
                text-align: center;
                font-size: 24px;
                font-weight: bold;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>💰 کیف پول واقعی ارز دیجیتال</h1>
            
            <div class="wallet-card">
                <h3>💼 موجودی واقعی شما</h3>
                <div id="realBalances">
                    <!-- موجودی‌ها اینجا نمایش داده می‌شوند -->
                </div>
                <div id="totalValue" class="total-value">
                    <!-- کل ارزش نمایش داده می‌شود -->
                </div>
            </div>

            <div class="wallet-card">
                <h3>🔄 تبدیل ارز</h3>
                <!-- فرم تبدیل -->
            </div>

            <div class="wallet-card">
                <h3>📊 تاریخچه تراکنش‌ها</h3>
                <!-- تاریخچه -->
            </div>
        </div>

        <script>
            // توابع مدیریت کیف پول واقعی
        </script>
    </body>
    </html>
    `);
});

// راه‌اندازی سرور
app.listen(PORT, '0.0.0.0', () => {
    console.log('='.repeat(60));
    console.log('💰 سیستم کامل کیف پول واقعی');
    console.log('📍 آدرس: http://localhost:' + PORT);
    console.log('💼 مدیریت موجودی واقعی');
    console.log('💵 تراکنش‌های واقعی');
    console.log('📈 ارزش‌گذاری لحظه‌ای');
    console.log('='.repeat(60));
});
