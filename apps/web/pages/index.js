import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('token');
      console.log('1️⃣ توکن از localStorage:', token ? token.substring(0, 20) + '...' : 'null');
      setDebugInfo(prev => prev + '\\n1. توکن: ' + (token ? 'موجود' : 'مفقود'));
      
      if (!token) {
        setDebugInfo(prev => prev + '\\n❌ توکن وجود ندارد، هدایت به لاگین');
        router.push('/login');
        return;
      }

      try {
        console.log('2️⃣ در حال ارسال درخواست verify...');
        setDebugInfo(prev => prev + '\\n2. ارسال درخواست verify');
        
        const res = await fetch('/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('3️⃣ وضعیت پاسخ:', res.status);
        setDebugInfo(prev => prev + \`\\n3. وضعیت پاسخ: \${res.status}\`);
        
        const data = await res.json();
        console.log('4️⃣ پاسخ کامل verify:', data);
        setDebugInfo(prev => prev + \`\\n4. پاسخ: \${JSON.stringify(data)}\`);
        
        if (!res.ok) {
          throw new Error(data.message || \`خطای \${res.status}\`);
        }
        
        if (data.user) {
          console.log('✅ کاربر دریافت شد:', data.user);
          setDebugInfo(prev => prev + \`\\n✅ کاربر: \${data.user.email}\`);
          setUser(data.user);
        } else {
          throw new Error('ساختار پاسخ نادرست است');
        }
        
      } catch (err) {
        console.error('❌ خطا در verify:', err);
        setDebugInfo(prev => prev + \`\\n❌ خطا: \${err.message}\`);
        setError(err.message);
        localStorage.removeItem('token');
        setTimeout(() => router.push('/login'), 2000);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [router]);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>در حال بارگذاری...</h2>
        <p>لطفاً صبر کنید</p>
        <pre style={{ textAlign: 'left', background: '#f5f5f5', padding: '10px', fontSize: '12px' }}>
          {debugInfo}
        </pre>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: 'green' }}>✅ خوش آمدید!</h1>
      <p style={{ fontSize: '18px' }}>شما با موفقیت وارد شدید.</p>
      
      <div style={{ 
        background: '#e8f5e9', 
        padding: '20px', 
        borderRadius: '8px',
        marginTop: '20px',
        border: '1px solid #c8e6c9'
      }}>
        <h2>👤 اطلاعات حساب کاربری</h2>
        
        {user ? (
          <div style={{ marginTop: '15px' }}>
            <p><strong>ایمیل:</strong> {user.email || 'admin@tetrashop.com'}</p>
            <p><strong>نقش:</strong> {user.role || 'admin'}</p>
            <p><strong>شناسه کاربری:</strong> {user.userId || '12345'}</p>
            {user.name && <p><strong>نام:</strong> {user.name}</p>}
          </div>
        ) : (
          <div style={{ color: '#f44336', marginTop: '15px' }}>
            <p>⚠️ اطلاعات کاربر بارگذاری نشد</p>
            {error && <p>خطا: {error}</p>}
          </div>
        )}
      </div>
      
      <div style={{ 
        marginTop: '30px', 
        padding: '15px', 
        background: '#f5f5f5', 
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <h3>🔧 اطلاعات دیباگ:</h3>
        <pre style={{ 
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          maxHeight: '200px',
          overflow: 'auto'
        }}>
          {debugInfo}
        </pre>
        <button 
          onClick={() => {
            console.clear();
            setDebugInfo('');
            window.location.reload();
          }}
          style={{ marginTop: '10px', padding: '5px 10px' }}
        >
          پاک کردن لاگ‌ها
        </button>
      </div>
      
      <button 
        onClick={() => {
          localStorage.removeItem('token');
          router.push('/login');
        }}
        style={{
          padding: '12px 24px',
          background: '#ff4444',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: 'pointer',
          marginTop: '30px'
        }}
      >
        خروج از سیستم
      </button>
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p>💡 برای مشاهده لاگ‌های کامل: F12 → Console</p>
        <p>📋 لاگ‌های Vercel را برای خطاهای API verify بررسی کنید</p>
      </div>
    </div>
  );
}
