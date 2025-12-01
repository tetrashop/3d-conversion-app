import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('admin@tetrashop.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState('checking...');
  const router = useRouter();

  // تست وضعیت API هنگام بارگذاری صفحه
  useEffect(() => {
    checkAPIStatus();
  }, []);

  const checkAPIStatus = async () => {
    try {
      const response = await fetch('/api/simple-test');
      if (response.ok) {
        setApiStatus('✅ فعال');
      } else {
        setApiStatus('❌ غیرفعال');
      }
    } catch (err) {
      setApiStatus('❌ خطا در ارتباط');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Sending login request to /api/auth/login');
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('API Response:', data);

      if (data.success) {
        // ذخیره در localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('token', data.token);
        }
        
        // هدایت به داشبورد
        router.push('/dashboard');
      } else {
        setError(data.message || 'ورود ناموفق بود');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('خطا در اتصال به سرور API');
    } finally {
      setLoading(false);
    }
  };

  const testAPI = async () => {
    try {
      const response = await fetch('/api/simple-test');
      const data = await response.json();
      alert(`API Test Result:\n${JSON.stringify(data, null, 2)}`);
    } catch (err) {
      alert(`API Test Failed: ${err.message}`);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <div style={styles.header}>
          <h1>🔄 سیستم تبدیل 3D</h1>
          <div style={styles.status}>
            <span>وضعیت API: </span>
            <span style={apiStatus.includes('✅') ? styles.statusGood : styles.statusBad}>
              {apiStatus}
            </span>
          </div>
        </div>

        {error && (
          <div style={styles.error}>
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>ایمیل</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
              disabled={loading}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>رمز عبور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            style={styles.button}
            disabled={loading || apiStatus.includes('❌')}
          >
            {loading ? '⏳ در حال ورود...' : '🚀 ورود به سیستم'}
          </button>
        </form>

        <div style={styles.actions}>
          <button onClick={testAPI} style={styles.testButton}>
            🧪 تست API
          </button>
          <button onClick={checkAPIStatus} style={styles.refreshButton}>
            🔄 بررسی وضعیت
          </button>
        </div>

        <div style={styles.instructions}>
          <h3>📋 راهنمای عیب‌یابی:</h3>
          <ol>
            <li>اگر API غیرفعال است، منتظر دیپلوی کامل باشید</li>
            <li>کش مرورگر را پاک کنید (Ctrl+Shift+R)</li>
            <li>صفحه را مجدداً بارگذاری کنید</li>
            <li>از حالت ناشناس مرورگر استفاده کنید</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: 'Tahoma, Arial, sans-serif',
  },
  loginBox: {
    background: 'white',
    borderRadius: '20px',
    padding: '40px',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 15px 50px rgba(0,0,0,0.2)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  status: {
    marginTop: '10px',
    fontSize: '14px',
  },
  statusGood: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  statusBad: {
    color: '#f44336',
    fontWeight: 'bold',
  },
  form: {
    marginBottom: '20px',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '2px solid #ddd',
    borderRadius: '8px',
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
  },
  testButton: {
    padding: '10px 20px',
    background: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  refreshButton: {
    padding: '10px 20px',
    background: '#FF9800',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  error: {
    background: '#ffebee',
    color: '#c62828',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  instructions: {
    marginTop: '20px',
    padding: '20px',
    background: '#f5f5f5',
    borderRadius: '10px',
    fontSize: '14px',
  },
};
