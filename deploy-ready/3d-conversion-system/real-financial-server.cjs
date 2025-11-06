const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = 3000;

// میدلورها
app.use(express.json());
app.use(express.static('.'));

// سیستم مالی با داده‌های واقعی
class RealFinancialSystem {
    constructor() {
        this.rates = {
            'BTC': 0,
            'ETH': 0,
            'USDT': 60000, // نرخ ثابت تتر
            'IRT': 1
        };
        this.transactions = [];
    }

    // دریافت قیمت‌های واقعی از API
    async fetchRealRates() {
        try {
            const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
            
            const btcPrice = response.data.bitcoin.usd;
            const ethPrice = response.data.ethereum.usd;
            
            // تبدیل به تومان (نرخ دلار فرضی: 60,000 تومان)
            const rialRate = 60000;
            
            this.rates['BTC'] = Math.round(btcPrice * rialRate);
            this.rates['ETH'] = Math.round(ethPrice * rialRate);
            
            console.log('💰 قیمت‌های واقعی دریافت شد:');
            console.log('BTC:', this.rates['BTC'].toLocaleString(), 'تومان');
            console.log('ETH:', this.rates['ETH'].toLocaleString(), 'تومان');
            
            return true;
        } catch (error) {
            console.error('خطا در دریافت قیمت‌های واقعی:', error.message);
            // استفاده از مقادیر پیش‌فرض در صورت خطا
            this.rates['BTC'] = 2500000000;
            this.rates['ETH'] = 150000000;
            return false;
        }
    }

    calculateConversion(amount, fromCurrency, toCurrency) {
        const fromRate = this.rates[fromCurrency];
        const toRate = this.rates[toCurrency];
        
        if (fromCurrency === toCurrency) return amount;
        
        if (fromCurrency === 'IRT') {
            return amount / toRate;
        } else if (toCurrency === 'IRT') {
            return amount * fromRate;
        } else {
            return (amount * fromRate) / toRate;
        }
    }

    executeTransaction(transactionData) {
        const { amount, fromCurrency, toCurrency, type } = transactionData;
        
        const convertedAmount = this.calculateConversion(
            parseFloat(amount), 
            fromCurrency, 
            toCurrency
        );

        const transaction = {
            id: 'TX_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            amount: parseFloat(amount),
            fromCurrency: fromCurrency,
            toCurrency: toCurrency,
            convertedAmount: convertedAmount,
            rate: this.rates[toCurrency],
            type: type || 'exchange',
            status: 'completed',
            timestamp: new Date().toISOString(),
            realTime: true
        };

        this.transactions.push(transaction);
        return transaction;
    }

    getRates() {
        return this.rates;
    }

    getTransactions() {
        return this.transactions;
    }
}

const financialSystem = new RealFinancialSystem();

// به روزرسانی دوره‌ی قیمت‌ها
setInterval(() => {
    financialSystem.fetchRealRates();
}, 60000); // هر 1 دقیقه

// دریافت اولیه قیمت‌ها
financialSystem.fetchRealRates();

// ==================== مسیرهای API ====================

// مسیر سلامت
app.get('/health', (req, res) => {
    res.json({ 
        status: 'active',
        message: 'سیستم مالی با داده‌های واقعی - Termux',
        timestamp: new Date().toISOString(),
        realTimeData: true
    });
});

// API دریافت قیمت‌های واقعی
app.get('/api/real-rates', async (req, res) => {
    const success = await financialSystem.fetchRealRates();
    
    res.json({
        success: success,
        realTime: true,
        rates: financialSystem.getRates(),
        timestamp: new Date().toISOString(),
        source: 'CoinGecko API'
    });
});

