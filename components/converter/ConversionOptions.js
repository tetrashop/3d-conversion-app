export default function ConversionOptions({ options, onChange, inputFormat }) {
  const formats = [
    { id: 'glb', name: 'GLB (Binary)', description: 'بهترین برای وب و موبایل' },
    { id: 'gltf', name: 'GLTF (JSON)', description: 'سبک و قابل ویرایش' },
    { id: 'obj', name: 'OBJ', description: 'سازگار با اکثر نرم‌افزارها' },
    { id: 'fbx', name: 'FBX', description: 'مناسب برای انیمیشن و بازی' },
    { id: 'stl', name: 'STL', description: 'مناسب برای پرینت سه‌بعدی' }
  ];

  const compressionLevels = [
    { id: 'none', name: 'بدون فشرده‌سازی', size: '100%' },
    { id: 'low', name: 'کم', size: '70%' },
    { id: 'medium', name: 'متوسط', size: '50%' },
    { id: 'high', name: 'زیاد', size: '30%' }
  ];

  const handleOptionChange = (key, value) => {
    onChange({
      ...options,
      [key]: value
    });
  };

  return (
    <div>
      {/* انتخاب فرمت خروجی */}
      <div style={{ marginBottom: '25px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
          فرمت خروجی
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
          {formats.map(format => (
            <label
              key={format.id}
              style={{
                padding: '15px',
                border: `2px solid ${options.format === format.id ? '#3498db' : '#e0e0e0'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                background: options.format === format.id ? '#f0f8ff' : 'white',
                transition: 'all 0.2s'
              }}
            >
              <input
                type="radio"
                name="format"
                value={format.id}
                checked={options.format === format.id}
                onChange={(e) => handleOptionChange('format', e.target.value)}
                style={{ marginLeft: '10px' }}
              />
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{format.name}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>{format.description}</div>
            </label>
          ))}
        </div>
      </div>

      {/* تنظیمات بهینه‌سازی */}
      <div style={{ marginBottom: '25px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
          سطح فشرده‌سازی
        </label>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {compressionLevels.map(level => (
            <label
              key={level.id}
              style={{
                flex: 1,
                minWidth: '120px',
                padding: '12px',
                border: `2px solid ${options.compression === level.id ? '#2ecc71' : '#e0e0e0'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                background: options.compression === level.id ? '#f0fff4' : 'white',
                textAlign: 'center'
              }}
            >
              <input
                type="radio"
                name="compression"
                value={level.id}
                checked={options.compression === level.id}
                onChange={(e) => handleOptionChange('compression', e.target.value)}
                style={{ marginLeft: '5px' }}
              />
              <div style={{ fontWeight: 'bold' }}>{level.name}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>حجم: {level.size}</div>
            </label>
          ))}
        </div>
      </div>

      {/* کاهش پلیگان‌ها */}
      <div style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <label style={{ fontWeight: 'bold' }}>کاهش پلیگان‌ها</label>
          <span style={{ fontWeight: 'bold', color: '#3498db' }}>{options.reducePolygons}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="90"
          step="5"
          value={options.reducePolygons}
          onChange={(e) => handleOptionChange('reducePolygons', parseInt(e.target.value))}
          style={{
            width: '100%',
            height: '8px',
            background: '#e0e0e0',
            borderRadius: '4px',
            outline: 'none'
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666', marginTop: '5px' }}>
          <span>بدون کاهش</span>
          <span>کاهش ۹۰٪</span>
        </div>
      </div>

      {/* گزینه‌های اضافی */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="checkbox"
            checked={options.optimize}
            onChange={(e) => handleOptionChange('optimize', e.target.checked)}
          />
          <div>
            <div style={{ fontWeight: 'bold' }}>بهینه‌سازی خودکار</div>
            <div style={{ fontSize: '12px', color: '#666' }}>حذف داده‌های اضافی</div>
          </div>
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="checkbox"
            checked={options.preserveTextures}
            onChange={(e) => handleOptionChange('preserveTextures', e.target.checked)}
          />
          <div>
            <div style={{ fontWeight: 'bold' }}>حفظ بافت‌ها</div>
            <div style={{ fontSize: '12px', color: '#666' }}>نگهداری مواد و تصاویر</div>
          </div>
        </label>
      </div>
    </div>
  );
}
