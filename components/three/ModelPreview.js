import { useState, useEffect } from 'react';

export default function ModelPreview({ file, previewUrl }) {
  const [error, setError] = useState(false);
  
  useEffect(() => {
    // در اینجا می‌توانیم Three.js را لود کنیم
    // فعلاً یک تصویر جایگزین نشان می‌دهیم
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: '#e74c3c' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
        <p>خطا در بارگذاری مدل</p>
        <p style={{ fontSize: '14px', marginTop: '10px' }}>
          پیش‌نمایش این فرمت در مرورگر پشتیبانی نمی‌شود
        </p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* جایگزین برای Three.js - بعداً کامل می‌شود */}
      <div style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
        padding: '20px'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎭</div>
        <h3 style={{ marginBottom: '10px' }}>مدل ۳D آپلود شده</h3>
        <p style={{ opacity: 0.9, marginBottom: '15px' }}>
          {file?.name || 'فایل ناشناس'}
        </p>
        <div style={{
          background: 'rgba(255,255,255,0.2)',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '14px',
          marginTop: '10px'
        }}>
          {file?.name.split('.').pop().toUpperCase() || '۳D'}
        </div>
        
        {/* کنترل‌های مجازی */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          display: 'flex',
          gap: '10px',
          background: 'rgba(0,0,0,0.5)',
          padding: '10px',
          borderRadius: '8px'
        }}>
          <button style={{
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: 'none',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '20px'
          }}>
            ↻
          </button>
          <button style={{
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: 'none',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '20px'
          }}>
            ⚡
          </button>
          <button style={{
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: 'none',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '20px'
          }}>
            🔍
          </button>
        </div>
      </div>
      
      {/* اطلاعات فنی */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '8px',
        fontSize: '12px'
      }}>
        <div>حجم: {(file?.size / 1024 / 1024).toFixed(2)} MB</div>
        <div>نوع: {file?.type || '۳D Model'}</div>
      </div>
    </div>
  );
}
