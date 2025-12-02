export default function AnalyticsPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>📊 داشبورد تحلیل‌ها</h1>
      <p>آمار فروش و استفاده از سطوح مختلف</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
        <div style={{ background: '#e3f2fd', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <h3>۱۰۰+</h3>
          <p>مدل فروخته شده</p>
        </div>
        <div style={{ background: '#f3e5f5', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <h3>۵۰+</h3>
          <p>تبدیل موفق</p>
        </div>
        <div style={{ background: '#e8f5e9', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <h3>۲۰+</h3>
          <p>کاربر فعال</p>
        </div>
      </div>
    </div>
  );
}
