import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // بررسی احراز هویت
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (!token || !savedUser) {
      router.push('/login');
      return;
    }

    try {
      setUser(JSON.parse(savedUser));
    } catch (err) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) {
    return (
      <div style={styles.loading}>
        🔒 در حال بررسی احراز هویت...
      </div>
    );
  }

  return (
    <div dir="rtl" style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1>🔄 سیستم تبدیل 3D</h1>
          <p>خوش آمدید، {user.name} ({user.email})</p>
        </div>
        <div>
          <button onClick={handleLogout} style={styles.logoutButton}>
            🚪 خروج
          </button>
        </div>
      </div>

      <div style={styles.dashboard}>
        <div style={styles.card}>
          <h3>👤 اطلاعات کاربر</h3>
          <p><strong>نام:</strong> {user.name}</p>
          <p><strong>ایمیل:</strong> {user.email}</p>
          <p><strong>نقش:</strong> {user.role}</p>
          <p><strong>آخرین ورود:</strong> {new Date().toLocaleString('fa-IR')}</p>
        </div>

        <div style={styles.card}>
          <h3>📤 تبدیل تصویر به 3D</h3>
          <input type="file" style={styles.fileInput} />
          <button style={styles.convertButton}>
            🚀 شروع تبدیل
          </button>
        </div>

        <div style={styles.card}>
          <h3>📊 آمار سیستم</h3>
          <p>✅ احراز هویت: فعال</p>
          <p>🔒 ورود با ایمیل: فعال</p>
          <p>👥 کاربران: ۳ حساب فعال</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    padding: '20px',
    fontFamily: 'Tahoma, Arial, sans-serif',
    color: 'white',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
    background: 'rgba(255, 255, 255, 0.1)',
    padding: '20px',
    borderRadius: '10px',
  },
  logoutButton: {
    background: '#ff6b6b',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  dashboard: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.1)',
    padding: '25px',
    borderRadius: '10px',
    backdropFilter: 'blur(10px)',
  },
  fileInput: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: 'none',
  },
  convertButton: {
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    width: '100%',
  },
};
