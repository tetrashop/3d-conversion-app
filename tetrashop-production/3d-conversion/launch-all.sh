#!/bin/bash
echo "🚀 راه‌اندازی کامل سیستم Tetrashop یکپارچه"

cd ~/tetrashop-consolidated/organized-projects

# توقف سرویس‌های قبلی
pkill -f "python3" 2>/dev/null
pkill -f "node" 2>/dev/null
sleep 2

# راه‌اندازی تمام کامپوننت‌ها
echo "🔧 راه‌اندازی تمام کامپوننت‌ها..."

# 1. پنل مدیریت رمزارز
cd payment-systems
echo "💰 پنل مدیریت رمزارز: http://localhost:3001/crypto-management.html"
python3 -m http.server 3001 &
cd ..

# 2. اپ‌های وب
cd web-apps
echo "🌐 اپ‌های وب: http://localhost:3003"
python3 -m http.server 3003 &
cd ..

# 3. 3D Conversion (ساده‌شده)
cd 3d-conversion
if [ -f "server.py" ]; then
    echo "🎯 3D Conversion: http://localhost:3000"
    python3 server.py &
else
    echo "🎯 3D Conversion (ساده): http://localhost:3000"
    python3 -m http.server 3000 &
fi
cd ..

sleep 3

# نمایش وضعیت نهایی
echo ""
echo "=================================================="
echo "🎯 سیستم Tetrashop یکپارچه راه‌اندازی شد"
echo "=================================================="
echo "💰 پنل مدیریت رمزارز: http://localhost:3001/crypto-management.html"
echo "🌐 اپ‌های وب: http://localhost:3003"
echo "🎯 3D Conversion: http://localhost:3000"
echo "📊 پنل‌های مدیریت: http://localhost:3000/admin/"
echo "=================================================="
echo ""
echo "📱 برای دسترسی از مرورگر استفاده کنید:"
echo "   - مدیریت رمزارز: مرورگر → آدرس بالا"
echo "   - تبدیل 3D: مرورگر → http://localhost:3000"
echo "   - فروشگاه: مرورگر → http://localhost:3003"
