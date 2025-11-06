#!/bin/bash
echo "🚀 راه‌اندازی سامانه یکپارچه 3D Conversion + Crypto Management"

# پاکسازی
pkill -f "python3" 2>/dev/null
pkill -f "node" 2>/dev/null

# راه‌اندازی سرور اصلی
cd ~/tetrashop-consolidated/tetrashop-projects/3d-conversion-app
echo "🔧 بررسی فایل‌های سرور..."

# پیدا کردن فایل سرور اصلی
SERVER_FILES=$(find . -name "server.*" -o -name "main.*" -o -name "app.*" -o -name "index.*" | grep -v node_modules | head -5)

for file in $SERVER_FILES; do
    echo "📄 فایل شناسایی شده: $file"
    ext="${file##*.}"
    
    case $ext in
        "js"|"cjs"|"mjs")
            echo "🟢 راه‌اندازی با Node.js: $file"
            node "$file" --port 3000 &
            ;;
        "py")
            echo "🐍 راه‌اندازی با Python: $file"
            python3 "$file" --port 3000 &
            ;;
        "html")
            echo "🌐 راه‌اندازی سرور HTTP: $file"
            cd "$(dirname "$file")"
            python3 -m http.server 3000 &
            cd - > /dev/null
            ;;
    esac
    sleep 2
done

# تست سامانه
sleep 3
echo "🔍 تست سلامت سامانه..."
curl -s http://localhost:3000 && echo "✅ سرور اصلی فعال" || echo "❌ سرور اصلی غیرفعال"

# نمایش اطلاعات
echo ""
echo "=================================================="
echo "🎯 سامانه یکپارچه 3D Conversion + Crypto"
echo "🌐 آدرس: http://localhost:3000"
echo "💰 پنل مدیریت رمزارز: در حال راه‌اندازی..."
echo "🔄 تبدیل 3D: فعال"
echo "📊 وضعیت: در حال اجرا"
echo "=================================================="
