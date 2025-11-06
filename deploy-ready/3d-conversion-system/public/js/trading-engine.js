// موتور معاملات رمزارز پیشرفته
class CryptoTradingEngine {
    constructor() {
        this.prices = {
            BTC: 64280,
            ETH: 3450,
            USDT: 1
        };
        this.orders = [];
        this.isMarketOpen = true;
    }

    // ثبت سفارش خرید
    placeBuyOrder(symbol, amount, price) {
        if (!this.isMarketOpen) {
            throw new Error('بازار بسته است');
        }

        const order = {
            id: this.generateOrderId(),
            symbol,
            type: 'BUY',
            amount,
            price,
            timestamp: new Date(),
            status: 'PENDING'
        };

        this.orders.push(order);
        this.executeOrder(order);
        return order;
    }

    // ثبت سفارش فروش
    placeSellOrder(symbol, amount, price) {
        if (!this.isMarketOpen) {
            throw new Error('بازار بسته است');
        }

        const order = {
            id: this.generateOrderId(),
            symbol,
            type: 'SELL',
            amount,
            price,
            timestamp: new Date(),
            status: 'PENDING'
        };

        this.orders.push(order);
        this.executeOrder(order);
        return order;
    }

    // اجرای سفارش
    executeOrder(order) {
        setTimeout(() => {
            order.status = 'EXECUTED';
            order.executedPrice = this.prices[order.symbol];
            this.notifyOrderUpdate(order);
        }, 1000 + Math.random() * 2000);
    }

    // تولید ID منحصر به فرد
    generateOrderId() {
        return 'ORD_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // اطلاع‌رسانی بروزرسانی سفارش
    notifyOrderUpdate(order) {
        console.log('Order updated:', order);
        // اینجا می‌توانید با UI تعامل کنید
    }

    // دریافت قیمت لحظه‌ای
    getPrice(symbol) {
        return this.prices[symbol];
    }

    // شبیه‌سازی نوسان قیمت
    simulatePriceMovement() {
        setInterval(() => {
            this.prices.BTC += (Math.random() - 0.5) * 100;
            this.prices.ETH += (Math.random() - 0.5) * 10;
            
            // محدود کردن قیمت‌ها
            this.prices.BTC = Math.max(50000, Math.min(80000, this.prices.BTC));
            this.prices.ETH = Math.max(2000, Math.min(5000, this.prices.ETH));
            
        }, 5000);
    }
}

// نمونه جهانی
const tradingEngine = new CryptoTradingEngine();
tradingEngine.simulatePriceMovement();
