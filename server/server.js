const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..'))); // سرو فایل‌های استاتیک

// routes
app.use('/api', require('./api'));

// route اصلی برای تست
app.get('/', (req, res) => {
    res.json({
        message: '🚀 سرور سرویس تبدیل 3D راه‌اندازی شد',
        version: '1.0.0',
        endpoints: {
            stats: '/api/stats',
            transactions: '/api/transactions',
            withdrawals: '/api/withdrawals'
        }
    });
});

// route برای سرو فایل‌های ادمین
app.get('/admin/*', (req, res) => {
    const filePath = path.join(__dirname, '..', req.path);
    res.sendFile(filePath);
});

// route fallback برای SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// هندل خطا
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        error: 'خطای سرور داخلی'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 سرور اصلی راه‌اندازی شد: http://localhost:${PORT}`);
    console.log(`📊 پنل مدیریت: http://localhost:${PORT}/admin/live-management-panel.html`);
    console.log(`🔗 API در دسترس: http://localhost:${PORT}/api/stats`);
});