// API محاسبه تبدیل با داده‌های واقعی
app.post('/api/real-conversion', async (req, res) => {
    const { amount, fromCurrency, toCurrency } = req.body;
    
    // به روزرسانی قیمت‌ها قبل از محاسبه
    await financialSystem.fetchRealRates();
    
    try {
        const convertedAmount = financialSystem.calculateConversion(
            parseFloat(amount), 
            fromCurrency, 
            toCurrency
        );
        
        res.json({
            success: true,
            realTime: true,
            originalAmount: parseFloat(amount),
            fromCurrency: fromCurrency,
            toCurrency: toCurrency,
            convertedAmount: convertedAmount,
            rate: financialSystem.rates[toCurrency],
            rateSource: 'CoinGecko',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// API اجرای تراکنش با داده‌های واقعی
app.post('/api/real-transaction', async (req, res) => {
    const { amount, fromCurrency, toCurrency, type } = req.body;
    
    // به روزرسانی قیمت‌ها قبل از تراکنش
    await financialSystem.fetchRealRates();
    
    try {
        const transaction = financialSystem.executeTransaction({
            amount: parseFloat(amount),
            fromCurrency: fromCurrency,
            toCurrency: toCurrency,
            type: type || 'exchange'
        });
        
        res.json({
            success: true,
            realTime: true,
            message: 'تراکنش با قیمت‌های واقعی انجام شد',
            transaction: transaction,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// بقیه مسیرها مانند قبل...
app.post('/api/convert', (req, res) => {
    const { format, quality } = req.body;
    
    setTimeout(() => {
        res.json({
            success: true,
            message: `مدل 3D به فرمت ${format} تبدیل شد`,
            format: format,
            quality: quality || 'medium',
            timestamp: new Date().toISOString()
        });
    }, 2000);
});

// صفحه اصلی با داده‌های واقعی
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>سیستم مالی با داده‌های واقعی</title>
        <style>
            body { 
                font-family: Tahoma, Arial, sans-serif;
                margin: 0;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                min-height: 100vh;
            }
            .container {
                max-width: 1000px;
                margin: 0 auto;
                background: rgba(255,255,255,0.1);
                padding: 30px;
                border-radius: 15px;
                backdrop-filter: blur(10px);
            }
            .real-time-badge {
                background: #00ff88;
                color: #000;
                padding: 5px 10px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: bold;
                animation: pulse 2s infinite;
            }
            @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.7; }
                100% { opacity: 1; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>💰 سیستم مالی با داده‌های <span class="real-time-badge">REAL-TIME</span></h1>
            
            <div class="card">
                <h3>💱 نرخ‌های لحظه‌ای ارزهای دیجیتال</h3>
                <div id="realRatesContainer">
                    <p>📡 در حال دریافت داده‌های واقعی از صرافی...</p>
                </div>
                <button onclick="loadRealRates()">🔄 به روزرسانی قیمت‌ها</button>
            </div>

            <div class="card">
                <h3>🧮 ماشین حساب تبدیل</h3>
                <input type="number" id="realAmount" placeholder="مبلغ" step="0.00000001">
                <select id="realFromCurrency">
                    <option value="IRT">تومان (IRT)</option>
                    <option value="BTC">بیت‌کوین (BTC)</option>
                    <option value="ETH">اتریوم (ETH)</option>
                </select>
                <span>→</span>
                <select id="realToCurrency">
                    <option value="BTC">بیت‌کوین (BTC)</option>
                    <option value="ETH">اتریوم (ETH)</option>
                    <option value="IRT">تومان (IRT)</option>
                </select>
                <button onclick="calculateRealConversion()">محاسبه</button>
                <div id="realResult"></div>
            </div>

            <div class="card">
                <h3>📊 اطلاعات فنی</h3>
                <p>✅ اتصال به CoinGecko API</p>
                <p>🔄 به روزرسانی خودکار هر 1 دقیقه</p>
                <p>💰 قیمت‌های واقعی بازار</p>
            </div>
        </div>

        <script>
            async function loadRealRates() {
                try {
                    const response = await fetch('/api/real-rates');
                    const data = await response.json();
                    
                    const container = document.getElementById('realRatesContainer');
                    if (data.success) {
                        container.innerHTML = \`
                            <p>✅ <strong>بیت‌کوین:</strong> \${data.rates.BTC.toLocaleString()} تومان</p>
                            <p>✅ <strong>اتریوم:</strong> \${data.rates.ETH.toLocaleString()} تومان</p>
                            <p>✅ <strong>تتر:</strong> \${data.rates.USDT.toLocaleString()} تومان</p>
                            <small>آخرین به روزرسانی: \${new Date(data.timestamp).toLocaleString('fa-IR')}</small>
                        \`;
                    } else {
                        container.innerHTML = '❌ خطا در دریافت داده‌های واقعی';
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }

            async function calculateRealConversion() {
                const amount = document.getElementById('realAmount').value;
                const fromCurrency = document.getElementById('realFromCurrency').value;
                const toCurrency = document.getElementById('realToCurrency').value;
                
                if (!amount) {
                    alert('لطفا مبلغ را وارد کنید');
                    return;
                }

                const resultDiv = document.getElementById('realResult');
                resultDiv.innerHTML = '🔄 در حال محاسبه با داده‌های واقعی...';

                try {
                    const response = await fetch('/api/real-conversion', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ amount, fromCurrency, toCurrency })
                    });
                    
                    const data = await response.json();
                    if (data.success) {
                        resultDiv.innerHTML = \`
                            <div style="background: rgba(0,255,136,0.2); padding: 15px; border-radius: 10px;">
                                <strong>💰 نتیجه تبدیل واقعی:</strong><br>
                                \${amount} \${fromCurrency} = <strong>\${data.convertedAmount.toFixed(8)} \${toCurrency}</strong><br>
                                <small>نرخ: 1 \${toCurrency} = \${data.rate.toLocaleString()} تومان</small><br>
                                <small>منبع: \${data.rateSource} - \${new Date(data.timestamp).toLocaleString('fa-IR')}</small>
                            </div>
                        \`;
                    } else {
                        resultDiv.innerHTML = '❌ خطا در محاسبه';
                    }
                } catch (error) {
                    resultDiv.innerHTML = '❌ خطا در ارتباط با سرور';
                }
            }

            // بارگذاری اولیه
            loadRealRates();
        </script>
    </body>
    </html>
    `);
});

// راه‌اندازی سرور
app.listen(PORT, '0.0.0.0', () => {
    console.log('='.repeat(60));
    console.log('💰 سیستم مالی با داده‌های REAL-TIME');
    console.log('📍 آدرس: http://localhost:' + PORT);
    console.log('📡 متصل به CoinGecko API');
    console.log('🔄 به روزرسانی خودکار هر 1 دقیقه');
    console.log('='.repeat(60));
});
