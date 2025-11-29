#!/bin/bash

echo "🚀 Deploying Self-Healing Server..."
echo "======================================"

# پاکسازی و نصب
rm -rf node_modules package-lock.json
npm install

# تست سلامت محلی
echo "🔍 Testing server locally..."
timeout 10s node index.js &
SERVER_PID=$!
sleep 3

if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Local health check PASSED"
    kill $SERVER_PID 2>/dev/null
else
    echo "❌ Local health check FAILED"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

# استقرار
echo "🌐 Deploying to Vercel..."
vercel --prod --yes

echo "======================================"
echo "✅ Deployment completed!"
echo "🔍 Check: https://your-app.vercel.app/health"
