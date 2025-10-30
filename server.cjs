const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// میدلورها
app.use(express.json());
app.use(express.static('.'));
app.use('/admin', express.static(path.join(__dirname, 'apps/admin-panel')));

// سیستم مالی واقعی
class FinancialSystem {
    constructor() {
        this.rates = {
            'BTC': 2500000000, // قیمت نمونه: 2.5 میلیارد تومان
            'ETH': 150000000,  // قیمت نمونه: 150 میلیون تومان
            'USDT': 60000,     // قیمت نمونه: 60,000 تومان
            'IRT': 1
        };
        this.transactions = [];
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
            timestamp: new Date().toISOString()
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

const financialSystem = new FinancialSystem();

// ==================== مسیرهای API ====================

// مسیر سلامت
app.get('/health', (req, res) => {
    res.json({ 
        status: 'active',
        message: '3D Conversion & Financial App - Termux',
        timestamp: new Date().toISOString(),
        platform: 'Android/Termux'
    });
});

// API تبدیل 3D
app.post('/api/convert', (req, res) => {
    const { format, quality } = req.body;
    
    console.log('📨 درخواست تبدیل 3D:', { format, quality });
    
    setTimeout(() => {
        res.json({
            success: true,
            message: `مدل 3D با موفقیت به فرمت ${format} تبدیل شد`,
            format: format,
            quality: quality || 'medium',
            downloadUrl: `/download/sample.${format}`,
            timestamp: new Date().toISOString()
        });
    }, 2000);
});

// API نرخ‌های ارز
app.get('/api/rates', (req, res) => {
    res.json({
        success: true,
        rates: financialSystem.getRates(),
        timestamp: new Date().toISOString()
    });
});

// API محاسبه تبدیل ارز
app.post('/api/calculate-conversion', (req, res) => {
    const { amount, fromCurrency, toCurrency } = req.body;
    
    try {
        const convertedAmount = financialSystem.calculateConversion(
            parseFloat(amount), 
            fromCurrency, 
            toCurrency
        );
        
        res.json({
            success: true,
            originalAmount: parseFloat(amount),
            fromCurrency: fromCurrency,
            toCurrency: toCurrency,
            convertedAmount: convertedAmount,
            rate: financialSystem.rates[toCurrency],
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// API اجرای تراکنش
app.post('/api/execute-transaction', (req, res) => {
    const { amount, fromCurrency, toCurrency, type } = req.body;
    
    try {
        const transaction = financialSystem.executeTransaction({
            amount: parseFloat(amount),
            fromCurrency: fromCurrency,
            toCurrency: toCurrency,
            type: type || 'exchange'
        });
        
        res.json({
            success: true,
            message: 'تراکنش با موفقیت انجام شد',
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

// API تاریخچه تراکنش‌ها
app.get('/api/transactions', (req, res) => {
    res.json({
        success: true,
        transactions: financialSystem.getTransactions(),
        count: financialSystem.transactions.length,
        timestamp: new Date().toISOString()
    });
});

// ==================== مسیرهای صفحات ====================

// صفحه اصلی
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>سامانه تبدیل 3D و مالی - Termux</title>
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
            h1 { text-align: center; margin-bottom: 30px; }
            .card {
                background: rgba(255,255,255,0.2);
                padding: 20px;
                margin: 15px 0;
                border-radius: 10px;
                border: 1px solid rgba(255,255,255,0.3);
            }
            .tabs {
                display: flex;
                margin-bottom: 20px;
                background: rgba(255,255,255,0.2);
                border-radius: 10px;
                padding: 5px;
            }
            .tab {
                flex: 1;
                padding: 10px;
                text-align: center;
                cursor: pointer;
                border-radius: 8px;
            }
            .tab.active {
                background: rgba(255,255,255,0.3);
            }
            .tab-content {
                display: none;
            }
            .tab-content.active {
                display: block;
            }
            .form-group {
                margin: 15px 0;
            }
            label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
            }
            input, select {
                width: 100%;
                padding: 10px;
                border: none;
                border-radius: 5px;
                background: rgba(255,255,255,0.9);
            }
            button {
                background: rgba(255,255,255,0.3);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
                margin: 5px;
            }
            button:hover {
                background: rgba(255,255,255,0.4);
            }
            .result {
                margin-top: 10px;
                padding: 15px;
                background: rgba(0,0,0,0.3);
                border-radius: 5px;
                white-space: pre-wrap;
                font-family: monospace;
            }
            .currency-card {
                background: rgba(255,255,255,0.15);
                padding: 15px;
                margin: 10px;
                border-radius: 8px;
                text-align: center;
                display: inline-block;
                min-width: 120px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🎯 سامانه تبدیل 3D و مالی</h1>
            
            <div class="tabs">
                <div class="tab active" onclick="switchTab('financial')">💰 مالی</div>
                <div class="tab" onclick="switchTab('conversion')">🔄 تبدیل 3D</div>
                <div class="tab" onclick="switchTab('status')">📊 وضعیت</div>
            </div>

            <!-- تب مالی -->
            <div id="financial" class="tab-content active">
                <div class="card">
                    <h3>💱 نرخ‌های لحظه‌ای</h3>
                    <div id="ratesContainer"></div>
                </div>

                <div class="card">
                    <h3>⚡ تراکنش سریع</h3>
                    <div class="form-group">
                        <label>مبلغ:</label>
                        <input type="number" id="amount" placeholder="مبلغ را وارد کنید" step="0.00000001">
                    </div>
                    <div class="form-group">
                        <label>از ارز:</label>
                        <select id="fromCurrency">
                            <option value="IRT">تومان (IRT)</option>
                            <option value="BTC">بیت‌کوین (BTC)</option>
                            <option value="ETH">اتریوم (ETH)</option>
                            <option value="USDT">تتر (USDT)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>به ارز:</label>
                        <select id="toCurrency">
                            <option value="BTC">بیت‌کوین (BTC)</option>
                            <option value="ETH">اتریوم (ETH)</option>
                            <option value="USDT">تتر (USDT)</option>
                            <option value="IRT">تومان (IRT)</option>
                        </select>
                    </div>
                    <button onclick="calculateConversion()">محاسبه تبدیل</button>
                    <button onclick="executeTransaction()">اجرای تراکنش</button>
                    <div id="financialResult" class="result"></div>
                </div>
            </div>

            <!-- تب تبدیل 3D -->
            <div id="conversion" class="tab-content">
                <div class="card">
                    <h3>🔄 تبدیل مدل‌های 3D</h3>
                    <div class="form-group">
                        <label>فرمت خروجی:</label>
                        <select id="outputFormat">
                            <option value="glb">GLB</option>
                            <option value="obj">OBJ</option>
                            <option value="stl">STL</option>
                            <option value="fbx">FBX</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>کیفیت:</label>
                        <select id="quality">
                            <option value="low">پایین</option>
                            <option value="medium" selected>متوسط</option>
                            <option value="high">بالا</option>
                        </select>
                    </div>
                    <button onclick="convert3DModel()">شروع تبدیل</button>
                    <div id="conversionResult" class="result"></div>
                </div>
            </div>

            <!-- تب وضعیت -->
            <div id="status" class="tab-content">
                <div class="card">
                    <h3>📊 وضعیت سامانه</h3>
                    <button onclick="checkHealth()">بررسی سلامت</button>
                    <button onclick="loadTransactions()">مشاهده تراکنش‌ها</button>
                    <div id="statusResult" class="result"></div>
                </div>
            </div>

            <div class="card">
                <h3>🌐 اطلاعات اتصال</h3>
                <p><strong>آدرس محلی:</strong> http://localhost:${PORT}</p>
                <p><strong>آدرس شبکه:</strong> http://192.168.1.102:${PORT}</p>
            </div>
        </div>

        <script>
            function switchTab(tabName) {
                document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                
                document.querySelector(`.tab[onclick="switchTab('${tabName}')"]`).classList.add('active');
                document.getElementById(tabName).classList.add('active');
            }

            async function loadRates() {
                try {
                    const response = await fetch('/api/rates');
                    const data = await response.json();
                    
                    const ratesContainer = document.getElementById('ratesContainer');
                    ratesContainer.innerHTML = '';
                    
                    Object.entries(data.rates).forEach(([currency, rate]) => {
                        if (currency !== 'IRT') {
                            const rateElement = document.createElement('div');
                            rateElement.className = 'currency-card';
                            rateElement.innerHTML = \`
                                <strong>\${currency}</strong><br>
                                \${rate.toLocaleString()} تومان
                            \`;
                            ratesContainer.appendChild(rateElement);
                        }
                    });
                } catch (error) {
                    console.error('Error loading rates:', error);
                }
            }

            async function calculateConversion() {
                const amount = document.getElementById('amount').value;
                const fromCurrency = document.getElementById('fromCurrency').value;
                const toCurrency = document.getElementById('toCurrency').value;
                
                if (!amount) {
                    alert('لطفا مبلغ را وارد کنید');
                    return;
                }

                const resultDiv = document.getElementById('financialResult');
                resultDiv.innerHTML = '🔄 در حال محاسبه...';

                try {
                    const response = await fetch('/api/calculate-conversion', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ amount, fromCurrency, toCurrency })
                    });
                    
                    const data = await response.json();
                    if (data.success) {
                        resultDiv.innerHTML = \`
                            💰 نتیجه تبدیل:
                            \${amount} \${fromCurrency} = \${data.convertedAmount.toFixed(8)} \${toCurrency}
                            💵 نرخ: 1 \${toCurrency} = \${data.rate.toLocaleString()} تومان
                        \`;
                    } else {
                        resultDiv.innerHTML = '❌ خطا: ' + data.error;
                    }
                } catch (error) {
                    resultDiv.innerHTML = '❌ خطا در ارتباط با سرور';
                }
            }

            async function executeTransaction() {
                const amount = document.getElementById('amount').value;
                const fromCurrency = document.getElementById('fromCurrency').value;
                const toCurrency = document.getElementById('toCurrency').value;
                
                if (!amount) {
                    alert('لطفا مبلغ را وارد کنید');
                    return;
                }

                const resultDiv = document.getElementById('financialResult');
                resultDiv.innerHTML = '🔄 در حال اجرای تراکنش...';

                try {
                    const response = await fetch('/api/execute-transaction', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ amount, fromCurrency, toCurrency })
                    });
                    
                    const data = await response.json();
                    if (data.success) {
                        resultDiv.innerHTML = \`
                            ✅ تراکنش موفق:
                            شناسه: \${data.transaction.id}
                            مبلغ: \${data.transaction.amount} \${data.transaction.fromCurrency}
                            تبدیل به: \${data.transaction.convertedAmount.toFixed(8)} \${data.transaction.toCurrency}
                            زمان: \${new Date(data.transaction.timestamp).toLocaleString('fa-IR')}
                        \`;
                    } else {
                        resultDiv.innerHTML = '❌ خطا: ' + data.error;
                    }
                } catch (error) {
                    resultDiv.innerHTML = '❌ خطا در ارتباط با سرور';
                }
            }

            async function convert3DModel() {
                const format = document.getElementById('outputFormat').value;
                const quality = document.getElementById('quality').value;

                const resultDiv = document.getElementById('conversionResult');
                resultDiv.innerHTML = '🔄 در حال تبدیل مدل 3D...';

                try {
                    const response = await fetch('/api/convert', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ format, quality })
                    });
                    
                    const data = await response.json();
                    if (data.success) {
                        resultDiv.innerHTML = \`
                            ✅ تبدیل موفق:
                            \${data.message}
                            فرمت: \${data.format}
                            کیفیت: \${data.quality}
                            لینک دانلود: \${data.downloadUrl}
                        \`;
                    } else {
                        resultDiv.innerHTML = '❌ خطا در تبدیل';
                    }
                } catch (error) {
                    resultDiv.innerHTML = '❌ خطا در ارتباط با سرور';
                }
            }

            async function checkHealth() {
                const resultDiv = document.getElementById('statusResult');
                resultDiv.innerHTML = '🔄 بررسی سلامت سامانه...';

                try {
                    const response = await fetch('/health');
                    const data = await response.json();
                    resultDiv.innerHTML = \`
                        ✅ سامانه فعال
                        پیام: \${data.message}
                        پلتفرم: \${data.platform}
                        زمان: \${new Date(data.timestamp).toLocaleString('fa-IR')}
                    \`;
                } catch (error) {
                    resultDiv.innerHTML = '❌ سامانه در دسترس نیست';
                }
            }

            async function loadTransactions() {
                const resultDiv = document.getElementById('statusResult');
                resultDiv.innerHTML = '🔄 دریافت تراکنش‌ها...';

                try {
                    const response = await fetch('/api/transactions');
                    const data = await response.json();
                    
                    if (data.transactions.length === 0) {
                        resultDiv.innerHTML = '📝 هیچ تراکنشی ثبت نشده است';
                        return;
                    }

                    let transactionsHTML = \`تعداد تراکنش‌ها: \${data.count}\\n\\n\`;
                    data.transactions.forEach(tx => {
                        transactionsHTML += \`
                            🔸 \${tx.id}
                            \${tx.amount} \${tx.fromCurrency} → \${tx.convertedAmount.toFixed(8)} \${tx.toCurrency}
                            زمان: \${new Date(tx.timestamp).toLocaleString('fa-IR')}
                            ---
                        \`;
                    });
                    
                    resultDiv.innerHTML = transactionsHTML;
                } catch (error) {
                    resultDiv.innerHTML = '❌ خطا در دریافت تراکنش‌ها';
                }
            }

            // بارگذاری اولیه
            document.addEventListener('DOMContentLoaded', function() {
                loadRates();
                checkHealth();
            });
        </script>
    </body>
    </html>
    `);
});

// راه‌اندازی سرور
app.listen(PORT, '0.0.0.0', () => {
    console.log('='.repeat(60));
    console.log('🚀 سامانه تبدیل 3D و مالی - TERMUX');
    console.log('📍 آدرس محلی: http://localhost:' + PORT);
    console.log('🌐 آدرس شبکه: http://192.168.1.102:' + PORT);
    console.log('💰 تب مالی: تبدیل ارزهای دیجیتال');
    console.log('🔄 تب تبدیل 3D: تبدیل مدل‌های سه‌بعدی');
    console.log('📊 تب وضعیت: سلامت سامانه و تراکنش‌ها');
    console.log('='.repeat(60));
});
