import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState({ 
    email: 'admin@tetrashop.com', 
    role: 'مدیر سیستم',
    plan: 'پروژه تبدیل 3D'
  });

  useEffect(() => {
    // در صورت نیاز، بعداً verify را اضافه می‌کنیم
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const features = [
    { title: '🛒 فروشگاه مدل‌های 3D', desc: 'خرید و فروش مدل‌های سه‌بعدی آماده' },
    { title: '🔄 تبدیل‌کننده فایل‌های 3D', desc: 'تبدیل بین فرمت‌های OBJ, STL, FBX, GLTF' },
    { title: '💰 پنل مدیریت رمزارز', desc: 'پرداخت‌های ارزی و مدیریت کیف پول' },
    { title: '🎨 ویرایشگر آنلاین', desc: 'ویرایش و تنظیم مدل‌ها در مرورگر' },
    { title: '📱 پنل مدیریت مشتریان', desc: 'مدیریت کاربران و سفارشات' },
    { title: '📊 داشبورد تحلیل‌ها', desc: 'آمار فروش و استفاده از سرویس' }
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* هدر */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '40px',
        paddingBottom: '20px',
        borderBottom: '2px solid #eee'
      }}>
        <div>
          <h1 style={{ color: '#333', marginBottom: '5px' }}>پنل مدیریت 3D Conversion</h1>
          <p style={{ color: '#666' }}>سیستم جامع تبدیل و فروش مدل‌های سه‌بعدی</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p><strong>👤 کاربر:</strong> {user.email}</p>
          <p><strong>🏆 سطح دسترسی:</strong> {user.role}</p>
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              router.push('/login');
            }}
            style={{
              padding: '8px 16px',
              background: '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            خروج از سیستم
          </button>
        </div>
      </div>

      {/* کارت‌های ویژگی‌ها */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>🎯 ویژگی‌های اصلی پلتفرم</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '20px'
        }}>
          {features.map((feature, index) => (
            <div key={index} style={{
              background: 'white',
              padding: '25px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              border: '1px solid #e0e0e0',
              transition: 'transform 0.3s'
            }}>
              <h3 style={{ color: '#3498db', marginBottom: '10px' }}>{feature.title}</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>{feature.desc}</p>
              <button style={{
                marginTop: '15px',
                padding: '8px 16px',
                background: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                شروع کنید →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* بخش اقدامات سریع */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '30px',
        borderRadius: '12px',
        marginBottom: '40px'
      }}>
        <h2 style={{ marginBottom: '15px' }}>🚀 اقدامات سریع</h2>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button style={{
            padding: '12px 24px',
            background: 'white',
            color: '#667eea',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            آپلود مدل جدید
          </button>
          <button style={{
            padding: '12px 24px',
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '1px solid white',
            borderRadius: '6px',
            cursor: 'pointer'
          }}>
            مشاهده سفارشات
          </button>
          <button style={{
            padding: '12px 24px',
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '1px solid white',
            borderRadius: '6px',
            cursor: 'pointer'
          }}>
            تنظیمات پرداخت
          </button>
          <button style={{
            padding: '12px 24px',
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '1px solid white',
            borderRadius: '6px',
            cursor: 'pointer'
          }}>
            گزارش‌های مالی
          </button>
        </div>
      </div>

      {/* پانوشت */}
      <div style={{
        textAlign: 'center',
        padding: '20px',
        color: '#666',
        borderTop: '1px solid #eee',
        marginTop: '40px'
      }}>
        <p>© 2024 3D Conversion App - نسخه ۱.۰</p>
        <p style={{ fontSize: '14px' }}>پلتفرم جامع تبدیل و فروش مدل‌های سه‌بعدی</p>
      </div>
    </div>
  );
}
