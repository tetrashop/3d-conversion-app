#!/bin/bash

echo "🔧 ایجاد فایل .env به صورت خودکار..."

# ایجاد پوشه‌های لازم
mkdir -p logs data uploads

# تولید کلیدهای امنیتی تصادفی
JWT_SECRET="3d_app_jwt_$(openssl rand -hex 32)"
SESSION_SECRET="3d_app_session_$(openssl rand -hex 16)"
DB_ENCRYPTION_KEY="db_key_$(openssl rand -base64 32)"

# ایجاد فایل .env
cat > .env << ENVFILE
# =============================================
# 🚀 تنظیمات محیطی پروژه 3D Conversion App
# =============================================

# 📍 مسیرهای پروژه
PROJECT_ROOT=/data/data/com.termux/files/home/3d-conversion-app
LOG_DIR=/data/data/com.termux/files/home/3d-conversion-app/logs
DATA_DIR=/data/data/com.termux/files/home/3d-conversion-app/data
UPLOAD_DIR=/data/data/com.termux/files/home/3d-conversion-app/uploads

# 🔐 امنیت و احراز هویت
JWT_SECRET=${JWT_SECRET}
SESSION_SECRET=${SESSION_SECRET}
BCRYPT_ROUNDS=12
TOKEN_EXPIRY=24h

# 🌐 تنظیمات سرور
PORT=3000
HOST=0.0.0.0
NODE_ENV=development
CORS_ORIGIN=*

# 💰 API Keys صرافی‌ها
NOBITEX_API_KEY=DEMO_KEY_NOBITEX
NOBITEX_API_SECRET=DEMO_SECRET_NOBITEX
WALLEX_API_KEY=DEMO_KEY_WALLEX  
WALLEX_API_SECRET=DEMO_SECRET_WALLEX
BINANCE_API_KEY=DEMO_KEY_BINANCE
BINANCE_API_SECRET=DEMO_SECRET_BINANCE

# 📊 تنظیمات پایگاه داده
DB_PATH=/data/data/com.termux/files/home/3d-conversion-app/data/database.sqlite
DB_ENCRYPTION_KEY=${DB_ENCRYPTION_KEY}

# 🔧 تنظیمات برنامه
MAX_FILE_SIZE=50MB
UPLOAD_LIMIT=10
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# 📡 تنظیمات API خارجی
COINGECKO_API_URL=https://api.coingecko.com/api/v3
BINANCE_API_URL=https://api.binance.com
NOBITEX_API_URL=https://api.nobitex.ir
WALLEX_API_URL=https://api.wallex.ir

# 🎯 تنظیمات تبدیل 3D
CONVERSION_TIMEOUT=300000
MAX_CONVERSION_SIZE=100MB
SUPPORTED_FORMATS=glb,obj,stl,fbx,3ds

# 📝 لاگ‌گیری
LOG_LEVEL=info
LOG_FILE=/data/data/com.termux/files/home/3d-conversion-app/logs/app.log
ERROR_LOG_FILE=/data/data/com.termux/files/home/3d-conversion-app/logs/error.log

# 🔍 دیباگ
DEBUG=false
VERBOSE_LOGGING=false
ENVFILE

echo "✅ فایل .env با موفقیت ایجاد شد!"
echo "📁 مسیر: /data/data/com.termux/files/home/3d-conversion-app/.env"
echo ""
echo "🔐 کلیدهای امنیتی تولید شد:"
echo "   JWT Secret: ${JWT_SECRET:0:20}..."
echo "   Session Secret: ${SESSION_SECRET:0:20}..."
echo ""
echo "📋下一步: حالا می‌توانید سیستم را اجرا کنید"
