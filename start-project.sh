#!/data/data/com.termux/files/usr/bin/bash

echo "🚀 راه‌اندازی پروژه تتراشاپ"
echo "============================"

cd ~/apps/web

# تنظیمات محیط
export NODE_OPTIONS="--max-old-space-size=256"

# حذف کش‌های قبلی
rm -rf .next 2>/dev/null

# شروع سرور با تنظیمات بهینه
echo "🔧 در حال شروع سرور..."
next dev --port 3000 --hostname 0.0.0.0
