#!/bin/bash

echo "🚀 شروع فرآیند استقرار..."

# حذف node_modules برای شروع تمیز
rm -rf node_modules package-lock.json

# نصب وابستگی‌ها
echo "📦 نصب وابستگی‌ها..."
npm install

# ساخت پروژه
echo "🔨 ساخت پروژه..."
npm run build

# استقرار روی Vercel
echo "🌐 استقرار روی Vercel..."
vercel --prod

echo "✅ فرآیند استقرار کامل شد!"
echo "🔍 برای بررسی لاگ‌ها: vercel logs"
