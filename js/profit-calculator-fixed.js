class ProfitCalculator {
    constructor() {
        this.storageKey = '3d_conversion_profits';
        this.commissionRate = 0.30;
        this.data = null;
        this.init();
    }

    init() {
        // اول از localStorage می‌خوانیم
        this.loadFromLocalStorage();
        
        // اگر داده‌ای نبود، ایجاد می‌کنیم
        if (!this.data || !this.data.transactions) {
            this.data = {
                totalRevenue: 1250.50,
                yourProfit: 375.15,
                platformCost: 875.35,
                transactions: [
                    {
                        id: 'PAY_001',
                        amount: 100,
                        yourProfit: 30,
                        status: 'completed',
                        timestamp: new Date().toISOString(),
                        crypto: 'USDT'
                    },
                    {
                        id: 'PAY_002',
                        amount: 150, 
                        yourProfit: 45,
                        status: 'completed',
                        timestamp: new Date(Date.now() - 86400000).toISOString(),
                        crypto: 'BTC'
                    },
                    {
                        id: 'PAY_003',
                        amount: 200,
                        yourProfit: 60,
                        status: 'pending',
                        timestamp: new Date(Date.now() - 172800000).toISOString(),
                        crypto: 'USDT'
                    }
                ],
                withdrawals: []
            };
            this.saveToLocalStorage();
        }
    }

    loadFromLocalStorage() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                this.data = JSON.parse(stored);
            }
        } catch (error) {
            console.log('استفاده از داده‌های موقت به دلیل مشکل localStorage');
            this.data = this.getDefaultData();
        }
    }

    saveToLocalStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        } catch (error) {
            console.log('ذخیره در localStorage با خطا مواجه شد');
        }
    }

    getDefaultData() {
        return {
            totalRevenue: 1250.50,
            yourProfit: 375.15,
            platformCost: 875.35,
            transactions: [],
            withdrawals: []
        };
    }

    calculateProfit(paymentAmount) {
        const amount = parseFloat(paymentAmount);
        const platformCost = amount * 0.70;
        const yourProfit = amount * this.commissionRate;
        
        return {
            grossAmount: amount,
            platformCost: platformCost,
            yourProfit: yourProfit,
            commissionRate: this.commissionRate
        };
    }

    recordPayment(payment) {
        const profitCalculation = this.calculateProfit(payment.amount);
        
        const transaction = {
            id: payment.id || 'PAY_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            timestamp: payment.timestamp || new Date().toISOString(),
            amount: payment.amount,
            crypto: payment.crypto || 'USDT',
            ...profitCalculation,
            status: 'pending'
        };

        this.data.transactions.push(transaction);
        this.data.totalRevenue += profitCalculation.grossAmount;
        this.data.yourProfit += profitCalculation.yourProfit;
        this.data.platformCost += profitCalculation.platformCost;

        this.saveToLocalStorage();
        return transaction;
    }

    getFinancialStats() {
        const pendingProfit = this.data.transactions
            .filter(t => t.status === 'pending')
            .reduce((sum, t) => sum + (t.yourProfit || 0), 0);

        const totalWithdrawals = this.data.withdrawals
            .filter(w => w.status === 'completed')
            .reduce((sum, w) => sum + (w.amount || 0), 0);

        return {
            totalRevenue: this.data.totalRevenue || 0,
            yourProfit: this.data.yourProfit || 0,
            platformCost: this.data.platformCost || 0,
            pendingProfit: pendingProfit,
            totalWithdrawals: totalWithdrawals,
            availableForWithdrawal: this.data.yourProfit || 0,
            transactionCount: this.data.transactions.length,
            withdrawalCount: this.data.withdrawals.length
        };
    }

    addTestPayment(amount = 100) {
        const testPayment = {
            amount: amount,
            crypto: 'USDT',
            timestamp: new Date().toISOString()
        };
        return this.recordPayment(testPayment);
    }

    resetData() {
        this.data = this.getDefaultData();
        this.saveToLocalStorage();
    }

    getProfitData() {
        return this.data;
    }
}

// ایجاد instance جهانی
if (typeof window !== 'undefined') {
    window.profitCalculator = new ProfitCalculator();
}
