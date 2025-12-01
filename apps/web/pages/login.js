import { useState } from 'react';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('📤 Sending login request:', formData);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password
        }),
      });

      const data = await res.json();
      console.log('📥 Server response:', data);

      if (!res.ok) {
        throw new Error(data.message || `Login failed with status ${res.status}`);
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
        console.log('✅ Token saved to localStorage');
        
        // ریدایرکت با تاخیر برای مشاهده لاگ‌ها
        setTimeout(() => {
          router.push('/');
        }, 1000);
      }
      
    } catch (err) {
      console.error('❌ Login error:', err);
      setError(err.message);
      
      // نمایش جزئیات خطا در صورت وجود
      if (err.message.includes('debug')) {
        try {
          const errorData = JSON.parse(err.message);
          setError(`خطا: ${errorData.message} - جزئیات: ${JSON.stringify(errorData.debug)}`);
        } catch {
          setError(err.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h1 style={{ textAlign: 'center' }}>ورود به سیستم</h1>
      
      {error && (
        <div style={{ 
          background: '#ffebee', 
          color: '#c62828', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          <strong>خطا:</strong> {error}
          <div style={{ marginTop: '5px', fontSize: '12px' }}>
            ایمیل: admin@tetrashop.com | رمزهای تست: admin123, admin, password, 123456
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>ایمیل:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="admin@tetrashop.com"
            required
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>رمز عبور:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="رمز عبور"
            required
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
          />
          <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
            رمزهای تست: admin123, admin, password, 123456
          </div>
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '12px',
            background: loading ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'در حال ورود...' : 'ورود'}
        </button>
      </form>
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666', textAlign: 'center' }}>
        <div>برای دیباگ: F12 → Console</div>
        <div>پس از لاگین، به Vercel Logs مراجعه کنید</div>
      </div>
    </div>
  );
}
