import { useState } from 'react';

export default function PortfolioChart() {
  const [timeRange, setTimeRange] = useState('7d');

  const timeRanges = [
    { id: '1d', label: '۱ روز' },
    { id: '7d', label: '۷ روز' },
    { id: '30d', label: '۳۰ روز' },
    { id: '90d', label: '۹۰ روز' },
    { id: '1y', label: '۱ سال' }
  ];

  const chartData = {
    labels: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور'],
    values: [1200, 1900, 1500, 2500, 2200, 2850]
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '25px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={{ color: '#2c3e50' }}>📊 نمودار پرتفوی</h3>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          {timeRanges.map(range => (
            <button
              key={range.id}
              onClick={() => setTimeRange(range.id)}
              style={{
                padding: '8px 16px',
                background: timeRange === range.id ? '#3498db' : '#f8f9fa',
                color: timeRange === range.id ? 'white' : '#666',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* نمودار ساده */}
      <div style={{ height: '200px', position: 'relative', marginBottom: '20px' }}>
        {/* خطوط راهنما */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '10px 0'
        }}>
          {[3000, 2000, 1000, 0].map(value => (
            <div key={value} style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '12px',
              color: '#999'
            }}>
              <div style={{ marginLeft: '10px' }}>${value.toLocaleString()}</div>
              <div style={{ 
                flex: 1, 
                height: '1px', 
                background: '#eee',
                marginRight: '10px'
              }}></div>
            </div>
          ))}
        </div>

        {/* نمودار */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 60,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'flex-end',
          gap: '20px',
          paddingBottom: '10px'
        }}>
          {chartData.values.map((value, index) => {
            const height = (value / 3000) * 100;
            return (
              <div key={index} style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%'
              }}>
                <div style={{
                  width: '100%',
                  height: `${height}%`,
                  background: 'linear-gradient(to top, #3498db, #2ecc71)',
                  borderRadius: '4px 4px 0 0',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  ':hover': {
                    opacity: 0.8
                  }
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.children[0].style.opacity = 1;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.children[0].style.opacity = 0;
                }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '-25px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#2c3e50',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none'
                  }}>
                    ${value.toLocaleString()}
                  </div>
                </div>
                <div style={{
                  marginTop: '10px',
                  fontSize: '12px',
                  color: '#666',
                  textAlign: 'center'
                }}>
                  {chartData.labels[index]}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* اطلاعات آماری */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '15px',
        marginTop: '20px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>بالاترین</div>
          <div style={{ fontWeight: 'bold', color: '#2ecc71' }}>$2,850</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>پایین‌ترین</div>
          <div style={{ fontWeight: 'bold', color: '#e74c3c' }}>$1,200</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>میانگین</div>
          <div style={{ fontWeight: 'bold', color: '#3498db' }}>$2,025</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>نوسان</div>
          <div style={{ fontWeight: 'bold', color: '#9b59b6' }}>12.8%</div>
        </div>
      </div>
    </div>
  );
}
