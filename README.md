# 3D Conversion App - نسخه تجاری

سیستم کامل تبدیل تصاویر 2D به مدل‌های 3D با قابلیت‌های تجاری

## 🚀 ویژگی‌ها

### فنی
- تبدیل پیشرفته 2D به 3D
- پشتیبانی از فرمت‌های STL, OBJ, GLB
- پردازش ابری با Cloudflare Workers

### تجاری  
- سیستم پرداخت رمزارز (BTC, ETH, USDT)
- پلن‌های قیمت‌گذاری tiered
- مدیریت کاربران و سهمیه

### امنیتی
- احراز هویت پیشرفته
- رمزنگاری end-to-end
- مانیتورینگ real-time

## 📦 ساختار پروژه

\`\`\`
packages/
├── conversion-core/     # هسته تبدیل
├── conversion-api/      # سرویس API
├── payment-system/      # سیستم پرداخت
└── business-model/      # مدل کسب‌وکار
\`\`\`

## 🎯 راه‌اندازی

\`\`\`bash
npm install
npm run deploy
\`\`\`
