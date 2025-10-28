// functions/utils/env.js
export function getEnv(context) {
  return {
    // تنظیمات برنامه
    appName: context.env.APP_NAME || '3D Conversion App',
    debug: context.env.DEBUG_MODE === 'true',
    logLevel: context.env.LOG_LEVEL || 'info',
    
    // تنظیمات 3D
    maxFileSize: parseInt(context.env.MAX_FILE_SIZE) || 10485760, // 10MB
    maxConversionTime: parseInt(context.env.MAX_CONVERSION_TIME) || 300,
    supportedFormats: (context.env.SUPPORTED_FORMATS || 'gltf,obj,stl').split(','),
    
    // امنیت
    jwtSecret: context.env.JWT_SECRET,
    corsOrigin: context.env.CORS_ORIGIN || '*',
    
    // پرداخت
    stripeSecret: context.env.STRIPE_SECRET_KEY,
    stripeWebhook: context.env.STRIPE_WEBHOOK_SECRET,
    
    // ذخیره‌سازی
    uploadDir: context.env.UPLOAD_DIR || '/tmp/uploads',
    backupEnabled: context.env.BACKUP_ENABLED === 'true'
  };
}

export function validateEnv(env) {
  const required = ['JWT_SECRET', 'STRIPE_SECRET_KEY'];
  const missing = required.filter(key => !env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  return true;
}
