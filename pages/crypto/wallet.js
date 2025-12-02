import { useState } from 'react';
import ShopLayout from '../../components/layouts/ShopLayout';

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState('all');
  
  const wallets = [
    {
      id: 'btc',
      name: 'Bitcoin',
      symbol: 'BTC',
      balance: 0.045,
      value: 1890.75,
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      color: '#F7931A',
      change: 5.2
    },
    {
      id: 'eth',
      name: 'Ethereum',
      symbol: 'ETH',
      balance: 0.32,
      value: 650.50,
      address: '0x742d35Cc6634C0532925a3b844Bc9e0F0E14e704',
      color: '#627EEA',
      change: 3.1
    },
    {
      id: 'usdt',
      name: 'Tether',
      symbol: 'USDT',
      balance: 200,
      value: 200,
      address: 'TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj',
      color: '#26A17B',
      change: 0
    },
    {
      id: 'trx',
      name: 'Tron',
      symbol: 'TRX',
      balance: 1500,
      value: 109.50,
      address: 'TNDFARtWwNBm7k9gQe1JkTJ6Tq6SMY7Wq7',
      color: '#FF060A',
      change: -1.5
    },
    {
      id: 'tetra',
      name: 'Tetra Token',
      symbol: 'TETRA',
      balance: 5000,
      value: 500,
      address: '0xTETRA1234567890',
      color: '#3498db',
      change: 12.8
    }
  ];

  const tabs = [
    { id: 'all', label: 'همه', count: wallets.length },
    { id: 'crypto', label: 'رمزارزها', count: 4 },
    { id: 'tokens', label: 'توکن‌ها', count: 1 },
    { id: 'fiat', label: 'ارز دیجیتال', count: 1 }
  ];

  return (
    <ShopLayout pageTitle="کیف پول رمزارزی - تتراشاپ">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
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
              👛 کیف پول چندارزی
            </h1>
            <p style={{ color: '#666', fontSize: '16px' }}>
              مدیریت ارزها، مشاهده موجودی و آدرس‌های کیف پول
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
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
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              💰 واریز جدید
            </button>
            
            <button style={{
              padding: '12px 24px',
              background: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              📤 برداشت
            </button>
          </div>
        </div>

        {/* تب‌ها */}
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          marginBottom: '30px',
          flexWrap: 'wrap'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 24px',
                background: activeTab === tab.id ? '#3498db' : '#f8f9fa',
                color: activeTab === tab.id ? 'white' : '#666',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
              <span style={{
                background: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : '#e0e0e0',
                color: activeTab === tab.id ? 'white' : '#666',
                padding: '2px 8px',
                borderRadius: '10px',
                fontSize: '12px'
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* لیست کیف پول‌ها */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '20px' 
        }}>
          {wallets.map(wallet => (
            <div key={wallet.id} style={{
              background: 'white',
              borderRadius: '12px',
              padding: '25px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              border: `1px solid ${wallet.color}30`,
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* پس‌زمینه رنگ */}
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100px',
                height: '100px',
                background: `${wallet.color}20`,
                borderRadius: '0 12px 0 50%'
              }}></div>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '20px',
                position: 'relative'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: wallet.color,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '24px',
                  marginLeft: '15px'
                }}>
                  {wallet.symbol.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '20px', marginBottom: '5px' }}>
                    {wallet.name}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    {wallet.symbol}
                  </div>
                </div>
              </div>

              {/* موجودی */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                  موجودی
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'baseline'
                }}>
                  <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
                    {wallet.balance.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2c3e50' }}>
                    {wallet.symbol}
                  </div>
                </div>
                <div style={{ fontSize: '16px', color: '#666', marginTop: '5px' }}>
                  ≈ ${wallet.value.toLocaleString()}
                </div>
              </div>

              {/* تغییر قیمت */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                background: wallet.change >= 0 ? '#d4edda' : '#f8d7da',
                color: wallet.change >= 0 ? '#155724' : '#721c24',
                borderRadius: '15px',
                marginBottom: '20px',
                fontSize: '14px'
              }}>
                {wallet.change >= 0 ? '📈' : '📉'}
                {wallet.change >= 0 ? '+' : ''}{wallet.change}%
              </div>

              {/* آدرس کیف پول */}
              <div style={{ marginBottom: '25px' }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                  آدرس کیف پول
                </div>
                <div style={{
                  padding: '12px',
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  wordBreak: 'break-all',
                  border: '1px solid #e0e0e0'
                }}>
                  {wallet.address}
                </div>
              </div>

              {/* دکمه‌های اقدام */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button style={{
                  flex: 1,
                  padding: '12px',
                  background: '#e3f2fd',
                  color: '#1976d2',
                  border: '1px solid #bbdefb',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#1976d2';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#e3f2fd';
                  e.currentTarget.style.color = '#1976d2';
                }}
                >
                  📥 واریز
                </button>
                
                <button style={{
                  flex: 1,
                  padding: '12px',
                  background: '#f8f9fa',
                  color: '#666',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#3498db';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.borderColor = '#3498db';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f8f9fa';
                  e.currentTarget.style.color = '#666';
                  e.currentTarget.style.borderColor = '#e0e0e0';
                }}
                >
                  📤 ارسال
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* جمع کل */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          marginTop: '30px'
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '20px' 
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                ارزش کل دارایی‌ها
              </div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2c3e50' }}>
                $3,350.75
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                تعداد ارزها
              </div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2c3e50' }}>
                {wallets.length}
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                سود امروز
              </div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2ecc71' }}>
                +$42.50
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                کل تراکنش‌ها
              </div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#9b59b6' }}>
                ۳۲
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
      `}</style>
    </ShopLayout>
  );
}
