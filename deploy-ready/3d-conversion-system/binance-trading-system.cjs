const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const WebSocket = require('ws');
const app = express();
const PORT = 3000;

// سیستم معاملاتی با Binance API
class BinanceTradingSystem {
    constructor() {
        this.baseUrl = 'https://api.binance.com';
        this.wsUrl = 'wss://stream.binance.com:9443/ws';
        this.apiKey = process.env.BINANCE_API_KEY || 'demo';
        this.apiSecret = process.env.BINANCE_API_SECRET || 'demo';
        
        this.realTimePrices = {};
        this.userPortfolio = this.generateDemoPortfolio();
        this.connectionStatus = 'disconnected';
        
        this.connectWebSocket();
    }

    // اتصال به WebSocket برای داده‌های زنده
    connectWebSocket() {
        try {
            const symbols = ['btcusdt', 'ethusdt', 'adausdt', 'dotusdt', 'linkusdt', 'usdttry'];
            const streams = symbols.map(symbol => `${symbol}@ticker`).join('/');
            
            this.ws = new WebSocket(`${this.wsUrl}/${streams}`);
            
            this.ws.on('open', () => {
                console.log('✅ WebSocket به Binance متصل شد');
                this.connectionStatus = 'connected';
            });

            this.ws.on('message', (data) => {
                try {
                    const ticker = JSON.parse(data);
                    this.realTimePrices[ticker.s] = {
                        price: parseFloat(ticker.c),
                        change: parseFloat(ticker.P),
                        high: parseFloat(ticker.h),
                        low: parseFloat(ticker.l),
                        volume: parseFloat(ticker.v),
                        timestamp: new Date().toISOString()
                    };
                } catch (error) {
                    console.error('خطا در پردازش داده WebSocket:', error);
                }
            });

            this.ws.on('error', (error) => {
                console.error('❌ خطای WebSocket:', error);
                this.connectionStatus = 'error';
            });

            this.ws.on('close', () => {
                console.log('🔌 WebSocket قطع شد');
                this.connectionStatus = 'disconnected';
                // تلاش برای اتصال مجدد پس از 5 ثانیه
                setTimeout(() => this.connectWebSocket(), 5000);
            });

        } catch (error) {
            console.error('❌ خطا در اتصال WebSocket:', error);
        }
    }

    // تولید پرتفوی دمو با داده‌های واقع‌گرایانه
    generateDemoPortfolio() {
        return {
            'USDT': 1000 + Math.random() * 5000,
            'BTC': 0.001 + Math.random() * 0.01,
            'ETH': 0.01 + Math.random() * 0.1,
            'ADA': 100 + Math.random() * 500,
            'DOT': 5 + Math.random() * 20,
            'LINK': 10 + Math.random() * 50,
            'BNB': 0.1 + Math.random() * 1
        };
    }

    // دریافت قیمت‌های واقعی از Binance
    async getRealTimePrices() {
        try {
            const response = await axios.get(`${this.baseUrl}/api/v3/ticker/price`);
            const prices = {};
            
            response.data.forEach(item => {
                prices[item.symbol] = {
                    price: parseFloat(item.price),
                    timestamp: new Date().toISOString()
                };
            });

            // ترکیب با داده‌های WebSocket
            Object.assign(prices, this.realTimePrices);
            
            return prices;
        } catch (error) {
            console.error('❌ خطا در دریافت قیمت‌ها:', error.message);
            return this.realTimePrices;
        }
    }

    // محاسبه ارزش پرتفوی بر اساس قیمت‌های واقعی
    async calculatePortfolioValue() {
        const prices = await this.getRealTimePrices();
        let totalValue = 0;
        const portfolioValue = {};

        for (const [asset, amount] of Object.entries(this.userPortfolio)) {
            let assetValue = 0;
            
            if (asset === 'USDT') {
                assetValue = amount;
            } else {
                const symbol = `${asset}USDT`;
                if (prices[symbol]) {
                    assetValue = amount * prices[symbol].price;
                }
            }
            
            portfolioValue[asset] = {
                amount: amount,
                value: assetValue,
                price: asset === 'USDT' ? 1 : (prices[`${asset}USDT`]?.price || 0)
            };
            
            totalValue += assetValue;
        }

        return {
            totalValue: totalValue,
            breakdown: portfolioValue,
            prices: prices,
            timestamp: new Date().toISOString()
        };
    }

