class RealTimeAdminPanel {
    constructor() {
        this.currentSection = 'dashboard';
        this.refreshInterval = 10000; // 10 ثانیه
        this.refreshTimer = null;
        this.lastData = {};
        this.connectionStatus = 'connected';
        this.init();
    }

    init() {
        this.updateDateTime();
        this.startAutoRefresh();
        this.setupWebSocketSimulation();
        this.loadRealTimeData();
        
        // بروزرسانی زمان هر ثانیه
        setInterval(() => this.updateDateTime(), 1000);
        
        // شبیه‌سازی داده‌های بلادرنگ
        setInterval(() => this.simulateRealTimeData(), 2000);
        
        console.log('🚀 پنل بلادرنگ راه‌اندازی شد');
    }

    updateDateTime() {
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            weekday: 'long'
        };
        document.getElementById('currentDateTime').textContent = 
            now.toLocaleDateString('fa-IR', options);
    }

    startAutoRefresh() {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
        }
        
        if (this.refreshInterval > 0) {
            this.refreshTimer = setInterval(() => {
                this.loadRealTimeData();
            }, this.refreshInterval);
        }
    }

    changeRefreshRate() {
        const rate = parseInt(document.getElementById('refreshRate').value);
        this.refreshInterval = rate;
        this.startAutoRefresh();
        
        this.showNotification(`بروزرسانی خودکار به ${rate/1000} ثانیه تنظیم شد`, 'success');
    }

    forceRefresh() {
        this.loadRealTimeData();
        this.showNotification('داده‌ها به صورت دستی بروزرسانی شدند', 'success');
    }

    setupWebSocketSimulation() {
        // شبیه‌سازی اتصال WebSocket
        setInterval(() => {
            const status = Math.random() > 0.1 ? 'متصل' : 'در حال اتصال...';
            document.getElementById('connectionStatus').textContent = status;
            document.getElementById('connectionStatus').style.color = 
                status === 'متصل' ? '#10b981' : '#f59e0b';
        }, 5000);
    }

    async loadRealTimeData() {
        try {
            // نشانگر بارگذاری
            document.getElementById('updateIndicator').style.background = '#f59e0b';
            document.getElementById('lastUpdate').textContent = 'در حال بروزرسانی...';
            
            // شبیه‌سازی دریافت داده‌های بلادرنگ
            const realTimeData = this.generateRealTimeData();
            
            // به‌روزرسانی رابط کاربری
            this.updateDashboard(realTimeData);
            this.updateCharts(realTimeData);
            this.updateActivities(realTimeData);
            this.updateSystemMetrics(realTimeData);
            
            // به‌روزرسانی زمان آخرین بروزرسانی
            document.getElementById('updateIndicator').style.background = '#10b981';
            document.getElementById('lastUpdate').textContent = new Date().toLocaleTimeString('fa-IR');
            
            this.lastData = realTimeData;
            
        } catch (error) {
            console.error('خطا در دریافت داده‌های بلادرنگ:', error);
            this.showNotification('خطا در اتصال به سرور', 'error');
        }
    }

    generateRealTimeData() {
        const now = new Date();
        const baseRevenue = 12500000 + Math.random() * 1000000;
        const baseConversions = 342 + Math.floor(Math.random() * 20);
        const baseUsers = 156 + Math.floor(Math.random() * 10);
        
        return {
            timestamp: now.getTime(),
            revenue: baseRevenue + Math.random() * 50000,
            conversions: baseConversions,
            activeUsers: baseUsers,
            crypto: {
                btc: 0.524 + (Math.random() - 0.5) * 0.01,
                eth: 2.15 + (Math.random() - 0.5) * 0.1,
                usdt: 1250.50 + (Math.random() - 0.5) * 10
            },
            sales: {
                minute: Math.floor(Math.random() * 5000),
                hourly: Math.floor(Math.random() * 50000),
                daily: 1850000 + Math.random() * 100000
            },
            system: {
                cpu: 30 + Math.random() * 40,
                ram: 40 + Math.random() * 30,
                bandwidth: 5 + Math.random() * 10
            },
            trends: {
                revenue: (Math.random() - 0.3) * 5,
                conversions: (Math.random() - 0.2) * 3,
                users: (Math.random() - 0.1) * 2
            }
        };
    }

    simulateRealTimeData() {
        // شبیه‌سازی داده‌های لحظه‌ای
        const newData = this.generateRealTimeData();
        this.updateRealTimeElements(newData);
    }

    updateRealTimeElements(data) {
        // به‌روزرسانی عناصر با انیمیشن
        this.animateValue('minuteSales', data.sales.minute, 0);
        this.animateValue('hourlySales', data.sales.hourly, 0);
        this.animateValue('dailySales', data.sales.daily, 0);
        
        // به‌روزرسانی معیارهای سیستم
        this.animateValue('cpuUsage', Math.round(data.system.cpu) + '%', 0);
        this.animateValue('ramUsage', Math.round(data.system.ram) + '%', 0);
        this.animateValue('bandwidthUsage', Math.round(data.system.bandwidth) + ' MB/s', 0);
        
        // به‌روزرسانی گیج‌ها
        this.updateGauge('cpuGauge', data.system.cpu);
        this.updateGauge('ramGauge', data.system.ram);
        this.updateGauge('bandwidthGauge', data.system.bandwidth);
    }

    animateValue(elementId, newValue, duration = 500) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const oldValue = parseInt(element.textContent.replace(/[^0-9]/g, '')) || 0;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentValue = oldValue + (newValue - oldValue) * progress;
            element.textContent = Math.round(currentValue).toLocaleString('fa-IR') + (elementId.includes('Usage') ? '%' : '');
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    updateGauge(gaugeId, value) {
        const gauge = document.getElementById(gaugeId);
        if (gauge) {
            const percentage = Math.min(Math.max(value, 0), 100);
            gauge.style.width = percentage + '%';
            gauge.style.background = 
                percentage < 50 ? '#10b981' : 
                percentage < 80 ? '#f59e0b' : '#ef4444';
        }
    }

    updateDashboard(data) {
        // به‌روزرسانی کارت‌های اصلی
        document.getElementById('totalRevenue').textContent = 
            Math.round(data.revenue).toLocaleString('fa-IR') + ' تومان';
        document.getElementById('totalConversions').textContent = 
            data.conversions.toLocaleString('fa-IR');
        document.getElementById('cryptoBalance').textContent = 
            data.crypto.btc.toFixed(3) + ' BTC';
        document.getElementById('activeUsers').textContent = 
            data.activeUsers.toLocaleString('fa-IR');
        
        // به‌روزرسانی روندها
        this.updateTrend('revenueTrend', data.trends.revenue);
        this.updateTrend('conversionsTrend', data.trends.conversions);
        this.updateTrend('usersTrend', data.trends.users);
    }

    updateTrend(trendId, value) {
        const trendElement = document.getElementById(trendId);
        if (trendElement) {
            const isPositive = value >= 0;
            trendElement.textContent = (isPositive ? '+' : '') + value.toFixed(1) + '%';
            trendElement.className = `trend ${isPositive ? 'up' : 'down'}`;
        }
    }

    updateCharts(data) {
        this.updateConversionsChart();
        this.updateRevenueChart();
        this.updateCryptoChart();
    }

    updateConversionsChart() {
        const ctx = document.getElementById('conversionsChart').getContext('2d');
        const labels = Array.from({length: 12}, (_, i) => `${i * 5} دقیقه قبل`);
        const conversionData = Array.from({length: 12}, () => Math.floor(Math.random() * 20) + 10);
        
        if (window.conversionsChart) {
            window.conversionsChart.data.labels = labels;
            window.conversionsChart.data.datasets[0].data = conversionData;
            window.conversionsChart.update('none');
        } else {
            window.conversionsChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'تبدیل‌های 3D',
                        data: conversionData,
                        borderColor: '#8b5cf6',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: { duration: 0 },
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
                        y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } }
                    }
                }
            });
        }
    }

    updateRevenueChart() {
        const ctx = document.getElementById('revenueChart').getContext('2d');
        const labels = Array.from({length: 24}, (_, i) => `${i}:00`);
        const revenueData = Array.from({length: 24}, () => Math.floor(Math.random() * 2000) + 500);
        
        if (window.revenueChart) {
            window.revenueChart.data.labels = labels;
            window.revenueChart.data.datasets[0].data = revenueData;
            window.revenueChart.update('none');
        } else {
            window.revenueChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'درآمد (هزار تومان)',
                        data: revenueData,
                        backgroundColor: 'rgba(34, 197, 94, 0.6)',
                        borderColor: '#10b981',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: { duration: 0 },
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
                        y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } }
                    }
                }
            });
        }
    }

    updateCryptoChart() {
        const ctx = document.getElementById('btcChart').getContext('2d');
        const labels = Array.from({length: 20}, (_, i) => `-${19-i}م`);
        const btcData = Array.from({length: 20}, (_, i) => 50000 + Math.random() * 5000 - 2500);
        
        if (window.btcChart) {
            window.btcChart.data.labels = labels;
            window.btcChart.data.datasets[0].data = btcData;
            window.btcChart.update('none');
        } else {
            window.btcChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'قیمت BTC',
                        data: btcData,
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: { duration: 0 },
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
                        y: { 
                            grid: { color: '#334155' }, 
                            ticks: { 
                                color: '#94a3b8',
                                callback: function(value) { return '$' + value.toLocaleString(); }
                            } 
                        }
                    }
                }
            });
        }
    }

    updateActivities(data) {
        const activities = [
            { time: 'هم اکنون', text: 'تبدیل 3D جدید توسط کاربر #' + (1000 + Math.floor(Math.random() * 100)), type: 'conversion' },
            { time: '۱ دقیقه قبل', text: 'پرداخت موفق به مبلغ ' + Math.floor(Math.random() * 100000).toLocaleString('fa-IR') + ' تومان', type: 'payment' },
            { time: '۲ دقیقه قبل', text: 'کاربر جدید ثبت‌نام کرد', type: 'user' },
            { time: '۳ دقیقه قبل', text: 'تبدیل 3D تکمیل شد', type: 'conversion' }
        ];
        
        const activityHTML = activities.map(activity => `
            <div class="activity-item">
                <span class="activity-time">${activity.time}</span>
                <span>${activity.text}</span>
            </div>
        `).join('');
        
        document.getElementById('activityFeed').innerHTML = activityHTML;
    }

    updateSystemMetrics(data) {
        // به‌روزرسانی معیارهای سیستم در بخش مربوطه
        if (this.currentSection === 'system') {
            this.animateValue('cpuUsage', Math.round(data.system.cpu) + '%', 0);
            this.animateValue('ramUsage', Math.round(data.system.ram) + '%', 0);
            this.animateValue('bandwidthUsage', Math.round(data.system.bandwidth) + ' MB/s', 0);
        }
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
        
        // بارگذاری داده‌های مربوط به بخش
        this.loadRealTimeData();
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

// توابع全局
function showSection(sectionName) {
    window.realTimePanel.showSection(sectionName);
}

function changeRefreshRate() {
    window.realTimePanel.changeRefreshRate();
}

function forceRefresh() {
    window.realTimePanel.forceRefresh();
}

// راه‌اندازی پنل بلادرنگ
document.addEventListener('DOMContentLoaded', function() {
    window.realTimePanel = new RealTimeAdminPanel();
});
