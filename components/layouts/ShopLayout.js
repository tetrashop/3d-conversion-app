import ShopProvider from '../../lib/contexts/ShopContext';
import Head from 'next/head';
import { useShop } from '../../lib/contexts/ShopContext';
import { useState, useEffect } from 'react';

export default function ShopLayout({ children, pageTitle = 'فروشگاه تتراشاپ', pageDescription = 'مرجع تخصصی خرید و فروش مدل‌های سه‌بعدی' }) {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <ShopProvider>
        <ShopLayoutContent>{children}</ShopLayoutContent>
      </ShopProvider>
    </>
  );
}

function ShopLayoutContent({ children }) {
  const { cart, cartTotal, isClient } = useShop();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
        </div>
      </div>
    );
  }
  
  const cartCount = Array.isArray(cart) ? cart.length : 0;
  
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={{ flex: 1, background: '#f8f9fa' }}>
        <header style={{
          background: 'white',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 1000
        }}>
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '15px 20px'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '15px'
            }}>
              {/* لوگو */}
              <a href="/shop" style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '20px'
                  }}>
                    T
                  </div>
                  <div>
                    <h1 style={{ 
                      margin: 0, 
                      color: '#2c3e50',
                      fontSize: '24px'
                    }}>
                      تتراشاپ
                    </h1>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#7f8c8d',
                      marginTop: '-5px'
                    }}>
                      فروشگاه و تبدیل‌کننده ۳D
                    </div>
                  </div>
                </div>
              </a>
              
              {/* سبد خرید */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <a href="/shop/checkout" style={{ textDecoration: 'none', position: 'relative' }}>
                  <div style={{ 
                    padding: '10px',
                    background: '#f8f9fa',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    position: 'relative'
                  }}>
                    <div style={{ fontSize: '24px' }}>🛒</div>
                    {cartCount > 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '-5px',
                        left: '-5px',
                        background: '#e74c3c',
                        color: 'white',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px'
                      }}>
                        {cartCount}
                      </div>
                    )}
                  </div>
                </a>
                
                {/* اطلاعات کاربر */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  cursor: 'pointer'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #3498db 0%, #2ecc71 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    ع
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                      علی محمدی
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      ali@example.com
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* منو */}
            <nav style={{ marginTop: '15px' }}>
              <div style={{ 
                display: 'flex', 
                gap: '5px',
                flexWrap: 'wrap'
              }}>
                <a href="/shop" style={{ textDecoration: 'none' }}>
                  <div style={{
                    padding: '10px 20px',
                    color: '#3498db',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    background: '#e3f2fd'
                  }}>
                    🏠 صفحه اصلی
                  </div>
                </a>
                
                <a href="/converter" style={{ textDecoration: 'none' }}>
                  <div style={{
                    padding: '10px 20px',
                    color: '#666',
                    borderRadius: '20px',
                    fontSize: '14px'
                  }}>
                    🎨 تبدیل ۳D
                  </div>
                </a>
                
                <a href="/crypto" style={{ textDecoration: 'none' }}>
                  <div style={{
                    padding: '10px 20px',
                    color: '#666',
                    borderRadius: '20px',
                    fontSize: '14px'
                  }}>
                    💰 رمز ارز
                  </div>
                </a>
                
                <a href="/dashboard/orders" style={{ textDecoration: 'none' }}>
                  <div style={{
                    padding: '10px 20px',
                    color: '#666',
                    borderRadius: '20px',
                    fontSize: '14px'
                  }}>
                    📦 سفارشات من
                  </div>
                </a>
              </div>
            </nav>
          </div>
        </header>
        
        <main style={{ minHeight: 'calc(100vh - 200px)' }}>
          {children}
        </main>
        
        <footer style={{
          background: '#2c3e50',
          color: 'white',
          padding: '40px 20px',
          marginTop: '50px'
        }}>
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px'
          }}>
            <div>
              <h3 style={{ marginBottom: '15px' }}>تتراشاپ</h3>
              <p style={{ color: '#bdc3c7', lineHeight: '1.6' }}>
                فروشگاه، تبدیل‌کننده و کیف پول رمزارزی تخصصی مدل‌های سه‌بعدی
              </p>
            </div>
            
            <div>
              <h4 style={{ marginBottom: '15px' }}>خدمات</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href="/shop" style={{ color: '#bdc3c7', textDecoration: 'none' }}>🛍️ فروشگاه مدل‌ها</a>
                <a href="/converter" style={{ color: '#bdc3c7', textDecoration: 'none' }}>🎨 تبدیل فرمت‌ها</a>
                <a href="/crypto" style={{ color: '#bdc3c7', textDecoration: 'none' }}>💰 کیف پول رمزارزی</a>
                <a href="#" style={{ color: '#bdc3c7', textDecoration: 'none' }}>⚡ بهینه‌سازی</a>
              </div>
            </div>
            
            <div>
              <h4 style={{ marginBottom: '15px' }}>پشتیبانی</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href="#" style={{ color: '#bdc3c7', textDecoration: 'none' }}>📞 تماس با ما</a>
                <a href="#" style={{ color: '#bdc3c7', textDecoration: 'none' }}>❓ سوالات متداول</a>
                <a href="#" style={{ color: '#bdc3c7', textDecoration: 'none' }}>📚 راهنما</a>
              </div>
            </div>
            
            <div>
              <h4 style={{ marginBottom: '15px' }}>تماس با ما</h4>
              <div style={{ color: '#bdc3c7', lineHeight: '1.6' }}>
                <div>📧 support@tetrashop.com</div>
                <div>📞 ۰۲۱-۱۲۳۴۵۶۷۸</div>
                <div>📍 تهران، خیابان ولیعصر</div>
              </div>
            </div>
          </div>
          
          <div style={{ 
            textAlign: 'center', 
            marginTop: '40px', 
            paddingTop: '20px',
            borderTop: '1px solid #34495e',
            color: '#7f8c8d',
            fontSize: '14px'
          }}>
            © ۱۴۰۳ تتراشاپ - تمامی حقوق محفوظ است
          </div>
        </footer>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        nav a div:hover {
          background: #f5f5f5;
          color: #3498db;
          transform: translateY(-2px);
          transition: all 0.2s ease;
        }
      `}</style>
    </div>
  );
}
