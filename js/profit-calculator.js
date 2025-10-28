class ProfitCalculator {
    constructor() {
        this.storageKey = '3d_conversion_profits';
        this.commissionRate = 0.30;
        this.init();
    }

    init() {
        if (!this.getProfitData()) {
            this.setProfitData({
                totalRevenue: 1250.50,
                yourProfit: 375.15,
                platformCost: 875.35,
                transactions: [
                    {
                        id: 'PAY_001',
                        amount: 100,
                        yourProfit: 30,
                        status: 'completed',
                        timestamp: new Date().toISOString()
                    }
                ],
                withdrawals: []
            });
        }
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
        const profitData = this.getProfitData();
        const profitCalculation = this.calculateProfit(payment.amount);
        
        const transaction = {
            id: payment.id || 'PAY_' + Date.now(),
            timestamp: payment.timestamp || new Date().toISOString(),
            amount: payment.amount,
            crypto: payment.crypto || 'USDT',
            ...profitCalculation,
            status: 'pending'
        };

        profitData.transactions.push(transaction);
        profitData.totalRevenue += profitCalculation.grossAmount;
        profitData.yourProfit += profitCalculation.yourProfit;
        profitData.platformCost += profitCalculation.platformCost;

        this.setProfitData(profitData);
        return transaction;
    }

    getFinancialStats() {
        const profitData = this.getProfitData();
        const pendingProfit = profitData.transactions
            .filter(t => t.status === 'pending')
            .reduce((sum, t) => sum + t.yourProfit, 0);
        
        return {
            totalRevenue: profitData.totalRevenue || 0,
            yourProfit: profitData.yourProfit || 0,
            platformCost: profitData.platformCost || 0,
            pendingProfit: pendingProfit,
            availableForWithdrawal: profitData.yourProfit || 0,
            transactionCount: profitData.transactions ? profitData.transactions.length : 0,
            withdrawalCount: profitData.withdrawals ? profitData.withdrawals.length : 0
        };
    }

    getProfitData() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey)) || {};
        } catch {
            return {};
        }
    }

    setProfitData(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }
}

// ایجاد instance جهانی
if (typeof window !== 'undefined') {
    window.profitCalculator = new ProfitCalculator();
}
