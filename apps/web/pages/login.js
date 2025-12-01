import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // ذخیره توکن در localStorage یا cookie
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // هدایت به داشبورد
        router.push('/dashboard');
      } else {
        setError(data.message || 'ورود ناموفق بود');
      }
    } catch (err) {
      setError('خطا در ارتباط با سرور');
    }
  };

  return (
    <div dir="rtl" style={styles.container}>
      <div style={styles.loginBox}>
        <h2 style={styles.title}>🔐 ورود به سیستم تبدیل 3D</h2>
        
        {error && (
          <div style={styles.error}>
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>ایمیل:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="example@email.com"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>رمز عبور:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.button}>
            🚀 ورود به سیستم
          </button>
        </form>

        <div style={styles.testAccounts}>
          <h4>👥 حساب‌های تست:</h4>
          <p><strong>حساب ۱:</strong> admin@tetrashop.com / admin123</p>
          <p><strong>حساب ۲:</strong> user@tetrashop.com / user123</p>
          <p><strong>حساب ۳:</strong> support@tetrashop.com / support123</p>
        </div>

        <div style={styles.note}>
          💡 اگر حساب کاربری ندارید، از ایمیل‌های تست بالا استفاده کنید
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    fontFamily: 'Tahoma, Arial, sans-serif',
  },
  loginBox: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    padding: '40px',
    borderRadius: '15px',
    width: '100%',
    maxWidth: '400px',
    color: 'white',
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '15px',
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
  },
  error: {
    background: 'rgba(255, 107, 107, 0.2)',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '20px',
    borderRight: '4px solid #ff6b6b',
  },
  testAccounts: {
    marginTop: '30px',
    background: 'rgba(255, 255, 255, 0.15)',
    padding: '20px',
    borderRadius: '10px',
    fontSize: '14px',
  },
  note: {
    marginTop: '20px',
    textAlign: 'center',
    fontSize: '14px',
    opacity: '0.8',
  },
};
