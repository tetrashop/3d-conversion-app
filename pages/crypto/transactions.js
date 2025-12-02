import { useState } from 'react';
import ShopLayout from '../../components/layouts/ShopLayout';

export default function TransactionsPage() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const transactions = [
    { id: 1, type: 'واریز', currency: 'BTC', amount: 0.01, status: 'موفق', date: '۱۴۰۳/۰۱/۱۵', time: '۱۴:۳۰', txid: 'abc123...xyz789', from: 'Exchange', to: 'Wallet' },
    { id: 2, type: 'خرید', currency: 'ETH', amount: 0.5, status: 'موفق', date: '۱۴۰۳/۰۱/۱۴', time: '۱۰:۱۵', txid: 'def456...uvw012', from: 'Market', to: 'Wallet' },
    { id: 3, type: 'تبدیل', currency: 'USDT', amount: 100, status: 'در انتظار', date: '۱۴۰۳/۰۱/۱۳', time: '۰۹:۴۵', txid: 'ghi789...rst345', from: 'USDT', to: 'BTC' },
    { id: 4, type: 'برداشت', currency: 'BTC', amount: 0.005, status: 'موفق', date: '۱۴۰۳/۰۱/۱۲', time: '۱۶:۲۰', txid: 'jkl012...opq678', from: 'Wallet', to: 'External' },
    { id: 5, type: 'فروش', currency: 'ETH', amount: 0.2, status: 'لغو شده', date: '۱۴۰۳/۰۱/۱۱', time: '۱۱:۱۰', txid: 'mno345...lmn901', from: 'Wallet', to: 'Market' },
    { id: 6, type: 'واریز', currency: 'USDT', amount: 500, status: 'موفق', date: '۱۴۰۳/۰۱/۱۰', time: '۱۳:۲۵', txid: 'pqr678...ijk234', from: 'Exchange', to: 'Wallet' },
    { id: 7, type: 'خرید', currency: 'TRX', amount: 1000, status: 'موفق', date: '۱۴۰۳/۰۱/۰۹', time: '۰۸:۴۰', txid: 'stu901...def567', from: 'Market', to: 'Wallet' },
    { id: 8, type: 'تبدیل', currency: 'BTC', amount: 0.02, status: 'موفق', date: '۱۴۰۳/۰۱/۰۸', time: '۱۷:۵۵', txid: 'vwx234...yza890', from: 'BTC', to: 'ETH' }
  ];

  const filters = [
    { id: 'all', label: 'همه' },
    { id: 'deposit', label: 'واریز' },
    { id: 'withdrawal', label: 'برداشت' },
    { id: 'buy', label: 'خرید' },
    { id: 'sell', label: 'فروش' },
    { id: 'exchange', label: 'تبدیل' }
  ];

  const statusColors = {
    'موفق': '#2ecc71',
    'در انتظار': '#f39c12',
    'لغو شده': '#e74c3c'
  };

  const filteredTransactions = transactions.filter(tx => {
    if (filter !== 'all' && tx.type !== filter) return false;
    if (search && !tx.txid.includes(search) && !tx.currency.includes(search)) return false;
    return true;
  });

  return (
    <ShopLayout pageTitle="تراکنش‌ها - تتراشاپ">
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
              📊 تاریخچه تراکنش‌ها
            </h1>
            <p style={{ color: '#666', fontSize: '16px' }}>
              مشاهده و مدیریت تمام تراکنش‌های کیف پول
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
              📥 گزارش Excel
            </button>
          </div>
        </div>

        {/* فیلترها و جستجو */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '25px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '15px'
          }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {filters.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  style={{
                    padding: '10px 20px',
                    background: filter === f.id ? '#3498db' : '#f8f9fa',
                    color: filter === f.id ? 'white' : '#666',
                    border: 'none',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'all 0.2s'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
            
            <div style={{ position: 'relative', width: '300px' }}>
              <input
                type="text"
                placeholder="جستجو بر اساس TXID یا ارز..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 45px 12px 15px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <div style={{
                position: 'absolute',
                left: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#999'
              }}>
                🔍
              </div>
            </div>
          </div>

          {/* آمار */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
            gap: '15px' 
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>کل تراکنش‌ها</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{transactions.length}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>موفق</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2ecc71' }}>۶</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>در انتظار</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f39c12' }}>۱</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>لغو شده</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e74c3c' }}>۱</div>
            </div>
          </div>
        </div>

        {/* جدول تراکنش‌ها */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 1fr)',
            background: '#f8f9fa',
            padding: '15px 20px',
            borderBottom: '1px solid #e0e0e0',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#2c3e50'
          }}>
            <div>نوع</div>
            <div>ارز</div>
            <div>مقدار</div>
            <div>از</div>
            <div>به</div>
            <div>تاریخ</div>
            <div>وضعیت</div>
            <div>عملیات</div>
          </div>

          {filteredTransactions.map(tx => (
            <div key={tx.id} style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 1fr)',
              padding: '15px 20px',
              borderBottom: '1px solid #f0f0f0',
              alignItems: 'center',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f8f9fa';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
            }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#e3f2fd',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  {tx.type === 'واریز' ? '📥' : 
                   tx.type === 'برداشت' ? '📤' : 
                   tx.type === 'خرید' ? '🛒' : 
                   tx.type === 'فروش' ? '💰' : '🔄'}
                </div>
                <span style={{ fontWeight: 'bold' }}>{tx.type}</span>
              </div>
              
              <div>
                <div style={{ fontWeight: 'bold' }}>{tx.currency}</div>
              </div>
              
              <div>
                <div style={{ fontWeight: 'bold' }}>{tx.amount} {tx.currency}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  ≈ ${(tx.amount * 42000).toLocaleString()}
                </div>
              </div>
              
              <div style={{ fontSize: '14px' }}>{tx.from}</div>
              <div style={{ fontSize: '14px' }}>{tx.to}</div>
              
              <div>
                <div>{tx.date}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>{tx.time}</div>
              </div>
              
              <div>
                <span style={{
                  padding: '5px 12px',
                  background: `${statusColors[tx.status]}20`,
                  color: statusColors[tx.status],
                  borderRadius: '15px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  border: `1px solid ${statusColors[tx.status]}`
                }}>
                  {tx.status}
                </span>
              </div>
              
              <div>
                <button style={{
                  padding: '8px 16px',
                  background: '#f8f9fa',
                  color: '#3498db',
                  border: '1px solid #3498db',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#3498db';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f8f9fa';
                  e.currentTarget.style.color = '#3498db';
                }}
                >
                  مشاهده
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* پاگرد */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '30px',
          padding: '20px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={{
              padding: '10px 20px',
              background: '#f8f9fa',
              color: '#666',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}>
              قبلی
            </button>
            <button style={{
              padding: '10px 20px',
              background: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}>
              ۱
            </button>
            <button style={{
              padding: '10px 20px',
              background: '#f8f9fa',
              color: '#666',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}>
              ۲
            </button>
            <button style={{
              padding: '10px 20px',
              background: '#f8f9fa',
              color: '#666',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}>
              بعدی
            </button>
          </div>
          
          <div style={{ fontSize: '14px', color: '#666' }}>
            نمایش ۱-۸ از {filteredTransactions.length} تراکنش
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}
