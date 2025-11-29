#!/bin/bash

echo "🚀 Starting Advanced Deployment Process..."
echo "==========================================="

# Clean installation
echo "🧹 Cleaning previous installations..."
rm -rf node_modules package-lock.json

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Test locally first
echo "🔍 Testing server locally..."
timeout 30s node --expose-gc index.js &
SERVER_PID=$!
sleep 5

# Health check
echo "❤️  Performing health check..."
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Local health check PASSED"
    kill $SERVER_PID 2>/dev/null
else
    echo "❌ Local health check FAILED"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod --confirm

echo "==========================================="
echo "✅ Deployment completed successfully!"
echo "🔍 Check logs: vercel logs"
echo "❤️  Health URL: https://your-app.vercel.app/health"
