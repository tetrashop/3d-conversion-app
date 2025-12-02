import { useState, useEffect } from 'react';
import ShopLayout from '../../components/layouts/ShopLayout';
import CryptoDashboard from '../../components/crypto/Dashboard';
import QuickActions from '../../components/crypto/QuickActions';
import PortfolioChart from '../../components/crypto/PortfolioChart';
import RecentTransactions from '../../components/crypto/RecentTransactions';

export default function CryptoPage() {
  const [portfolio, setPortfolio] = useState({
    totalBalance: 0,
    totalProfit: 0,
    profitPercentage: 0,
    currencies: []
  });

  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);

  // داده‌های نمونه
  const sampleData = {
    totalBalance: 2850.75,
    totalProfit: 324.50,
    profitPercentage: 12.8,
    currencies: [
      { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', amount: 0.045, value: 1890.75, change: 5.2, color: '#F7931A' },
      { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', amount: 0.32, value: 650.50, change: 3.1, color: '#627EEA' },
      { id: 'tether', symbol: 'USDT', name: 'Tether', amount: 200, value: 200, change: 0, color: '#26A17B' },
      { id: 'tron', symbol: 'TRX', name: 'Tron', amount: 1500, value: 109.50, change: -1.5, color: '#FF060A' }
    ]
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPortfolio(sampleData);
      setPrices({
        bitcoin: 42000,
        ethereum: 2200,
        tether: 1,
        tron: 0.073
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  return (
    <ShopLayout pageTitle="مدیریت رمز ارزها - تتراشاپ" pageDescription="مدیریت کیف پول رمزارزها و تراکنش‌ها">
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
        {/* هدر */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '30px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <h1 style={{ color: '#2c3e50', fontSize: '32px', marginBottom: '10px' }}>
              💼 مدیریت رمز ارزها
            </h1>
            <p style={{ color: '#666', fontSize: '16px' }}>
              مدیریت کیف پول چندارزی و تراکنش‌های خود را در اینجا انجام دهید
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleRefresh}
              style={{
                padding: '12px 24px',
                background: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px'
              }}
            >
              {loading ? (
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
              ) : '🔄'}
              بروزرسانی
            </button>
            
            <button style={{
              padding: '12px 24px',
              background: '#2ecc71',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px'
            }}>
              💰 واریز وجه
            </button>
          </div>
        </div>

        {/* بخش‌های اصلی */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 350px', 
          gap: '20px',
          marginBottom: '30px'
        }}>
          {/* بخش اصلی */}
          <div>
            <CryptoDashboard 
              portfolio={portfolio} 
              loading={loading}
            />
            
            <div style={{ marginTop: '30px' }}>
              <PortfolioChart />
            </div>
          </div>

          {/* سایدبار */}
          <div>
            <QuickActions />
            <div style={{ marginTop: '20px' }}>
              <RecentTransactions />
            </div>
          </div>
        </div>

        {/* منوی پایین */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>📱 دسترسی سریع</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '15px' 
          }}>
            <a href="/crypto/wallet" style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: '12px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}>
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>👛</div>
                <div style={{ fontWeight: 'bold' }}>کیف پول</div>
              </div>
            </a>
            
            <a href="/crypto/exchange" style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '20px',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                borderRadius: '12px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}>
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>🔄</div>
                <div style={{ fontWeight: 'bold' }}>تبدیل ارز</div>
              </div>
            </a>
            
            <a href="/crypto/transactions" style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '20px',
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
                borderRadius: '12px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}>
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>📊</div>
                <div style={{ fontWeight: 'bold' }}>تراکنش‌ها</div>
              </div>
            </a>
            
            <div style={{
              padding: '20px',
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              color: 'white',
              borderRadius: '12px',
              textAlign: 'center',
              cursor: 'pointer'
            }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>⚙️</div>
              <div style={{ fontWeight: 'bold' }}>تنظیمات</div>
            </div>
          </div>
        </div>

        {/* اطلاعات بازار */}
        <div style={{ marginTop: '30px' }}>
          <MarketInfo prices={prices} />
        </div>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        div[style*="transition"]:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </ShopLayout>
  );
}

// کامپوننت اطلاعات بازار
function MarketInfo({ prices }) {
  const coins = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
    { id: 'tether', name: 'Tether', symbol: 'USDT' },
    { id: 'tron', name: 'Tron', symbol: 'TRX' }
  ];

  const getCoinColor = (coinId) => {
    const colors = {
      bitcoin: '#F7931A',
      ethereum: '#627EEA',
      tether: '#26A17B',
      tron: '#FF060A'
    };
    return colors[coinId] || '#3498db';
  };

  const getRandomChange = () => {
    return (Math.random() * 10) - 5;
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '25px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>📈 قیمت لحظه‌ای بازار</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
        {coins.map((coin) => {
          const price = prices[coin.id] || 0;
          const change = getRandomChange();
          
          return (
            <div key={coin.id} style={{
              padding: '15px',
              background: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #e0e0e0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: getCoinColor(coin.id),
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  marginLeft: '10px'
                }}>
                  {coin.symbol.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{coin.symbol}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{coin.name}</div>
                </div>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' }}>
                ${price.toLocaleString()}
              </div>
              <div style={{
                fontSize: '14px',
                color: change >= 0 ? '#2ecc71' : '#e74c3c'
              }}>
                {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(2)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
