import { useState } from 'react';
import ShopLayout from '../../components/layouts/ShopLayout';
import FileUploader from '../../components/converter/FileUploader';
import ModelPreview from '../../components/three/ModelPreview';
import ConversionOptions from '../../components/converter/ConversionOptions';

export default function ConverterPage() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [convertedFile, setConvertedFile] = useState(null);
  const [conversionOptions, setConversionOptions] = useState({
    format: 'glb',
    optimize: true,
    compression: 'medium',
    reducePolygons: 50
  });
  const [isConverting, setIsConverting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileUpload = (file) => {
    setUploadedFile(file);
    
    // ایجاد URL برای پیش‌نمایش
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    // تنظیم فرمت خروجی بر اساس فرمت ورودی
    const ext = file.name.split('.').pop().toLowerCase();
    let targetFormat = 'glb';
    
    if (ext === 'obj') targetFormat = 'glb';
    else if (ext === 'fbx') targetFormat = 'gltf';
    else if (ext === 'stl') targetFormat = 'obj';
    
    setConversionOptions(prev => ({
      ...prev,
      format: targetFormat,
      inputFormat: ext
    }));
  };

  const handleConvert = async () => {
    if (!uploadedFile) return;
    
    setIsConverting(true);
    
    try {
      // شبیه‌سازی تبدیل (در مرحله بعدی با API واقعی جایگزین می‌شود)
      setTimeout(() => {
        const converted = {
          name: uploadedFile.name.replace(/\.[^/.]+$/, '') + '.' + conversionOptions.format,
          size: Math.round(uploadedFile.size * 0.7), // 30% فشرده‌تر
          format: conversionOptions.format,
          url: '#', // در حالت واقعی لینک دانلود
          downloadUrl: URL.createObjectURL(uploadedFile) // شبیه‌سازی
        };
        
        setConvertedFile(converted);
        setIsConverting(false);
        
        alert(`✅ تبدیل موفق! فایل ${converted.name} آماده دانلود است.`);
      }, 2000);
    } catch (error) {
      console.error('خطا در تبدیل:', error);
      setIsConverting(false);
      alert('❌ خطا در تبدیل فایل. لطفاً دوباره تلاش کنید.');
    }
  };

  const handleDownload = () => {
    if (convertedFile?.downloadUrl) {
      const a = document.createElement('a');
      a.href = convertedFile.downloadUrl;
      a.download = convertedFile.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <ShopLayout pageTitle="تبدیل‌کننده ۳D - تتراشاپ">
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: '#2c3e50', fontSize: '32px', marginBottom: '10px' }}>
            🎨 تبدیل‌کننده مدل‌های سه‌بعدی
          </h1>
          <p style={{ color: '#666', fontSize: '18px' }}>
            فایل‌های ۳D خود را به فرمت‌های مختلف تبدیل و بهینه‌سازی کنید
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '40px',
          marginBottom: '40px'
        }}>
          {/* بخش سمت چپ: آپلود و تنظیمات */}
          <div>
            <div style={{ 
              background: 'white', 
              borderRadius: '12px',
              padding: '30px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              marginBottom: '20px'
            }}>
              <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>📤 آپلود فایل</h2>
              <FileUploader onFileUpload={handleFileUpload} />
              
              {uploadedFile && (
                <div style={{
                  marginTop: '20px',
                  padding: '15px',
                  background: '#e8f5e9',
                  borderRadius: '8px',
                  border: '1px solid #c8e6c9'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                        📄 {uploadedFile.name}
                      </div>
                      <div style={{ fontSize: '14px', color: '#388e3c' }}>
                        حجم: {(uploadedFile.size / 1024 / 1024).toFixed(2)} مگابایت
                      </div>
                    </div>
                    <div style={{
                      padding: '5px 10px',
                      background: '#4caf50',
                      color: 'white',
                      borderRadius: '15px',
                      fontSize: '12px'
                    }}>
                      {uploadedFile.name.split('.').pop().toUpperCase()}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ 
              background: 'white', 
              borderRadius: '12px',
              padding: '30px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>⚙️ تنظیمات تبدیل</h2>
              <ConversionOptions 
                options={conversionOptions}
                onChange={setConversionOptions}
                inputFormat={uploadedFile?.name.split('.').pop()}
              />
              
              <button
                onClick={handleConvert}
                disabled={!uploadedFile || isConverting}
                style={{
                  width: '100%',
                  padding: '18px',
                  background: !uploadedFile || isConverting ? '#95a5a6' : '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: !uploadedFile || isConverting ? 'not-allowed' : 'pointer',
                  marginTop: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                {isConverting ? (
                  <>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    در حال تبدیل...
                  </>
                ) : (
                  '🔄 شروع تبدیل'
                )}
              </button>
            </div>
          </div>

          {/* بخش سمت راست: پیش‌نمایش و نتایج */}
          <div>
            <div style={{ 
              background: 'white', 
              borderRadius: '12px',
              padding: '30px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>👁️ پیش‌نمایش</h2>
              
              <div style={{ 
                flex: 1, 
                background: '#f8f9fa',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '400px',
                marginBottom: '20px'
              }}>
                {previewUrl ? (
                  <ModelPreview file={uploadedFile} previewUrl={previewUrl} />
                ) : (
                  <div style={{ textAlign: 'center', color: '#999' }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎭</div>
                    <p>فایل ۳D خود را آپلود کنید</p>
                    <p style={{ fontSize: '14px', marginTop: '10px' }}>فرمت‌های پشتیبانی شده: OBJ, FBX, STL, GLTF, GLB</p>
                  </div>
                )}
              </div>
              
              {/* نتایج تبدیل */}
              {convertedFile && (
                <div style={{
                  background: '#e3f2fd',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid #bbdefb'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    <div style={{ 
                      background: '#2196f3', 
                      color: 'white',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      marginLeft: '15px'
                    }}>
                      ✓
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                        تبدیل موفقیت‌آمیز
                      </div>
                      <div style={{ fontSize: '14px', color: '#1976d2' }}>
                        فایل شما آماده دانلود است
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '10px',
                    marginBottom: '20px'
                  }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>فرمت خروجی</div>
                      <div style={{ fontWeight: 'bold' }}>{convertedFile.format.toUpperCase()}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>حجم فایل</div>
                      <div style={{ fontWeight: 'bold' }}>
                        {(convertedFile.size / 1024 / 1024).toFixed(2)} مگابایت
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleDownload}
                    style={{
                      width: '100%',
                      padding: '15px',
                      background: '#4caf50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px'
                    }}
                  >
                    ⬇️ دانلود {convertedFile.name}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* اطلاعات فرمت‌ها */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>ℹ️ درباره فرمت‌های ۳D</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#3498db' }}>OBJ</div>
              <div style={{ fontSize: '14px', color: '#666' }}>
                فرمت استاندارد برای مدل‌های سه‌بعدی. سازگار با اکثر نرم‌افزارها.
              </div>
            </div>
            <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#2ecc71' }}>FBX</div>
              <div style={{ fontSize: '14px', color: '#666' }}>
                فرمت اتودسک برای انیمیشن و بازی. شامل انیمیشن و مواد.
              </div>
            </div>
            <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#e74c3c' }}>GLTF/GLB</div>
              <div style={{ fontSize: '14px', color: '#666' }}>
                فرمت استاندارد وب. بهینه برای وب‌سایت‌ها و اپلیکیشن‌های موبایل.
              </div>
            </div>
            <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#f39c12' }}>STL</div>
              <div style={{ fontSize: '14px', color: '#666' }}>
                فرمت استاندارد پرینت سه‌بعدی. فقط شامل هندسه بدون مواد.
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </ShopLayout>
  );
}
