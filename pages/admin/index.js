import React from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', padding: '20px' }}>
      <header style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '30px', borderRadius: '10px', marginBottom: '30px' }}>
        <h1 style={{ margin: 0 }}>پنل مدیریت 3D Conversion</h1>
        <p style={{ opacity: 0.9, marginTop: '10px' }}>سیستم جامع تبدیل و فروش مدل‌های سه‌بعدی</p>
        
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div>👤 کاربر: admin@tetrashop.com</div>
            <div>🏆 سطح دسترسی: مدیر سیستم</div>
          </div>
          <button style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer' }}>
            خروج از سیستم
          </button>
        </div>
      </header>

      <h2 style={{ color: '#333', marginBottom: '20px' }}>🎯 ویژگی‌های اصلی پلتفرم</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {/* فروشگاه */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
            <div style={{ background: '#4299e1', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}>🛒</div>
            <h3 style={{ margin: 0 }}>فروشگاه مدل‌های 3D</h3>
          </div>
          <p style={{ color: '#718096', marginBottom: '20px' }}>خرید و فروش مدل‌های سه‌بعدی آماده</p>
          <Link href="/shop" style={{ display: 'inline-block', background: '#4299e1', color: 'white', padding: '10px 20px', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold' }}>
            شروع کنید →
          </Link>
        </div>

        {/* تبدیل‌کننده */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
            <div style={{ background: '#38b2ac', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}>🔄</div>
            <h3 style={{ margin: 0 }}>تبدیل‌کننده فایل‌های 3D</h3>
          </div>
          <p style={{ color: '#718096', marginBottom: '20px' }}>تبدیل بین فرمت‌های OBJ, STL, FBX, GLTF</p>
          <Link href="/converter" style={{ display: 'inline-block', background: '#38b2ac', color: 'white', padding: '10px 20px', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold' }}>
            شروع کنید →
          </Link>
        </div>

        {/* کیف پول */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
            <div style={{ background: '#ed8936', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}>💰</div>
            <h3 style={{ margin: 0 }}>پنل مدیریت رمزارز</h3>
          </div>
          <p style={{ color: '#718096', marginBottom: '20px' }}>پرداخت‌های ارزی و مدیریت کیف پول</p>
          <Link href="/crypto" style={{ display: 'inline-block', background: '#ed8936', color: 'white', padding: '10px 20px', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold' }}>
            شروع کنید →
          </Link>
        </div>

        {/* ویرایشگر */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
            <div style={{ background: '#9f7aea', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}>🎨</div>
            <h3 style={{ margin: 0 }}>ویرایشگر آنلاین</h3>
          </div>
          <p style={{ color: '#718096', marginBottom: '20px' }}>ویرایش و تنظیم مدل‌ها در مرورگر</p>
          <Link href="/editor" style={{ display: 'inline-block', background: '#9f7aea', color: 'white', padding: '10px 20px', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold' }}>
            شروع کنید →
          </Link>
        </div>

        {/* مدیریت مشتریان */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
            <div style={{ background: '#f56565', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}>📱</div>
            <h3 style={{ margin: 0 }}>پنل مدیریت مشتریان</h3>
          </div>
          <p style={{ color: '#718096', marginBottom: '20px' }}>مدیریت کاربران و سفارشات</p>
          <Link href="/admin/customers" style={{ display: 'inline-block', background: '#f56565', color: 'white', padding: '10px 20px', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold' }}>
            شروع کنید →
          </Link>
        </div>

        {/* تحلیل‌ها */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
            <div style={{ background: '#48bb78', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}>📊</div>
            <h3 style={{ margin: 0 }}>داشبورد تحلیل‌ها</h3>
          </div>
          <p style={{ color: '#718096', marginBottom: '20px' }}>آمار فروش و استفاده از سرویس</p>
          <Link href="/admin/analytics" style={{ display: 'inline-block', background: '#48bb78', color: 'white', padding: '10px 20px', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold' }}>
            شروع کنید →
          </Link>
        </div>
      </div>

      <div style={{ marginTop: '40px', padding: '20px', background: '#f7fafc', borderRadius: '10px' }}>
        <h3>🚀 اقدامات سریع</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '15px' }}>
          <button style={{ background: '#4299e1', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer' }}>آپلود مدل جدید</button>
          <button style={{ background: '#38b2ac', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer' }}>مشاهده سفارشات</button>
          <button style={{ background: '#ed8936', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer' }}>تنظیمات پرداخت</button>
          <button style={{ background: '#9f7aea', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer' }}>گزارش‌های مالی</button>
        </div>
      </div>

      <footer style={{ marginTop: '40px', textAlign: 'center', color: '#718096', padding: '20px', borderTop: '1px solid #e2e8f0' }}>
        <p>© 2024 3D Conversion App - نسخه ۱.۰</p>
        <p>پلتفرم جامع تبدیل و فروش مدل‌های سه‌بعدی</p>
      </footer>
    </div>
  );
}
