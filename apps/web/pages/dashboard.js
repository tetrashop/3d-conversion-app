import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    
    // فقط در کلاینت localStorage را بررسی کن
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      
      if (!savedUser) {
        router.push('/login');
        return;
      }

      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        router.push('/login');
      }
    }
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    router.push('/login');
  };

  // Loading state برای سرور
  if (!isClient) {
    return (
      <div style={styles.loading}>
        🔒 در حال بررسی احراز هویت...
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.loading}>
        🔒 در حال انتقال به صفحه ورود...
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1>🔄 سیستم تبدیل 3D</h1>
          <p>ورژن: ۲.۰ | وضعیت: فعال ✅</p>
        </div>
        <div style={styles.userInfo}>
          <span>👤 {user.name}</span>
          <button onClick={handleLogout} style={styles.logoutButton}>
            🚪 خروج
          </button>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.welcomeCard}>
          <h2>🎉 خوش آمدید!</h2>
          <p>سیستم تبدیل تصاویر ۲D به مدل‌های ۳D آماده استفاده است.</p>
          <p><strong>ایمیل:</strong> {user.email}</p>
          <p><strong>نقش:</strong> {user.role}</p>
        </div>

        <div style={styles.features}>
          <h3>✨ امکانات سیستم</h3>
          <div style={styles.featureGrid}>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🖼️</div>
              <h4>آپلود تصویر</h4>
              <p>تصاویر ۲D خود را آپلود کنید</p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>⚙️</div>
              <h4>تبدیل هوشمند</h4>
              <p>تبدیل خودکار به مدل ۳D</p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>📥</div>
              <h4>دانلود خروجی</h4>
              <p>دریافت فایل‌های OBJ, STL</p>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.footer}>
        <p>© ۲۰۲۳ سیستم تبدیل ۳D | پشتیبانی: support@tetrashop.com</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    fontFamily: 'Tahoma, Arial, sans-serif',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '20px',
    color: '#333',
  },
  header: {
    background: 'white',
    padding: '20px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  logoutButton: {
    background: '#ff6b6b',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  content: {
    padding: '40px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  welcomeCard: {
    background: 'white',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    marginBottom: '40px',
  },
  features: {
    marginTop: '40px',
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },
  featureCard: {
    background: 'white',
    padding: '25px',
    borderRadius: '10px',
    textAlign: 'center',
    boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s',
    '&:hover': {
      transform: 'translateY(-5px)',
    },
  },
  featureIcon: {
    fontSize: '40px',
    marginBottom: '15px',
  },
  footer: {
    textAlign: 'center',
    padding: '20px',
    background: 'white',
    marginTop: '40px',
    color: '#666',
    fontSize: '14px',
  },
};
