export default function Dashboard() {
  return (
    <div style={{ 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      direction: 'rtl'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '40px',
        borderRadius: '15px',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>
          پنل مدیریت 3D Conversion
        </h1>
        <p style={{ fontSize: '18px', opacity: 0.9 }}>
          سیستم جامع تبدیل و فروش مدل‌های سه‌بعدی
        </p>
      </div>

      <div style={{
        background: '#f8f9fa',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '30px',
        border: '1px solid #e9ecef'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ margin: '5px 0', fontSize: '16px' }}>👤 کاربر: admin@tetrashop.com</p>
            <p style={{ margin: '5px 0', fontSize: '16px' }}>🏆 سطح دسترسی: مدیر سیستم</p>
          </div>
          <button style={{
            background: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}>
            خروج از سیستم
          </button>
        </div>
      </div>

      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        🎯 ویژگی‌های اصلی پلتفرم
      </h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        {[
          { icon: '🛒', title: 'فروشگاه مدل‌های 3D', desc: 'خرید و فروش مدل‌های سه‌بعدی آماده' },
          { icon: '🔄', title: 'تبدیل‌کننده فایل‌های 3D', desc: 'تبدیل بین فرمت‌های OBJ, STL, FBX, GLTF' },
          { icon: '💰', title: 'پنل مدیریت رمزارز', desc: 'پرداخت‌های ارزی و مدیریت کیف پول' },
          { icon: '🎨', title: 'ویرایشگر آنلاین', desc: 'ویرایش و تنظیم مدل‌ها در مرورگر' },
          { icon: '📱', title: 'پنل مدیریت مشتریان', desc: 'مدیریت کاربران و سفارشات' },
          { icon: '📊', title: 'داشبورد تحلیل‌ها', desc: 'آمار فروش و استفاده از سرویس' }
        ].map((item, index) => (
          <div key={index} style={{
            background: 'white',
            border: '1px solid #e9ecef',
            borderRadius: '10px',
            padding: '25px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
              <span style={{ fontSize: '24px', marginLeft: '10px' }}>{item.icon}</span>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>{item.title}</h3>
            </div>
            <p style={{ color: '#6c757d', marginBottom: '20px' }}>{item.desc}</p>
            <button style={{
              background: '#28a745',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              width: '100%',
              fontSize: '16px'
            }}>
              شروع کنید →
            </button>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        🚀 اقدامات سریع
      </h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '40px'
      }}>
        {[
          { text: 'آپلود مدل جدید', color: '#007bff' },
          { text: 'مشاهده سفارشات', color: '#6f42c1' },
          { text: 'تنظیمات پرداخت', color: '#fd7e14' },
          { text: 'گزارش‌های مالی', color: '#20c997' }
        ].map((item, index) => (
          <button key={index} style={{
            background: item.color,
            color: 'white',
            border: 'none',
            padding: '15px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}>
            {item.text}
          </button>
        ))}
      </div>

      <div style={{
        textAlign: 'center',
        padding: '20px',
        borderTop: '1px solid #e9ecef',
        marginTop: '40px',
        color: '#6c757d'
      }}>
        <p>© 2024 3D Conversion App - نسخه ۱.۰</p>
        <p style={{ fontWeight: 'bold', margin: '10px 0' }}>
          پلتفرم جامع تبدیل و فروش مدل‌های سه‌بعدی
        </p>
        <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#495057' }}>
          پنل مدیریت 3D Conversion
        </p>
      </div>
    </div>
  );
}
