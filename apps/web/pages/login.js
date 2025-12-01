import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('admin@tetrashop.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('🚀 Sending login request...');
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('📨 Response status:', response.status);
      
      // Check if response is OK
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📦 Response data:', data);

      if (data.success) {
        // Store in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('token', data.token);
          localStorage.setItem('login_time', new Date().toISOString());
        }
        
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        setError(data.message || 'ورود ناموفق بود');
      }
    } catch (err) {
      console.error('❌ Login error details:', err);
      
      // Better error messages
      if (err.message.includes('Failed to fetch')) {
        setError('خطا در اتصال به سرور. لطفاً اینترنت خود را بررسی کنید.');
      } else if (err.message.includes('HTTP error')) {
        setError(`خطای سرور (${err.message}). لطفاً بعداً تلاش کنید.`);
      } else {
        setError('خطای ناشناخته. لطفاً دوباره تلاش کنید.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <h1 style={styles.title}>🔐 ورود به سیستم 3D</h1>
        
        {error && (
          <div style={styles.error}>
            <strong>❌ خطا:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>ایمیل</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ایمیل خود را وارد کنید"
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
              placeholder="رمز عبور"
              style={styles.input}
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            style={styles.button}
            disabled={loading}
          >
            {loading ? '⏳ در حال ورود...' : '🚀 ورود'}
          </button>
        </form>

        <div style={styles.testSection}>
          <h4>🧪 حساب‌های تست:</h4>
          <div style={styles.accounts}>
            <div style={styles.account}>
              <strong>admin@tetrashop.com</strong><br/>
              <code>admin123</code>
            </div>
            <div style={styles.account}>
              <strong>user@tetrashop.com</strong><br/>
              <code>user123</code>
            </div>
          </div>
        </div>

        <div style={styles.debug}>
          <button 
            onClick={() => {
              fetch('/api/test')
                .then(r => r.json())
                .then(d => alert(JSON.stringify(d, null, 2)))
                .catch(e => alert('Error: ' + e.message));
            }}
            style={styles.testButton}
          >
            تست اتصال API
          </button>
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
    fontFamily: 'Tahoma, sans-serif',
  },
  loginBox: {
    background: 'white',
    borderRadius: '15px',
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#333',
  },
  form: {
    marginBottom: '30px',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#555',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    fontSize: '16px',
    boxSizing: 'border-box',
    transition: 'border 0.3s',
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
    transition: 'background 0.3s',
  },
  error: {
    background: '#ffebee',
    color: '#c62828',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    borderLeft: '4px solid #c62828',
  },
  testSection: {
    marginTop: '30px',
    padding: '20px',
    background: '#f5f5f5',
    borderRadius: '10px',
  },
  accounts: {
    display: 'grid',
    gap: '10px',
    marginTop: '10px',
  },
  account: {
    background: 'white',
    padding: '15px',
    borderRadius: '8px',
    fontSize: '14px',
  },
  debug: {
    marginTop: '20px',
    textAlign: 'center',
  },
  testButton: {
    background: '#2196F3',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};
