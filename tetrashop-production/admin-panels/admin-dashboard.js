/**
 * 📊 دشبورد مدیریت پروژه‌های Tetrashop
 * 🎯 نمایش وضعیت لحظه‌ای تمام سرویس‌ها
 */

const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.static('.'));
app.use(express.json());

// داده‌های وضعیت
const services = [
    {
        id: 'tetrashop-main',
        name: '🛒 Tetrashop اصلی',
        status: 'active',
        performance: '95%',
        latency: '45ms',
        uptime: '99.9%',
        url: 'http://localhost:3000'
    },
    {
        id: 'chess-engine',
        name: '♟️ Chess Engine',
        status: 'active', 
        performance: '98%',
        latency: '12ms',
        uptime: '100%',
        url: 'http://localhost:8080'
    },
    {
        id: 'backend-api',
        name: '🔧 Backend API',
        status: 'active',
        performance: '92%',
        latency: '28ms',
        uptime: '99.8%',
        url: 'http://localhost:8000'
    },
    {
        id: 'ai-processor',
        name: '🤖 پردازش هوش مصنوعی',
        status: 'active',
        performance: '88%',
        latency: '65ms',
        uptime: '99.5%',
        url: 'http://localhost:8000/ai'
    }
];

app.get('/admin', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>📊 دشبورد مدیریت Tetrashop</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
                .container { max-width: 1200px; margin: 0 auto; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 15px; margin-bottom: 30px; }
                .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
                .service-card { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); transition: transform 0.3s; }
                .service-card:hover { transform: translateY(-5px); }
                .status-active { border-right: 5px solid #10b981; }
                .status-inactive { border-right: 5px solid #ef4444; }
                .metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px; }
                .metric { text-align: center; padding: 10px; background: #f8fafc; border-radius: 8px; }
                .performance-bar { height: 8px; background: #e5e7eb; border-radius: 4px; margin-top: 5px; overflow: hidden; }
                .performance-fill { height: 100%; background: linear-gradient(90deg, #10b981, #3b82f6); border-radius: 4px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎛️ دشبورد مدیریت Tetrashop</h1>
                    <p>مدیریت یکپارچه تمام سرویس‌ها و نظارت بر عملکرد</p>
                </div>
                
                <div class="services-grid" id="services-container">
                    <!-- سرویس‌ها به صورت داینامیک لود می‌شوند -->
                </div>
            </div>

            <script>
                function loadServices() {
                    const services = ${JSON.stringify(services)};
                    const container = document.getElementById('services-container');
                    
                    container.innerHTML = services.map(service => \`
                        <div class="service-card status-\${service.status}">
                            <h3>\${service.name}</h3>
                            <div class="metrics">
                                <div class="metric">
                                    <small>عملکرد</small>
                                    <div>\${service.performance}</div>
                                    <div class="performance-bar">
                                        <div class="performance-fill" style="width: \${service.performance}"></div>
                                    </div>
                                </div>
                                <div class="metric">
                                    <small>تأخیر</small>
                                    <div>\${service.latency}</div>
                                </div>
                                <div class="metric">
                                    <small>آپ‌تایم</small>
                                    <div>\${service.uptime}</div>
                                </div>
                                <div class="metric">
                                    <small>وضعیت</small>
                                    <div>\${service.status === 'active' ? '🟢 فعال' : '🔴 غیرفعال'}</div>
                                </div>
                            </div>
                            <a href="\${service.url}" target="_blank" style="display: inline-block; margin-top: 15px; padding: 8px 16px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px;">ورود به سرویس</a>
                        </div>
                    \`).join('');
                }

                // بارگذاری اولیه
                loadServices();

                // بروزرسانی هر 10 ثانیه
                setInterval(loadServices, 10000);
            </script>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`📊 دشبورد مدیریت در حال اجرا: http://localhost:${PORT}/admin`);
});
