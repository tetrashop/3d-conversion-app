import { useState } from 'react';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('در حال ارسال درخواست لاگین برای:', email);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log('پاسخ سرور:', JSON.stringify(data, null, 2));

      if (!res.ok) {
        throw new Error(data.message || `خطا در ورود با کد ${res.status}`);
      }

      // ذخیره توکن در localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
        console.log('توکن در localStorage ذخیره شد.');
      } else {
        console.warn('هشدار: توکنی در پاسخ سرور دریافت نشد.');
      }

      // ریدایرکت به صفحه اصلی
      console.log('در حال هدایت به صفحه اصلی...');
      await router.push('/');
      
    } catch (err) {
      console.error('خطا در فرآیند لاگین:', err);
      setError(err.message);
      alert('خطا در لاگین: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>ورود به سیستم</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>ایمیل:</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ marginBottom: '10px', padding: '5px' }}
          />
        </div>
        <div>
          <label>رمز عبور:</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ marginBottom: '10px', padding: '5px' }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ padding: '10px 20px' }}>
          {loading ? 'در حال ورود...' : 'ورود'}
        </button>
      </form>
    </div>
  );
}
