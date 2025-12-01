import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('🔍 توکن در localStorage:', token ? token.substring(0, 20) + '...' : 'null');
    
    if (!token) {
      console.log('⚠️ توکن وجود ندارد، هدایت به صفحه لاگین');
      router.push('/login');
      return;
    }

    const verifyToken = async () => {
      try {
        console.log('🔐 در حال بررسی توکن با سرور...');
        const res = await fetch('/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('📡 وضعیت پاسخ تأیید توکن:', res.status);
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || `خطا در تأیید توکن با کد ${res.status}`);
        }
        
        const userData = await res.json();
        console.log('✅ داده کاربر دریافت شد:', userData);
        setUser(userData);
        setError(null);
      } catch (err) {
        console.error('❌ خطا در تأیید توکن:', err);
        setError(err.message);
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [router]);

  if (loading) {
    return <div style={{ padding: '20px' }}>در حال بارگذاری...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h2>خطا</h2>
        <p>{error}</p>
        <button onClick={() => router.push('/login')}>بازگشت به صفحه ورود</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>خوش آمدید!</h1>
      <p>شما با موفقیت وارد شدید.</p>
      {user && (
        <div>
          <p>ایمیل: {user.email}</p>
          <p>نقش: {user.role}</p>
        </div>
      )}
      <button onClick={() => {
        localStorage.removeItem('token');
        router.push('/login');
      }}>خروج از سیستم</button>
    </div>
  );
}
