class RealTimeFinancialSystem {
    constructor() {
        this.currentSection = 'dashboard';
        this.refreshInterval = 5000; // 5 ثانیه
        this.refreshTimer = null;
        this.pendingTransaction = null;
        this.transactionHistory = [];
        this.init();
    }

    init() {
        this.startAutoRefresh();
        this.setupEventListeners();
        this.loadFinancialData();
        this.simulateRealTimeTransactions();
        
        console.log('💰 سیستم مالی بلادرنگ راه‌اندازی شد');
    }

    startAutoRefresh() {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
        }
        
        this.refreshTimer = setInterval(() => {
            this.loadFinancialData();
        }, this.refreshInterval);
    }

    setupEventListeners() {
        // تغییر روش پرداخت
        document.querySelectorAll('.method-card').forEach(card => {
            card.addEventListener('click', (e) => {
                document.querySelectorAll('.method-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                this.showDepositForm(card.dataset.method);
            });
        });

        // محاسبه کارمزد برداشت
        document.getElementById('withdrawAmount').addEventListener('input', (e) => {
            this.calculateWithdrawFee();
        });

        document.getElementById('withdrawMethod').addEventListener('change', (e) => {
            this.toggleWithdrawInfo(e.target.value);
        });

        // فیلتر تراکنش‌ها
        document.getElementById('transactionFilter').addEventListener('change', (e) => {
            this.filterTransactions(e.target.value);
        });
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
        
        this.currentSection = sectionName;
        this.updatePageTitle(sectionName);
    }

    updatePageTitle(section) {
        const titles = {
            'dashboard': 'داشبورد مالی بلادرنگ',
            'deposit': 'واریز لحظه‌ای',
            'withdraw': 'برداشت لحظه‌ای',
            'transactions': 'تراکنش‌های زنده',
            'gateways': 'درگاه‌های پرداخت'
        };
        document.getElementById('pageTitle').textContent = titles[section] || 'سیستم مالی';
    }

    async loadFinancialData() {
        try {
            const data = this.generateFinancialData();
            this.updateDashboard(data);
            this.updateCharts(data);
            this.updateLiveTransactions();
            
        } catch (error) {
            console.error('خطا در دریافت داده‌های مالی:', error);
        }
    }

    generateFinancialData() {
        const now = new Date();
        return {
            timestamp: now.getTime(),
            balances: {
                total: 125000000 + Math.random() * 10000000,
                available: 98000000 + Math.random() * 5000000,
                pending: 2700000 + Math.random() * 1000000
            },
            today: {
                deposits: 15 + Math.floor(Math.random() * 5),
                withdrawals: 8 + Math.floor(Math.random() * 3),
                depositAmount: 45000000 + Math.random() * 10000000,
                withdrawAmount: 28000000 + Math.random() * 5000000
            },
            totals: {
                deposits: 245000000 + Math.random() * 20000000,
                withdrawals: 187000000 + Math.random() * 15000000,
                pendingTransactions: 3 + Math.floor(Math.random() * 2)
            },
            successRate: 98.2 + (Math.random() - 0.5) * 0.5
        };
    }

    updateDashboard(data) {
        // به‌روزرسانی موجودی‌ها
        document.getElementById('totalBalance').textContent = 
            this.formatCurrency(data.balances.total);
        document.getElementById('pendingBalance').textContent = 
            this.formatCurrency(data.balances.pending);
        document.getElementById('availableBalance').textContent = 
            this.formatCurrency(data.balances.available);

        // آمار امروز
        document.getElementById('todayDeposits').textContent = data.today.deposits;
        document.getElementById('todayWithdrawals').textContent = data.today.withdrawals;

        // کارت‌های اصلی
        document.getElementById('totalDeposits').textContent = 
            this.formatCurrency(data.totals.deposits);
        document.getElementById('totalWithdrawals').textContent = 
            this.formatCurrency(data.totals.withdrawals);
        document.getElementById('pendingTransactions').textContent = 
            data.totals.pendingTransactions;
        document.getElementById('successRate').textContent = 
            data.successRate.toFixed(1) + '%';
    }

    updateCharts(data) {
        this.updateCashflowChart();
        this.updateTransactionsPieChart();
    }

    updateCashflowChart() {
        const ctx = document.getElementById('cashflowChart').getContext('2d');
        const labels = Array.from({length: 24}, (_, i) => `${i}:00`);
        const depositData = Array.from({length: 24}, () => Math.floor(Math.random() * 2000) + 500);
        const withdrawData = Array.from({length: 24}, () => Math.floor(Math.random() * 1000) + 200);
        
        if (window.cashflowChart) {
            window.cashflowChart.data.labels = labels;
            window.cashflowChart.data.datasets[0].data = depositData;
            window.cashflowChart.data.datasets[1].data = withdrawData;
            window.cashflowChart.update('none');
        } else {
            window.cashflowChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'واریز',
                            data: depositData,
                            backgroundColor: 'rgba(34, 197, 94, 0.6)',
                            borderColor: '#10b981',
                            borderWidth: 1
                        },
                        {
                            label: 'برداشت',
                            data: withdrawData,
                            backgroundColor: 'rgba(239, 68, 68, 0.6)',
                            borderColor: '#ef4444',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: { duration: 0 },
                    scales: {
                        x: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
                        y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } }
                    }
                }
            });
        }
    }

    updateTransactionsPieChart() {
        const ctx = document.getElementById('transactionsPieChart').getContext('2d');
        
        if (window.transactionsPieChart) {
            window.transactionsPieChart.data.datasets[0].data = [65, 25, 10];
            window.transactionsPieChart.update('none');
        } else {
            window.transactionsPieChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['موفق', 'ناموفق', 'در انتظار'],
                    datasets: [{
                        data: [65, 25, 10],
                        backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: { duration: 0 },
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { color: '#94a3b8' }
                        }
                    }
                }
            });
        }
    }

    simulateRealTimeTransactions() {
        // شبیه‌سازی تراکنش‌های لحظه‌ای
        setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance of new transaction
                this.addLiveTransaction();
            }
        }, 3000);
    }

    addLiveTransaction() {
        const types = ['deposit', 'withdraw'];
        const statuses = ['pending', 'completed', 'failed'];
        const transaction = {
            id: 'TX' + Date.now(),
            type: types[Math.floor(Math.random() * types.length)],
            amount: Math.floor(Math.random() * 5000000) + 100000,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            timestamp: new Date(),
            user: 'کاربر #' + (1000 + Math.floor(Math.random() * 100))
        };

        this.transactionHistory.unshift(transaction);
        this.updateLiveTransactions();
        this.updateTransactionsTable();

        // نمایش نوتیفیکیشن برای تراکنش‌های مهم
        if (transaction.amount > 1000000) {
            this.showNotification(
                `تراکنش جدید: ${this.formatCurrency(transaction.amount)} - ${transaction.type === 'deposit' ? 'واریز' : 'برداشت'}`,
                'info'
            );
        }
    }

    updateLiveTransactions() {
        const container = document.getElementById('transactionsLive');
        const recentTransactions = this.transactionHistory.slice(0, 5);
        
        const html = recentTransactions.map(tx => `
            <div class="transaction-item">
                <span class="transaction-type type-${tx.type}">
                    ${tx.type === 'deposit' ? 'واریز' : 'برداشت'}
                </span>
                <span>${this.formatCurrency(tx.amount)}</span>
                <span>${tx.user}</span>
                <span class="status-${tx.status}">
                    ${tx.status === 'pending' ? '⏳' : tx.status === 'completed' ? '✅' : '❌'}
                </span>
                <span>${tx.timestamp.toLocaleTimeString('fa-IR')}</span>
            </div>
        `).join('');

        container.innerHTML = html;
    }

    updateTransactionsTable() {
        const tbody = document.getElementById('transactionsTableBody');
        const html = this.transactionHistory.map(tx => `
            <tr>
                <td>${tx.timestamp.toLocaleString('fa-IR')}</td>
                <td>${tx.id}</td>
                <td>
                    <span class="transaction-type type-${tx.type}">
                        ${tx.type === 'deposit' ? 'واریز' : 'برداشت'}
                    </span>
                </td>
                <td>${this.formatCurrency(tx.amount)}</td>
                <td>
                    <span class="status-${tx.status}">
                        ${tx.status === 'pending' ? 'در انتظار' : 
                          tx.status === 'completed' ? 'تکمیل شده' : 'ناموفق'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm" onclick="viewTransactionDetails('${tx.id}')">
                        🔍
                    </button>
                </td>
            </tr>
        `).join('');

        tbody.innerHTML = html;
    }

    showDepositForm(method) {
        // مخفی کردن تمام فرم‌ها
        document.querySelectorAll('.deposit-form').forEach(form => {
            form.style.display = 'none';
        });

        // نمایش فرم مربوطه
        const formId = method + 'Form';
        const form = document.getElementById(formId);
        if (form) {
            form.style.display = 'block';
        }
    }

    toggleWithdrawInfo(method) {
        document.getElementById('cryptoWithdrawInfo').style.display = 
            method === 'crypto' ? 'block' : 'none';
        document.getElementById('bankWithdrawInfo').style.display = 
            method === 'bank' ? 'block' : 'none';
        
        this.calculateWithdrawFee();
    }

    calculateWithdrawFee() {
        const amount = parseFloat(document.getElementById('withdrawAmount').value) || 0;
        const method = document.getElementById('withdrawMethod').value;
        
        let fee = 0;
        if (method === 'crypto') {
            fee = amount * 0.01; // 1% fee for crypto
        } else if (method === 'bank') {
            fee = amount * 0.005; // 0.5% fee for bank
        } else {
            fee = amount * 0.002; // 0.2% fee for internal
        }

        const finalAmount = amount - fee;
        
        document.getElementById('withdrawFee').textContent = this.formatCurrency(fee);
        document.getElementById('finalAmount').textContent = this.formatCurrency(finalAmount);
    }

    initiateDeposit() {
        const amount = document.getElementById('depositAmount').value;
        const currency = document.getElementById('cryptoCurrency').value;
        
        if (!amount || amount < 500000) {
            this.showNotification('حداقل مبلغ واریز ۵۰۰,۰۰۰ تومان است', 'error');
            return;
        }

        this.pendingTransaction = {
            type: 'deposit',
            amount: parseFloat(amount),
            currency: currency,
            timestamp: new Date(),
            status: 'pending'
        };

        this.showConfirmationModal(this.pendingTransaction);
    }

    initiateWithdrawal() {
        const amount = parseFloat(document.getElementById('withdrawAmount').value);
        const method = document.getElementById('withdrawMethod').value;
        const address = document.getElementById('withdrawAddress').value;
        
        if (!amount || amount < 100000) {
            this.showNotification('حداقل مبلغ برداشت ۱۰۰,۰۰۰ تومان است', 'error');
            return;
        }

        if ((method === 'crypto' || method === 'bank') && !address) {
            this.showNotification('لطفا آدرس مقصد را وارد کنید', 'error');
            return;
        }

        this.pendingTransaction = {
            type: 'withdraw',
            amount: amount,
            method: method,
            address: address,
            timestamp: new Date(),
            status: 'pending'
        };

        this.showConfirmationModal(this.pendingTransaction);
    }

    showConfirmationModal(transaction) {
        const modal = document.getElementById('confirmationModal');
        const details = document.getElementById('modalDetails');
        
        let detailsHTML = '';
        if (transaction.type === 'deposit') {
            detailsHTML = `
                <p>نوع: واریز ${transaction.currency.toUpperCase()}</p>
                <p>مبلغ: ${this.formatCurrency(transaction.amount)}</p>
                <p>آدرس: ${document.getElementById('walletAddress').value}</p>
            `;
        } else {
            detailsHTML = `
                <p>نوع: برداشت ${transaction.method}</p>
                <p>مبلغ: ${this.formatCurrency(transaction.amount)}</p>
                <p>کارمزد: ${document.getElementById('withdrawFee').textContent}</p>
                <p>دریافتی: ${document.getElementById('finalAmount').textContent}</p>
            `;
        }

        details.innerHTML = detailsHTML;
        modal.style.display = 'block';
    }

    confirmTransaction() {
        if (this.pendingTransaction) {
            // شبیه‌سازی تایید تراکنش
            setTimeout(() => {
                this.pendingTransaction.status = 'completed';
                this.pendingTransaction.id = 'TX' + Date.now();
                this.transactionHistory.unshift({...this.pendingTransaction});
                
                this.updateLiveTransactions();
                this.updateTransactionsTable();
                this.showNotification('تراکنش با موفقیت انجام شد', 'success');
                
                this.closeModal();
                this.pendingTransaction = null;
            }, 2000);
        }
    }

    cancelTransaction() {
        this.pendingTransaction = null;
        this.closeModal();
        this.showNotification('تراکنش لغو شد', 'error');
    }

    closeModal() {
        document.getElementById('confirmationModal').style.display = 'none';
    }

    filterTransactions(filter) {
        // در حالت واقعی اینجا فیلتر کردن انجام می‌شود
        console.log('فیلتر تراکنش‌ها:', filter);
    }

    formatCurrency(amount) {
        return amount.toLocaleString('fa-IR') + ' تومان';
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            border-radius: 8px;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            font-size: 0.9rem;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
}

// توابع سراسری
function showSection(sectionName) {
    window.financialSystem.showSection(sectionName);
}

function syncFinancialData() {
    window.financialSystem.loadFinancialData();
}

function copyWalletAddress() {
    const address = document.getElementById('walletAddress');
    address.select();
    document.execCommand('copy');
    window.financialSystem.showNotification('آدرس کپی شد', 'success');
}

function initiateDeposit() {
    window.financialSystem.initiateDeposit();
}

function initiateWithdrawal() {
    window.financialSystem.initiateWithdrawal();
}

function confirmTransaction() {
    window.financialSystem.confirmTransaction();
}

function cancelTransaction() {
    window.financialSystem.cancelTransaction();
}

function viewTransactionDetails(txId) {
    window.financialSystem.showNotification(`جزییات تراکنش ${txId}`, 'info');
}

// راه‌اندازی سیستم
document.addEventListener('DOMContentLoaded', function() {
    window.financialSystem = new RealTimeFinancialSystem();
});