    // شبیه‌سازی معامله با قیمت‌های واقعی
    async executeTrade(tradeData) {
        const { symbol, side, quantity, price } = tradeData;
        const baseAsset = symbol.replace('USDT', '');
        
        try {
            // دریافت قیمت واقعی
            const currentPrice = this.realTimePrices[symbol]?.price;
            if (!currentPrice) {
                throw new Error('قیمت واقعی در دسترس نیست');
            }

            // محاسبه هزینه/دریافت
            const tradeValue = quantity * currentPrice;

            if (side === 'BUY') {
                // بررسی موجودی کافی
                if (this.userPortfolio.USDT < tradeValue) {
                    throw new Error('موجودی USDT کافی نیست');
                }
                
                // انجام معامله
                this.userPortfolio.USDT -= tradeValue;
                this.userPortfolio[baseAsset] = (this.userPortfolio[baseAsset] || 0) + quantity;
                
            } else if (side === 'SELL') {
                // بررسی موجودی کافی
                if (!this.userPortfolio[baseAsset] || this.userPortfolio[baseAsset] < quantity) {
                    throw new Error(`موجودی ${baseAsset} کافی نیست`);
                }
                
                // انجام معامله
                this.userPortfolio[baseAsset] -= quantity;
                this.userPortfolio.USDT += tradeValue;
            }

            // ثبت تراکنش
            const transaction = {
                id: `BIN_${Date.now()}`,
                symbol: symbol,
                side: side,
                quantity: quantity,
                price: currentPrice,
                value: tradeValue,
                timestamp: new Date().toISOString(),
                status: 'FILLED',
                portfolioAfter: { ...this.userPortfolio }
            };

            return transaction;

        } catch (error) {
            throw new Error(`خطا در معامله: ${error.message}`);
        }
    }

    // دریافت اطلاعات بازار
    async getMarketInfo() {
        try {
            const response = await axios.get(`${this.baseUrl}/api/v3/ticker/24hr`);
            return response.data.filter(item => 
                item.symbol.endsWith('USDT') && 
                parseFloat(item.volume) > 1000000
            ).slice(0, 20);
        } catch (error) {
            console.error('خطا در دریافت اطلاعات بازار:', error.message);
            return [];
        }
    }
}

// راه‌اندازی سیستم
const tradingSystem = new BinanceTradingSystem();

// ==================== مسیرهای API ====================

app.use(express.json());

