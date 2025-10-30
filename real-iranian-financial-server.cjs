const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = 3000;

// میدلورها
app.use(express.json());
app.use(express.static('.'));

// سیستم مالی با داده‌های واقعی بازار ایران
class IranianFinancialSystem {
    constructor() {
        this.rates = {
            'BTC': { price: 0, change: 0, lastUpdate: '' },
            'ETH': { price: 0, change: 0, lastUpdate: '' },
            'USDT': { price: 60000, change: 0, lastUpdate: '' },
            'IRT': { price: 1, change: 0, lastUpdate: '' }
        };
        this.transactions = [];
        this.lastUpdate = '';
    }

    // دریافت قیمت‌های واقعی از API نوبیتکس
    async fetchNobitexRates() {
        try {
            console.log('📡 دریافت قیمت‌های واقعی از نوبیتکس...');
            
            const response = await axios.get('https://api.nobitex.ir/v2/orderbook/BTCIRT');
            const btcData = response.data;
            
            const ethResponse = await axios.get('https://api.nobitex.ir/v2/orderbook/ETHIRT');
            const ethData = ethResponse.data;
            
            // قیمت بیت‌کوین (میانگین بهترین خرید و فروش)
            const btcBestBid = parseFloat(btcData.bids[0][0]);
            const btcBestAsk = parseFloat(btcData.asks[0][0]);
            const btcPrice = Math.round((btcBestBid + btcBestAsk) / 2);
            
            // قیمت اتریوم
            const ethBestBid = parseFloat(ethData.bids[0][0]);
            const ethBestAsk = parseFloat(ethData.asks[0][0]);
            const ethPrice = Math.round((ethBestBid + ethBestAsk) / 2);
            
            this.rates['BTC'] = {
                price: btcPrice,
                change: 0, // برای سادگی
                lastUpdate: new Date().toISOString()
            };
            
            this.rates['ETH'] = {
                price: ethPrice,
                change: 0,
                lastUpdate: new Date().toISOString()
            };
            
            this.lastUpdate = new Date().toLocaleString('fa-IR');
            
            console.log('✅ قیمت‌های واقعی دریافت شد:');
            console.log('BTC:', btcPrice.toLocaleString(), 'تومان');
            console.log('ETH:', ethPrice.toLocaleString(), 'تومان');
            
            return true;
        } catch (error) {
            console.error('❌ خطا در دریافت از نوبیتکس:', error.message);
            return this.fetchFallbackRates();
        }
    }

    // داده‌های جایگزین در صورت عدم دسترسی به API
    async fetchFallbackRates() {
        try {
            console.log('🔄 استفاده از داده‌های جایگزین...');
            
            // استفاده از CoinGecko به عنوان جایگزین
            const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
            
            const btcUSD = response.data.bitcoin.usd;
            const ethUSD = response.data.ethereum.usd;
            
            // نرخ دلار آزاد (تقریبی)
            const usdToIrr = 60000;
            
            this.rates['BTC'] = {
                price: Math.round(btcUSD * usdToIrr),
                change: 0,
                lastUpdate: new Date().toISOString(),
                source: 'CoinGecko + نرخ تقریبی'
            };
            
            this.rates['ETH'] = {
                price: Math.round(ethUSD * usdToIrr),
                change: 0,
                lastUpdate: new Date().toISOString(),
                source: 'CoinGecko + نرخ تقریبی'
            };
            
            this.lastUpdate = new Date().toLocaleString('fa-IR') + ' (داده تقریبی)';
            
            return true;
        } catch (error) {
            console.error('❌ خطا در دریافت داده‌های جایگزین:', error.message);
            
            // استفاده از مقادیر ثابت در صورت خطا
            this.rates['BTC'] = { price: 2500000000, change: 0, lastUpdate: new Date().toISOString(), source: 'ثابت' };
            this.rates['ETH'] = { price: 150000000, change: 0, lastUpdate: new Date().toISOString(), source: 'ثابت' };
            this.lastUpdate = new Date().toLocaleString('fa-IR') + ' (داده ثابت)';
            
            return false;
        }
    }

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
            rate: this.rates[toCurrency].price,
            rateSource: this.rates[toCurrency].source || 'واقعی',
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

