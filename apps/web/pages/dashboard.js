import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
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

  if (!user) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
        <p>در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <div style={styles.navLeft}>
          <h1 style={styles.logo}>🔄 سیستم تبدیل 3D</h1>
        </div>
        <div style={styles.navRight}>
          <div style={styles.userInfo}>
            <span>👤 {user.name}</span>
            <span style={styles.userRole}>({user.role})</span>
          </div>
          <button onClick={handleLogout} style={styles.logoutButton}>
            🚪 خروج
          </button>
        </div>
      </nav>

      <main style={styles.main}>
        <div style={styles.welcomeCard}>
          <h2>🎉 خوش آمدید، {user.name}!</h2>
          <p>سیستم تبدیل تصاویر 2D به مدل‌های 3D آماده استفاده است.</p>
          
          <div style={styles.userDetails}>
            <div style={styles.detailItem}>
              <strong>ایمیل:</strong> {user.email}
            </div>
            <div style={styles.detailItem}>
              <strong>نقش:</strong> {user.role === 'admin' ? 'مدیر سیستم' : 
                user.role === 'support' ? 'پشتیبانی' : 'کاربر عادی'}
            </div>
            <div style={styles.detailItem}>
              <strong>ورود:</strong> {new Date().toLocaleString('fa-IR')}
            </div>
          </div>
        </div>

        <div style={styles.features}>
          <h2>✨ امکانات سیستم</h2>
          <div style={styles.featureGrid}>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🖼️</div>
              <h3>آپلود تصویر</h3>
              <p>تصاویر 2D خود را آپلود کنید</p>
              <button style={styles.featureButton}>شروع</button>
            </div>
            
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>⚙️</div>
              <h3>تبدیل هوشمند</h3>
              <p>تبدیل خودکار به مدل 3D</p>
              <button style={styles.featureButton}>شروع</button>
            </div>
            
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>📊</div>
              <h3>مدیریت پروژه</h3>
              <p>مدیریت پروژه‌های تبدیل شده</p>
              <button style={styles.featureButton}>مشاهده</button>
            </div>
            
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>📥</div>
              <h3>دانلود خروجی</h3>
              <p>دریافت فایل‌های OBJ، STL</p>
              <button style={styles.featureButton}>دانلود</button>
            </div>
          </div>
        </div>

        <div style={styles.stats}>
          <h2>📈 آمار سیستم</h2>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>۰</div>
              <div style={styles.statLabel}>پروژه‌های فعال</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>۰</div>
              <div style={styles.statLabel}>تبدیل موفق</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>۳</div>
              <div style={styles.statLabel}>کاربران آنلاین</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>۱۰۰٪</div>
              <div style={styles.statLabel}>وضعیت سیستم</div>
            </div>
          </div>
        </div>
      </main>

      <footer style={styles.footer}>
        <p>© ۲۰۲۳ سیستم تبدیل ۳D | پشتیبانی: support@tetrashop.com</p>
        <p>ورژن: ۲.۰.۰ | آخرین به‌روزرسانی: امروز</p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f5f7fa',
    fontFamily: 'Tahoma, Arial, sans-serif',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid rgba(255,255,255,0.3)',
    borderTop: '5px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
  navbar: {
    background: 'white',
    padding: '20px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  navLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logo: {
    fontSize: '24px',
    color: '#333',
    margin: 0,
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  userRole: {
    fontSize: '12px',
    color: '#666',
  },
  logoutButton: {
    background: '#ff6b6b',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  main: {
    padding: '40px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  welcomeCard: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '40px',
    borderRadius: '15px',
    marginBottom: '40px',
    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
  },
  userDetails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginTop: '30px',
    background: 'rgba(255,255,255,0.1)',
    padding: '20px',
    borderRadius: '10px',
  },
  detailItem: {
    fontSize: '16px',
  },
  features: {
    marginBottom: '40px',
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },
  featureCard: {
    background: 'white',
    padding: '30px',
    borderRadius: '10px',
    textAlign: 'center',
    boxShadow: '0 3px 15px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s',
  },
  featureIcon: {
    fontSize: '40px',
    marginBottom: '20px',
  },
  featureButton: {
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '15px',
    fontSize: '14px',
  },
  stats: {
    marginBottom: '40px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },
  statCard: {
    background: 'white',
    padding: '30px',
    borderRadius: '10px',
    textAlign: 'center',
    boxShadow: '0 3px 15px rgba(0,0,0,0.1)',
  },
  statNumber: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: '10px',
  },
  statLabel: {
    color: '#666',
    fontSize: '14px',
  },
  footer: {
    textAlign: 'center',
    padding: '30px',
    background: 'white',
    color: '#666',
    fontSize: '14px',
    borderTop: '1px solid #eee',
  },
};

// اضافه کردن animation
const styleSheet = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = styleSheet;
  document.head.appendChild(style);
}