// اطلاعات پرتفوی با قیمت‌های واقعی
app.get('/api/binance/portfolio', async (req, res) => {
    try {
        const portfolioValue = await tradingSystem.calculatePortfolioValue();
        
        res.json({
            success: true,
            portfolio: tradingSystem.userPortfolio,
            valuation: portfolioValue,
            connection: tradingSystem.connectionStatus,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// انجام معامله
app.post('/api/binance/trade', async (req, res) => {
    try {
        const { symbol, side, quantity } = req.body;
        
        const transaction = await tradingSystem.executeTrade({
            symbol: symbol.toUpperCase(),
            side: side.toUpperCase(),
            quantity: parseFloat(quantity),
            price: 0 // استفاده از قیمت بازار
        });

        res.json({
            success: true,
            message: 'معامله با موفقیت انجام شد',
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

// اطلاعات بازار
app.get('/api/binance/market', async (req, res) => {
    try {
        const marketInfo = await tradingSystem.getMarketInfo();
        const prices = await tradingSystem.getRealTimePrices();
        
        res.json({
            success: true,
            market: marketInfo,
            prices: prices,
            connection: tradingSystem.connectionStatus,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// وضعیت اتصال
app.get('/api/binance/status', (req, res) => {
    res.json({
        success: true,
        connection: tradingSystem.connectionStatus,
        pricesCount: Object.keys(tradingSystem.realTimePrices).length,
        timestamp: new Date().toISOString()
    });
});

// صفحه اصلی
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html dir="ltr" lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Real Binance Trading System</title>
        <style>
            body { 
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                background: linear-gradient(135deg, #0c2461 0%, #1e3799 100%);
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
            .connection-status {
                padding: 10px;
                border-radius: 5px;
                margin: 10px 0;
                text-align: center;
            }
            .connected { background: rgba(0,255,136,0.3); border: 1px solid #00ff88; }
            .disconnected { background: rgba(255,0,0,0.3); border: 1px solid #ff4444; }
            .price-item {
                display: flex;
                justify-content: space-between;
                padding: 8px;
                margin: 5px 0;
                background: rgba(255,255,255,0.1);
                border-radius: 5px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 Binance Real Trading System</h1>
            
            <div id="connectionStatus" class="connection-status">
                Checking connection...
            </div>

            <div class="grid">
                <div class="card">
                    <h3>💰 Portfolio Value</h3>
                    <div id="portfolioValue">Loading...</div>
                </div>
                
                <div class="card">
                    <h3>📈 Real-time Prices</h3>
                    <div id="pricesContainer"></div>
                </div>
                
                <div class="card">
                    <h3>🔄 Trade</h3>
                    <select id="tradeSymbol">
                        <option value="BTCUSDT">BTC/USDT</option>
                        <option value="ETHUSDT">ETH/USDT</option>
                        <option value="ADAUSDT">ADA/USDT</option>
                    </select>
                    <select id="tradeSide">
                        <option value="BUY">BUY</option>
                        <option value="SELL">SELL</option>
                    </select>
                    <input type="number" id="tradeQuantity" placeholder="Quantity" step="0.0001">
                    <button onclick="executeTrade()">Execute Trade</button>
                    <div id="tradeResult"></div>
                </div>
            </div>
        </div>

        <script>
            async function updateConnectionStatus() {
                try {
                    const response = await fetch('/api/binance/status');
                    const data = await response.json();
                    
                    const statusDiv = document.getElementById('connectionStatus');
                    statusDiv.className = \`connection-status \${data.connection === 'connected' ? 'connected' : 'disconnected'}\`;
                    statusDiv.innerHTML = \`
                        WebSocket: \${data.connection.toUpperCase()} | 
                        Prices: \${data.pricesCount} symbols
                    \`;
                } catch (error) {
                    console.error('Error:', error);
                }
            }

            async function updatePortfolio() {
                try {
                    const response = await fetch('/api/binance/portfolio');
                    const data = await response.json();
                    
                    if (data.success) {
                        document.getElementById('portfolioValue').innerHTML = \`
                            <strong>Total: $\{data.valuation.totalValue.toFixed(2)} USDT</strong>
                        \`;
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }

            async function updatePrices() {
                try {
                    const response = await fetch('/api/binance/market');
                    const data = await response.json();
                    
                    const container = document.getElementById('pricesContainer');
                    if (data.success && data.prices) {
                        let html = '';
                        Object.entries(data.prices).slice(0, 10).forEach(([symbol, info]) => {
                            if (typeof info === 'object' && info.price) {
                                html += \`
                                    <div class="price-item">
                                        <span>\${symbol}</span>
                                        <span>\${info.price.toFixed(4)}</span>
                                    </div>
                                \`;
                            }
                        });
                        container.innerHTML = html;
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }

            async function executeTrade() {
                const symbol = document.getElementById('tradeSymbol').value;
                const side = document.getElementById('tradeSide').value;
                const quantity = document.getElementById('tradeQuantity').value;
                
                if (!quantity) {
                    alert('Please enter quantity');
                    return;
                }

                const resultDiv = document.getElementById('tradeResult');
                resultDiv.innerHTML = 'Executing trade...';

                try {
                    const response = await fetch('/api/binance/trade', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ symbol, side, quantity })
                    });
                    
                    const data = await response.json();
                    if (data.success) {
                        resultDiv.innerHTML = \`
                            ✅ Trade executed: \${data.transaction.side} \${data.transaction.quantity} \${data.transaction.symbol}
                        \`;
                        updatePortfolio();
                    } else {
                        resultDiv.innerHTML = '❌ Error: ' + data.error;
                    }
                } catch (error) {
                    resultDiv.innerHTML = '❌ Connection error';
                }
            }

            // Auto-update
            setInterval(updateConnectionStatus, 5000);
            setInterval(updatePortfolio, 10000);
            setInterval(updatePrices, 5000);
            
            // Initial load
            updateConnectionStatus();
            updatePortfolio();
            updatePrices();
        </script>
    </body>
    </html>
    `);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log('='.repeat(70));
    console.log('🚀 Binance Real Trading System');
    console.log('📍 آدرس: http://localhost:' + PORT);
    console.log('💎 اتصال مستقیم به Binance WebSocket');
    console.log('📊 قیمت‌های زنده و واقعی');
    console.log('💰 معاملات با داده‌های واقعی بازار');
    console.log('='.repeat(70));
    console.log('\n💡 نکته: این سیستم از WebSocket Binance استفاده می‌کند');
    console.log('   و نیازی به API Key برای داده‌های بازار ندارد');
});
