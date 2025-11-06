class FinancialAdminPanel {
    constructor() {
        this.currentSection = 'dashboard';
        this.init();
    }

    init() {
        this.updateDateTime();
        this.loadSampleData();
        this.setupEventListeners();
        setInterval(() => this.updateDateTime(), 60000);
        setInterval(() => this.loadSampleData(), 120000);
    }

    updateDateTime() {
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        document.getElementById('currentDateTime').textContent = 
            now.toLocaleDateString('fa-IR', options);
    }

    showSection(sectionName) {
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.getElementById(sectionName + '-section').classList.add('active');
        document.querySelector(`[onclick="showSection('${sectionName}')"]`).classList.add('active');
        this.updatePageTitle(sectionName);
        this.currentSection = sectionName;
    }

    updatePageTitle(section) {
        const titles = {
            'dashboard': 'داشبورد مدیریت',
            'sales': 'گزارش فروش و درآمد',
            'crypto': 'مدیریت رمزارز',
            'transactions': 'تراکنش‌های مالی',
            'system': 'وضعیت سیستم'
        };
        document.getElementById('pageTitle').textContent = titles[section] || 'پنل مدیریت';
    }

    loadSampleData() {
        const sampleData = {
            totalRevenue: 12500000,
            totalConversions: 342,
            cryptoBalance: 0.524,
            activeUsers: 156,
            todaySales: 1850000,
            avgDaily: 1250000,
            maxSale: 2500000
        };

        document.getElementById('totalRevenue').textContent = 
            this.formatCurrency(sampleData.totalRevenue);
        document.getElementById('totalConversions').textContent = 
            sampleData.totalConversions.toLocaleString();
        document.getElementById('cryptoBalance').textContent = 
            sampleData.cryptoBalance + ' BTC';
        document.getElementById('activeUsers').textContent = 
            sampleData.activeUsers.toLocaleString();
        document.getElementById('todaySales').textContent = 
            this.formatCurrency(sampleData.todaySales);
        document.getElementById('avgDaily').textContent = 
            this.formatCurrency(sampleData.avgDaily);
        document.getElementById('maxSale').textContent = 
            this.formatCurrency(sampleData.maxSale);

        this.updateCharts();
        this.updateCryptoBalances();
        this.updateTransactions();
    }

    formatCurrency(amount) {
        return amount.toLocaleString('fa-IR') + ' تومان';
    }

    updateCharts() {
        const conversionData = {
            labels: ['هفته ۱', 'هفته ۲', 'هفته ۳', 'هفته ۴'],
            datasets: [{
                label: 'تبدیل‌های 3D',
                data: [65, 78, 90, 120],
                backgroundColor: 'rgba(79, 70, 229, 0.2)',
                borderColor: 'rgba(79, 70, 229, 1)',
                borderWidth: 2,
                tension: 0.4
            }]
        };

        const revenueData = {
            labels: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'],
            datasets: [{
                label: 'درآمد (هزار تومان)',
                data: [1200, 1900, 1500, 2000, 1800, 2200, 2500],
                backgroundColor: 'rgba(34, 197, 94, 0.2)',
                borderColor: 'rgba(34, 197, 94, 1)',
                borderWidth: 2,
                tension: 0.4
            }]
        };

        const conversionsCtx = document.getElementById('conversionsChart').getContext('2d');
        if (window.conversionsChart) window.conversionsChart.destroy();
        window.conversionsChart = new Chart(conversionsCtx, {
            type: 'line', data: conversionData, options: { responsive: true, maintainAspectRatio: false }
        });

        const revenueCtx = document.getElementById('revenueChart').getContext('2d');
        if (window.revenueChart) window.revenueChart.destroy();
        window.revenueChart = new Chart(revenueCtx, {
            type: 'bar', data: revenueData, options: { responsive: true, maintainAspectRatio: false }
        });
    }

    updateCryptoBalances() {
        const balances = {
            'بیت‌کوین (BTC)': 0.524,
            'اتریوم (ETH)': 2.15,
            'تتر (USDT)': 1250.50,
            'ریپل (XRP)': 5000
        };

        const rates = {
            'BTC/IRT': '12,450,000,000',
            'ETH/IRT': '850,000,000',
            'USDT/IRT': '60,150',
            'XRP/IRT': '3,450'
        };

        let balancesHTML = '';
        for (const [currency, balance] of Object.entries(balances)) {
            balancesHTML += `<div class="stat-item"><span>${currency}:</span><strong>${balance}</strong></div>`;
        }

        let ratesHTML = '';
        for (const [pair, rate] of Object.entries(rates)) {
            ratesHTML += `<div class="stat-item"><span>${pair}:</span><strong>${rate}</strong></div>`;
        }

        document.getElementById('cryptoBalancesList').innerHTML = balancesHTML;
        document.getElementById('exchangeRates').innerHTML = ratesHTML;
    }

    updateTransactions() {
        const transactions = [
            { date: '1402/08/07 - 14:30', amount: 250000, type: 'تبدیل 3D', status: 'موفق', user: 'کاربر ۱۲۳' },
            { date: '1402/08/07 - 13:15', amount: 180000, type: 'اشتراک ماهانه', status: 'موفق', user: 'کاربر ۴۵۶' },
            { date: '1402/08/07 - 11:45', amount: 50000, type: 'تبدیل 3D', status: 'ناموفق', user: 'کاربر ۷۸۹' }
        ];

        let transactionsHTML = '';
        transactions.forEach(transaction => {
            const statusClass = transaction.status === 'موفق' ? 'healthy' : 'warning';
            transactionsHTML += `
                <tr>
                    <td>${transaction.date}</td>
                    <td>${this.formatCurrency(transaction.amount)}</td>
                    <td>${transaction.type}</td>
                    <td><span class="status-badge ${statusClass}">${transaction.status}</span></td>
                    <td>${transaction.user}</td>
                </tr>
            `;
        });

        document.getElementById('transactionsTable').innerHTML = transactionsHTML;
    }

    setupEventListeners() {
        document.querySelector('.btn-primary').addEventListener('click', () => {
            this.loadSampleData();
            this.showNotification('داده‌ها با موفقیت بروزرسانی شدند', 'success');
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 20px; left: 20px; padding: 15px 20px;
            background: ${type === 'success' ? '#48bb78' : '#4299e1'};
            color: white; border-radius: 8px; z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => { notification.remove(); }, 3000);
    }
}

function showSection(sectionName) { window.adminPanel.showSection(sectionName); }
function loadData() { window.adminPanel.loadSampleData(); }

document.addEventListener('DOMContentLoaded', function() {
    window.adminPanel = new FinancialAdminPanel();
});
