import Link from 'next/link';

export default function Dashboard() {
  return (
    <div style={{ 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      direction: 'rtl'
    }}>
      {/* Header */}
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

      {/* User Info */}
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

      {/* Main Features */}
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        🎯 ویژگی‌های اصلی پلتفرم
      </h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        {/* Feature 1 */}
        <div style={{
          background: 'white',
          border: '1px solid #e9ecef',
          borderRadius: '10px',
          padding: '25px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
            <span style={{ fontSize: '24px', marginLeft: '10px' }}>🛒</span>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>فروشگاه مدل‌های 3D</h3>
          </div>
          <p style={{ color: '#6c757d', marginBottom: '20px' }}>
            خرید و فروش مدل‌های سه‌بعدی آماده
          </p>
          <Link href="/shop" style={{
            background: '#28a745',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            width: '100%',
            fontSize: '16px',
            display: 'block',
            textAlign: 'center',
            textDecoration: 'none'
          }}>
            شروع کنید →
          </Link>
        </div>

        {/* Feature 2 */}
        <div style={{
          background: 'white',
          border: '1px solid #e9ecef',
          borderRadius: '10px',
          padding: '25px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
            <span style={{ fontSize: '24px', marginLeft: '10px' }}>🔄</span>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>تبدیل‌کننده فایل‌های 3D</h3>
          </div>
          <p style={{ color: '#6c757d', marginBottom: '20px' }}>
            تبدیل بین فرمت‌های OBJ, STL, FBX, GLTF
          </p>
          <Link href="/converter" style={{
            background: '#28a745',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            width: '100%',
            fontSize: '16px',
            display: 'block',
            textAlign: 'center',
            textDecoration: 'none'
          }}>
            شروع کنید →
          </Link>
        </div>

        {/* Feature 3 */}
        <div style={{
          background: 'white',
          border: '1px solid #e9ecef',
          borderRadius: '10px',
          padding: '25px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
            <span style={{ fontSize: '24px', marginLeft: '10px' }}>💰</span>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>پنل مدیریت رمزارز</h3>
          </div>
          <p style={{ color: '#6c757d', marginBottom: '20px' }}>
            پرداخت‌های ارزی و مدیریت کیف پول
          </p>
          <Link href="/crypto" style={{
            background: '#28a745',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            width: '100%',
            fontSize: '16px',
            display: 'block',
            textAlign: 'center',
            textDecoration: 'none'
          }}>
            شروع کنید →
          </Link>
        </div>

        {/* Feature 4 */}
        <div style={{
          background: 'white',
          border: '1px solid #e9ecef',
          borderRadius: '10px',
          padding: '25px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
            <span style={{ fontSize: '24px', marginLeft: '10px' }}>🎨</span>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>ویرایشگر آنلاین</h3>
          </div>
          <p style={{ color: '#6c757d', marginBottom: '20px' }}>
            ویرایش و تنظیم مدل‌ها در مرورگر
          </p>
          <Link href="/editor" style={{
            background: '#28a745',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            width: '100%',
            fontSize: '16px',
            display: 'block',
            textAlign: 'center',
            textDecoration: 'none'
          }}>
            شروع کنید →
          </Link>
        </div>

        {/* Feature 5 */}
        <div style={{
          background: 'white',
          border: '1px solid #e9ecef',
          borderRadius: '10px',
          padding: '25px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
            <span style={{ fontSize: '24px', marginLeft: '10px' }}>📱</span>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>پنل مدیریت مشتریان</h3>
          </div>
          <p style={{ color: '#6c757d', marginBottom: '20px' }}>
            مدیریت کاربران و سفارشات
          </p>
          <Link href="/customers" style={{
            background: '#28a745',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            width: '100%',
            fontSize: '16px',
            display: 'block',
            textAlign: 'center',
            textDecoration: 'none'
          }}>
            شروع کنید →
          </Link>
        </div>

        {/* Feature 6 */}
        <div style={{
          background: 'white',
          border: '1px solid #e9ecef',
          borderRadius: '10px',
          padding: '25px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
            <span style={{ fontSize: '24px', marginLeft: '10px' }}>📊</span>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>داشبورد تحلیل‌ها</h3>
          </div>
          <p style={{ color: '#6c757d', marginBottom: '20px' }}>
            آمار فروش و استفاده از سرویس
          </p>
          <Link href="/analytics" style={{
            background: '#28a745',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            width: '100%',
            fontSize: '16px',
            display: 'block',
            textAlign: 'center',
            textDecoration: 'none'
          }}>
            شروع کنید →
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        🚀 اقدامات سریع
      </h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '40px'
      }}>
        <Link href="/upload" style={{
          background: '#007bff',
          color: 'white',
          border: 'none',
          padding: '15px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          textAlign: 'center',
          display: 'block',
          textDecoration: 'none'
        }}>
          آپلود مدل جدید
        </Link>
        
        <Link href="/orders" style={{
          background: '#6f42c1',
          color: 'white',
          border: 'none',
          padding: '15px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          textAlign: 'center',
          display: 'block',
          textDecoration: 'none'
        }}>
          مشاهده سفارشات
        </Link>
        
        <Link href="/payment-settings" style={{
          background: '#fd7e14',
          color: 'white',
          border: 'none',
          padding: '15px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          textAlign: 'center',
          display: 'block',
          textDecoration: 'none'
        }}>
          تنظیمات پرداخت
        </Link>
        
        <Link href="/reports" style={{
          background: '#20c997',
          color: 'white',
          border: 'none',
          padding: '15px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          textAlign: 'center',
          display: 'block',
          textDecoration: 'none'
        }}>
          گزارش‌های مالی
        </Link>
      </div>

      {/* Footer */}
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
