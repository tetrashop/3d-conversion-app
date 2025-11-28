#!/bin/bash
echo "🚀 راه‌اندازی سرویس‌های تبدیل 2D به 3D..."

# بررسی وابستگی‌ها
if ! command -v node &> /dev/null; then
    echo "❌ Node.js یافت نشد"
    exit 1
fi

if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 یافت نشد"
    exit 1
fi

# ایجاد پوشه‌های لازم
mkdir -p logs processing queue uploads

# راه‌اندازی سرویس‌ها
echo "📦 راه‌اندازی سرویس اصلی..."
node server.cjs > logs/server.log 2>&1 &

echo "🤖 راه‌اندازی پردازشگر AI..."
python3 ai-processor.py > logs/ai.log 2>&1 &

echo "📊 راه‌اندازی مدیریت صف..."
node queue-manager.cjs > logs/queue.log 2>&1 &

echo "✅ تمام سرویس‌ها راه‌اندازی شدند"
echo "📝 لاگ‌ها در پوشه logs/ در دسترس هستند"