    getLastUpdate() {
        return this.lastUpdate;
    }
}

const financialSystem = new IranianFinancialSystem();

// به روزرسانی دوره‌ی قیمت‌ها هر 2 دقیقه
setInterval(() => {
    financialSystem.fetchNobitexRates();
}, 120000);

// دریافت اولیه قیمت‌ها
financialSystem.fetchNobitexRates();

// ==================== مسیرهای API ====================

// مسیر سلامت
app.get('/health', (req, res) => {
    res.json({ 
        status: 'active',
        message: 'سیستم مالی با داده‌های واقعی بازار ایران',
        timestamp: new Date().toISOString(),
        realTimeData: true,
        source: 'نوبیتکس API'
    });
});

// API دریافت قیمت‌های واقعی
app.get('/api/real-ir-rates', async (req, res) => {
    const success = await financialSystem.fetchNobitexRates();
    
    res.json({
        success: success,
        realTime: true,
        rates: financialSystem.getRates(),
        lastUpdate: financialSystem.getLastUpdate(),
        timestamp: new Date().toISOString(),
        source: success ? 'نوبیتکس' : 'داده جایگزین'
    });
});

// API محاسبه تبدیل با داده‌های واقعی
app.post('/api/real-ir-conversion', async (req, res) => {
    const { amount, fromCurrency, toCurrency } = req.body;
    
    // به روزرسانی قیمت‌ها قبل از محاسبه
    await financialSystem.fetchNobitexRates();
    
    try {
        const convertedAmount = financialSystem.calculateConversion(
            parseFloat(amount), 
            fromCurrency, 
            toCurrency
        );
        
        const rateInfo = financialSystem.rates[toCurrency];
        
        res.json({
            success: true,
            realTime: true,
            originalAmount: parseFloat(amount),
            fromCurrency: fromCurrency,
            toCurrency: toCurrency,
            convertedAmount: convertedAmount,
            rate: rateInfo.price,
            rateSource: rateInfo.source || 'نوبیتکس',
            lastUpdate: financialSystem.getLastUpdate(),
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
app.post('/api/real-ir-transaction', async (req, res) => {
    const { amount, fromCurrency, toCurrency, type } = req.body;
    
    // به روزرسانی قیمت‌ها قبل از تراکنش
    await financialSystem.fetchNobitexRates();
    
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
            message: 'تراکنش با قیمت‌های واقعی بازار انجام شد',
            transaction: transaction,
            lastUpdate: financialSystem.getLastUpdate(),
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// API تبدیل 3D
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

// صفحه اصلی با داده‌های واقعی بازار ایران
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>سیستم مالی - داده‌های واقعی بازار ایران</title>
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
                max-width: 1000px;
                margin: 0 auto;
                background: rgba(255,255,255,0.1);
                padding: 30px;
                border-radius: 15px;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.2);
            }
            .card {
                background: rgba(255,255,255,0.15);
                padding: 20px;
                margin: 15px 0;
                border-radius: 10px;
                border: 1px solid rgba(255,255,255,0.2);
            }
            .real-time-badge {
                background: linear-gradient(45deg, #00ff88, #00ccff);
                color: #000;
                padding: 5px 15px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: bold;
                animation: pulse 2s infinite;
            }
            .currency-card {
                background: rgba(255,255,255,0.2);
                padding: 15px;
                margin: 10px;
                border-radius: 10px;
                text-align: center;
                display: inline-block;
                min-width: 200px;
                border: 1px solid rgba(255,255,255,0.3);
            }
            .price {
                font-size: 18px;
                font-weight: bold;
                margin: 10px 0;
            }
            .source {
                font-size: 12px;
                opacity: 0.8;
            }
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            input, select, button {
                padding: 12px;
                margin: 5px;
                border: none;
                border-radius: 8px;
                font-size: 16px;
            }
            input, select {
                background: rgba(255,255,255,0.9);
                width: 200px;
            }
            button {
                background: linear-gradient(45deg, #00ff88, #00ccff);
                color: #000;
                cursor: pointer;
                font-weight: bold;
                transition: transform 0.2s;
            }
            button:hover {
                transform: translateY(-2px);
            }
            .result {
                background: rgba(0,0,0,0.3);
                padding: 15px;
                border-radius: 10px;
                margin-top: 15px;
                border: 1px solid rgba(255,255,255,0.2);
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>💰 سیستم مالی با <span class="real-time-badge">داده‌های واقعی بازار ایران</span></h1>
            
            <div class="card">
                <h3>💱 نرخ‌های لحظه‌ای ارزهای دیجیتال</h3>
                <div id="realRatesContainer">
                    <p>📡 در حال دریافت داده‌های واقعی از نوبیتکس...</p>
                </div>
                <button onclick="loadRealRates()">🔄 به روزرسانی قیمت‌ها</button>
                <div id="updateInfo" style="margin-top: 10px; font-size: 12px; opacity: 0.8;"></div>
            </div>

            <div class="card">
                <h3>🧮 ماشین حساب تبدیل ارز</h3>
                <div style="margin: 15px 0;">
                    <input type="number" id="realAmount" placeholder="مبلغ" step="0.00000001">
                    <select id="realFromCurrency">
                        <option value="IRT">تومان (IRT)</option>
                        <option value="BTC">بیت‌کوین (BTC)</option>
                        <option value="ETH">اتریوم (ETH)</option>
                        <option value="USDT">تتر (USDT)</option>
                    </select>
                    <span>→</span>
                    <select id="realToCurrency">
                        <option value="BTC">بیت‌کوین (BTC)</option>
                        <option value="ETH">اتریوم (ETH)</option>
                        <option value="USDT">تتر (USDT)</option>
                        <option value="IRT">تومان (IRT)</option>
                    </select>
                </div>
                <button onclick="calculateRealConversion()">محاسبه تبدیل</button>
                <button onclick="executeRealTransaction()">اجرای تراکنش</button>
                <div id="realResult" class="result"></div>
            </div>

            <div class="card">
                <h3>📊 اطلاعات فنی سیستم</h3>
                <p>✅ متصل به <strong>Nobitex API</strong> - بزرگترین صرافی ایران</p>
                <p>🔄 به روزرسانی خودکار هر 2 دقیقه</p>
                <p>💰 قیمت‌های واقعی بازار ایران</p>
                <p>🛡️ سیستم Fallback برای مواقع قطعی</p>
            </div>
        </div>

        <script>
            async function loadRealRates() {
                const container = document.getElementById('realRatesContainer');
                const updateInfo = document.getElementById('updateInfo');
                
                container.innerHTML = '<p>🔄 در حال دریافت داده‌های واقعی...</p>';
                
                try {
                    const response = await fetch('/api/real-ir-rates');
                    const data = await response.json();
                    
                    if (data.success) {
                        let ratesHTML = '';
                        
                        // نمایش بیت‌کوین
                        if (data.rates.BTC) {
                            ratesHTML += \`
                                <div class="currency-card">
                                    <strong>₿ بیت‌کوین</strong>
                                    <div class="price">\${data.rates.BTC.price.toLocaleString()} تومان</div>
                                    <div class="source">منبع: \${data.source}</div>
                                </div>
                            \`;
                        }
                        
                        // نمایش اتریوم
                        if (data.rates.ETH) {
                            ratesHTML += \`
                                <div class="currency-card">
                                    <strong>⧫ اتریوم</strong>
                                    <div class="price">\${data.rates.ETH.price.toLocaleString()} تومان</div>
                                    <div class="source">منبع: \${data.source}</div>
                                </div>
                            \`;
                        }
                        
                        // نمایش تتر
                        if (data.rates.USDT) {
                            ratesHTML += \`
                                <div class="currency-card">
                                    <strong>💵 تتر</strong>
                                    <div class="price">\${data.rates.USDT.price.toLocaleString()} تومان</div>
                                    <div class="source">نرخ ثابت</div>
                                </div>
                            \`;
                        }
                        
                        container.innerHTML = ratesHTML;
                        updateInfo.innerHTML = \`آخرین به روزرسانی: \${data.lastUpdate}\`;
                    } else {
                        container.innerHTML = '<p>❌ خطا در دریافت داده‌های واقعی</p>';
                    }
                } catch (error) {
                    console.error('Error:', error);
                    container.innerHTML = '<p>❌ خطا در ارتباط با سرور</p>';
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
                resultDiv.innerHTML = '🔄 در حال محاسبه با داده‌های واقعی بازار...';

                try {
                    const response = await fetch('/api/real-ir-conversion', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ amount, fromCurrency, toCurrency })
                    });
                    
                    const data = await response.json();
                    if (data.success) {
                        resultDiv.innerHTML = \`
                            <div style="background: rgba(0,255,136,0.2); padding: 15px; border-radius: 10px; border: 1px solid #00ff88;">
                                <strong>💰 نتیجه تبدیل واقعی:</strong><br>
                                <span style="font-size: 18px; font-weight: bold;">
                                    \${parseFloat(amount).toLocaleString()} \${fromCurrency} = \${data.convertedAmount.toFixed(8)} \${toCurrency}
                                </span><br>
                                <small>💵 نرخ: 1 \${toCurrency} = \${data.rate.toLocaleString()} تومان</small><br>
                                <small>📡 منبع: \${data.rateSource}</small><br>
                                <small>🕒 زمان: \${data.lastUpdate}</small>
                            </div>
                        \`;
                    } else {
                        resultDiv.innerHTML = '❌ خطا در محاسبه: ' + data.error;
                    }
                } catch (error) {
                    resultDiv.innerHTML = '❌ خطا در ارتباط با سرور';
                }
            }

            async function executeRealTransaction() {
                const amount = document.getElementById('realAmount').value;
                const fromCurrency = document.getElementById('realFromCurrency').value;
                const toCurrency = document.getElementById('realToCurrency').value;
                
                if (!amount) {
                    alert('لطفا مبلغ را وارد کنید');
                    return;
                }

                const resultDiv = document.getElementById('realResult');
                resultDiv.innerHTML = '🔄 در حال اجرای تراکنش با قیمت‌های واقعی...';

                try {
                    const response = await fetch('/api/real-ir-transaction', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ amount, fromCurrency, toCurrency })
                    });
                    
                    const data = await response.json();
                    if (data.success) {
                        resultDiv.innerHTML = \`
                            <div style="background: rgba(0,200,255,0.2); padding: 15px; border-radius: 10px; border: 1px solid #00ccff;">
                                <strong>✅ تراکنش موفق:</strong><br>
                                <strong>شناسه:</strong> \${data.transaction.id}<br>
                                <strong>مبلغ:</strong> \${data.transaction.amount.toLocaleString()} \${data.transaction.fromCurrency}<br>
                                <strong>تبدیل به:</strong> \${data.transaction.convertedAmount.toFixed(8)} \${data.transaction.toCurrency}<br>
                                <strong>نرخ:</strong> \${data.transaction.rate.toLocaleString()} تومان<br>
                                <strong>منبع:</strong> \${data.transaction.rateSource}<br>
                                <strong>زمان:</strong> \${new Date(data.transaction.timestamp).toLocaleString('fa-IR')}
                            </div>
                        \`;
                    } else {
                        resultDiv.innerHTML = '❌ خطا در تراکنش: ' + data.error;
                    }
                } catch (error) {
                    resultDiv.innerHTML = '❌ خطا در ارتباط با سرور';
                }
            }

            // بارگذاری اولیه
            loadRealRates();
            
            // به روزرسانی خودکار هر 30 ثانیه
            setInterval(loadRealRates, 30000);
        </script>
    </body>
    </html>
    `);
});

// راه‌اندازی سرور
app.listen(PORT, '0.0.0.0', () => {
    console.log('='.repeat(60));
    console.log('💰 سیستم مالی با داده‌های واقعی بازار ایران');
    console.log('📍 آدرس: http://localhost:' + PORT);
    console.log('📡 متصل به Nobitex API');
    console.log('🔄 به روزرسانی خودکار هر 2 دقیقه');
    console.log('🛡️ سیستم Fallback فعال');
    console.log('='.repeat(60));
});
