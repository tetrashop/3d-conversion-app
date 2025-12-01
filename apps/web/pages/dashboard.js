import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Cylinder, Environment, Html } from '@react-three/drei';
import { Upload, Download, Settings, Play, RefreshCw, Cube, User, LogOut, BarChart3, CloudUpload, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

// ==================== کامپوننت‌های 3D واقعی ====================
function RotatingModel({ type, color = '#4CAF50', scale = 1 }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.7;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.3;
    }
  });

  const getModel = () => {
    switch(type) {
      case 'box':
        return <Box ref={meshRef} args={[1.5, 1.5, 1.5]} scale={scale}>
          <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
        </Box>;
      case 'sphere':
        return <Sphere ref={meshRef} args={[1, 64, 64]} scale={scale}>
          <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
        </Sphere>;
      case 'cylinder':
        return <Cylinder ref={meshRef} args={[1, 1, 2, 32]} scale={scale}>
          <meshStandardMaterial color={color} metalness={0.7} roughness={0.2} />
        </Cylinder>;
      default:
        return <Box ref={meshRef} args={[1, 1, 1]} scale={scale}>
          <meshStandardMaterial color={color} />
        </Box>;
    }
  };

  return getModel();
}

function ModelScene({ modelType, isConverting = false }) {
  const { gl } = useThree();
  
  const captureScreenshot = useCallback(() => {
    const link = document.createElement('a');
    link.download = `3d-model-${Date.now()}.png`;
    link.href = gl.domElement.toDataURL('image/png');
    link.click();
  }, [gl]);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      <RotatingModel type={modelType} color={isConverting ? '#FF9800' : '#4CAF50'} scale={isConverting ? 1.2 : 1} />
      
      <OrbitControls 
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        zoomSpeed={0.6}
        panSpeed={0.8}
        rotateSpeed={0.8}
      />
      
      <gridHelper args={[10, 10]} rotation={[Math.PI / 2, 0, 0]} />
      <axesHelper args={[5]} />
      
      <Html position={[0, -2, 0]}>
        <button 
          onClick={captureScreenshot}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}
        >
          📸 ذخیره عکس
        </button>
      </Html>
      
      <Environment preset="city" />
    </>
  );
}

// ==================== کامپوننت اصلی Dashboard ====================
export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [conversionStatus, setConversionStatus] = useState('idle'); // idle, uploading, processing, done, error
  const [modelType, setModelType] = useState('box');
  const [conversionResult, setConversionResult] = useState(null);
  const [conversionHistory, setConversionHistory] = useState([]);
  const [systemStats, setSystemStats] = useState({
    onlineUsers: 3,
    todayConversions: 0,
    serverStatus: '100%',
    avgTime: '1.2s'
  });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef();
  const router = useRouter();

  // ==================== توابع کاربری ====================
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      router.push('/login');
      return;
    }
    try {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      // بارگذاری تاریخچه از localStorage
      const savedHistory = localStorage.getItem('conversionHistory');
      if (savedHistory) {
        setConversionHistory(JSON.parse(savedHistory));
      }
    } catch (err) {
      localStorage.clear();
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
      setConversionStatus('idle');
      setConversionResult(null);
    } else {
      alert('لطفاً فقط فایل تصویری انتخاب کنید!');
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setConversionStatus('idle');
      setConversionResult(null);
    }
  };

  const simulateRealConversion = async () => {
    if (!file) {
      alert('لطفاً ابتدا یک فایل تصویری انتخاب کنید');
      return;
    }

    setConversionStatus('uploading');
    
    // شبیه‌سازی آپلود با API واقعی
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      // در حالت واقعی، اینجا درخواست POST به سرور ارسال می‌شود
      for (let i = 0; i <= 100; i += 5) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadProgress(i);
      }

      setConversionStatus('processing');
      
      // شبیه‌سازی پردازش 3D
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // نتیجه موفقیت‌آمیز
      const result = {
        id: Date.now(),
        fileName: file.name,
        originalSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        modelSize: '3.2 MB',
        vertices: '12,548',
        triangles: '24,096',
        dimensions: '512×384×256',
        format: 'OBJ + GLTF',
        quality: 'High',
        processingTime: '3.2s',
        downloadUrl: '#',
        timestamp: new Date().toLocaleString('fa-IR'),
        modelType: ['box', 'sphere', 'cylinder'][Math.floor(Math.random() * 3)]
      };
      
      setConversionResult(result);
      setModelType(result.modelType);
      setConversionStatus('done');
      
      // اضافه کردن به تاریخچه
      const newHistory = [result, ...conversionHistory.slice(0, 4)];
      setConversionHistory(newHistory);
      localStorage.setItem('conversionHistory', JSON.stringify(newHistory));
      
      // به‌روزرسانی آمار
      setSystemStats(prev => ({
        ...prev,
        todayConversions: prev.todayConversions + 1,
        avgTime: ((parseFloat(prev.avgTime) + 3.2) / 2).toFixed(1) + 's'
      }));
      
    } catch (error) {
      console.error('Conversion error:', error);
      setConversionStatus('error');
      alert('خطا در پردازش فایل! لطفاً دوباره تلاش کنید.');
    }
  };

  const downloadModel = () => {
    if (conversionResult) {
      alert(`مدل ${conversionResult.fileName} آماده دانلود است!\nفرمت: ${conversionResult.format}\nکیفیت: ${conversionResult.quality}`);
      // در حالت واقعی، اینجا فایل دانلود می‌شود
    }
  };

  const resetProcess = () => {
    setFile(null);
    setUploadProgress(0);
    setConversionStatus('idle');
    setConversionResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // ==================== رندر UI ====================
  if (!user) {
    return (
      <div style={styles.loadingContainer}>
        <div className="spinner-large"></div>
        <p style={{ marginTop: '20px', fontSize: '18px' }}>در حال احراز هویت...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* هدر */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logoContainer}>
            <Cube size={32} style={{ marginRight: '10px' }} />
            <div>
              <h1 style={styles.logoTitle}>🧠 سیستم تبدیل هوشمند 3D</h1>
              <p style={styles.logoSubtitle}>تبدیل پیشرفته تصاویر 2D به مدل‌های سه‌بعدی با کیفیت</p>
            </div>
          </div>
        </div>
        
        <div style={styles.headerRight}>
          <div style={styles.userProfile}>
            <div style={styles.userAvatar}>
              <User size={20} />
            </div>
            <div style={styles.userInfo}>
              <div style={styles.userName}>{user.name || 'کاربر'}</div>
              <div style={styles.userRole}>{user.role === 'admin' ? 'مدیر سیستم' : 'کاربر ویژه'}</div>
            </div>
          </div>
          
          <button onClick={handleLogout} style={styles.logoutBtn}>
            <LogOut size={18} />
            <span>خروج</span>
          </button>
        </div>
      </header>

      {/* محتوای اصلی */}
      <main style={styles.mainContent}>
        <div style={styles.dashboardGrid}>
          {/* ستون سمت چپ - کنترل‌ها */}
          <div style={styles.leftPanel}>
            {/* کارت آپلود */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <CloudUpload size={24} />
                <h2 style={styles.cardTitle}>آپلود تصویر</h2>
              </div>
              
              <div 
                style={{
                  ...styles.uploadZone,
                  borderColor: isDragging ? '#4CAF50' : '#ddd',
                  background: isDragging ? 'rgba(76, 175, 80, 0.05)' : 'white'
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*,.png,.jpg,.jpeg,.webp"
                  style={{ display: 'none' }}
                />
                
                <div style={styles.uploadContent}>
                  <CloudUpload size={64} color={isDragging ? '#4CAF50' : '#999'} />
                  <p style={styles.uploadText}>
                    {isDragging ? 'فایل را رها کنید!' : 'فایل را بکشید و رها کنید'}
                  </p>
                  <p style={styles.uploadHint}>یا</p>
                  
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    style={styles.browseBtn}
                  >
                    انتخاب فایل از دستگاه
                  </button>
                  
                  <p style={styles.fileTypes}>پشتیبانی از: PNG, JPG, JPEG, WEBP (حداکثر 10MB)</p>
                </div>
                
                {file && (
                  <div style={styles.filePreview}>
                    <div style={styles.fileIcon}>🖼️</div>
                    <div style={styles.fileDetails}>
                      <div style={styles.fileName}>{file.name}</div>
                      <div style={styles.fileMeta}>
                        <span>{formatFileSize(file.size)}</span>
                        <span>•</span>
                        <span>{file.type.split('/')[1]?.toUpperCase()}</span>
                      </div>
                    </div>
                    <button 
                      onClick={resetProcess}
                      style={styles.removeFileBtn}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
              
              {/* نوار پیشرفت */}
              {conversionStatus === 'uploading' && (
                <div style={styles.progressContainer}>
                  <div style={styles.progressHeader}>
                    <span>در حال آپلود...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div style={styles.progressBar}>
                    <div 
                      style={{
                        ...styles.progressFill,
                        width: `${uploadProgress}%`,
                        background: 'linear-gradient(90deg, #4CAF50, #8BC34A)'
                      }}
                    />
                  </div>
                </div>
              )}
              
              {/* کنترل‌ها */}
              <div style={styles.actionButtons}>
                <button
                  onClick={simulateRealConversion}
                  disabled={!file || conversionStatus === 'uploading' || conversionStatus === 'processing'}
                  style={{
                    ...styles.primaryBtn,
                    opacity: (!file || conversionStatus === 'uploading' || conversionStatus === 'processing') ? 0.6 : 1,
                    background: conversionStatus === 'processing' 
                      ? 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)'
                      : 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)'
                  }}
                >
                  {conversionStatus === 'processing' ? (
                    <>
                      <div className="spinner-small"></div>
                      <span>در حال پردازش...</span>
                    </>
                  ) : (
                    <>
                      <Play size={20} />
                      <span>شروع تبدیل 3D</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={resetProcess}
                  style={styles.secondaryBtn}
                >
                  <RefreshCw size={20} />
                  <span>شروع مجدد</span>
                </button>
              </div>
            </div>
            
            {/* وضعیت تبدیل */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <Settings size={24} />
                <h2 style={styles.cardTitle}>وضعیت تبدیل</h2>
              </div>
              
              <div style={styles.statusSteps}>
                {[
                  { id: 1, label: 'انتخاب فایل', active: !!file },
                  { id: 2, label: 'آپلود', active: ['uploading', 'processing', 'done', 'error'].includes(conversionStatus) },
                  { id: 3, label: 'پردازش 3D', active: ['processing', 'done', 'error'].includes(conversionStatus) },
                  { id: 4, label: 'تکمیل', active: ['done', 'error'].includes(conversionStatus) }
                ].map((step, index, arr) => (
                  <div key={step.id} style={styles.statusStep}>
                    <div style={{
                      ...styles.statusDot,
                      background: step.active 
                        ? (conversionStatus === 'error' && step.id === 4 ? '#f44336' : '#4CAF50')
                        : '#e0e0e0',
                      color: step.active ? 'white' : '#999',
                      border: conversionStatus === 'error' && step.id === 4 ? '2px solid #f44336' : 'none'
                    }}>
                      {step.active ? (conversionStatus === 'error' && step.id === 4 ? '!' : '✓') : step.id}
                    </div>
                    <div style={styles.statusLabel}>{step.label}</div>
                    {index < arr.length - 1 && (
                      <div style={{
                        ...styles.statusLine,
                        background: arr[index + 1].active ? '#4CAF50' : '#e0e0e0'
                      }} />
                    )}
                  </div>
                ))}
              </div>
              
              {/* نتایج */}
              {conversionResult && (
                <div style={styles.resultCard}>
                  <div style={styles.resultHeader}>
                    <CheckCircle size={28} color="#4CAF50" />
                    <h3 style={styles.resultTitle}>تبدیل موفقیت‌آمیز!</h3>
                  </div>
                  
                  <div style={styles.resultDetails}>
                    <div style={styles.resultRow}>
                      <span>نام فایل:</span>
                      <strong>{conversionResult.fileName}</strong>
                    </div>
                    <div style={styles.resultRow}>
                      <span>کیفیت:</span>
                      <strong style={{
                        color: conversionResult.quality === 'High' ? '#4CAF50' : 
                               conversionResult.quality === 'Medium' ? '#FF9800' : '#2196F3'
                      }}>
                        {conversionResult.quality}
                      </strong>
                    </div>
                    <div style={styles.resultRow}>
                      <span>فرمت‌ها:</span>
                      <strong>{conversionResult.format}</strong>
                    </div>
                    <div style={styles.resultRow}>
                      <span>تعداد vertices:</span>
                      <strong>{conversionResult.vertices}</strong>
                    </div>
                    <div style={styles.resultRow}>
                      <span>زمان پردازش:</span>
                      <strong>{conversionResult.processingTime}</strong>
                    </div>
                    <div style={styles.resultRow}>
                      <span>تاریخ:</span>
                      <strong>{conversionResult.timestamp}</strong>
                    </div>
                  </div>
                  
                  <div style={styles.resultActions}>
                    <button onClick={downloadModel} style={styles.downloadBtn}>
                      <Download size={20} />
                      <span>دانلود مدل 3D</span>
                    </button>
                    
                    <button 
                      onClick={() => setModelType(conversionResult.modelType)}
                      style={styles.viewBtn}
                    >
                      <Cube size={20} />
                      <span>مشاهده در نمایشگر</span>
                    </button>
                  </div>
                </div>
              )}
              
              {conversionStatus === 'error' && (
                <div style={styles.errorCard}>
                  <AlertCircle size={28} color="#f44336" />
                  <h3 style={styles.errorTitle}>خطا در پردازش</h3>
                  <p>متأسفانه در تبدیل فایل مشکلی پیش آمده. لطفاً فایل دیگری را امتحان کنید.</p>
                  <button onClick={resetProcess} style={styles.retryBtn}>
                    تلاش مجدد
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* ستون سمت راست - پیش‌نمایش و آمار */}
          <div style={styles.rightPanel}>
            {/* نمایشگر 3D */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <Cube size={24} />
                <h2 style={styles.cardTitle}>پیش‌نمایش مدل 3D</h2>
                <div style={styles.modelTypeBadge}>
                  {modelType === 'box' ? 'مکعب' : 
                   modelType === 'sphere' ? 'کره' : 'استوانه'}
                </div>
              </div>
              
              <div style={styles.canvasContainer}>
                <Canvas
                  camera={{ position: [0, 0, 5], fov: 50 }}
                  style={styles.canvas}
                  shadows
                >
                  <ModelScene 
                    modelType={modelType} 
                    isConverting={conversionStatus === 'processing'}
                  />
                </Canvas>
                
                <div style={styles.canvasOverlay}>
                  <div style={styles.canvasControls}>
                    <button 
                      onClick={() => setModelType('box')}
                      style={{
                        ...styles.modelTypeBtn,
                        background: modelType === 'box' ? '#4CAF50' : 'rgba(255,255,255,0.9)',
                        color: modelType === 'box' ? 'white' : '#333'
                      }}
                    >
                      مکعب
                    </button>
                    <button 
                      onClick={() => setModelType('sphere')}
                      style={{
                        ...styles.modelTypeBtn,
                        background: modelType === 'sphere' ? '#2196F3' : 'rgba(255,255,255,0.9)',
                        color: modelType === 'sphere' ? 'white' : '#333'
                      }}
                    >
                      کره
                    </button>
                    <button 
                      onClick={() => setModelType('cylinder')}
                      style={{
                        ...styles.modelTypeBtn,
                        background: modelType === 'cylinder' ? '#FF9800' : 'rgba(255,255,255,0.9)',
                        color: modelType === 'cylinder' ? 'white' : '#333'
                      }}
                    >
                      استوانه
                    </button>
                  </div>
                  
                  <div style={styles.canvasInstructions}>
                    <h4>🎮 راهنمای کنترل:</h4>
                    <ul>
                      <li><strong>چرخش:</strong> کلیک و درگ</li>
                      <li><strong>زوم:</strong> اسکرول ماوس</li>
                      <li><strong>حرکت:</strong> کلیک راست + درگ</li>
                      <li><strong>تنظیم مجدد:</strong> دابل کلیک</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            {/* آمار و تاریخچه */}
            <div style={styles.statsGrid}>
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>📊 آمار سیستم</h3>
                <div style={styles.statsContainer}>
                  {[
                    { label: 'کاربران آنلاین', value: systemStats.onlineUsers, color: '#4CAF50' },
                    { label: 'تبدیل امروز', value: systemStats.todayConversions, color: '#2196F3' },
                    { label: 'وضعیت سرور', value: systemStats.serverStatus, color: '#8BC34A' },
                    { label: 'میانگین زمان', value: systemStats.avgTime, color: '#FF9800' }
                  ].map((stat, idx) => (
                    <div key={idx} style={styles.statItem}>
                      <div style={{ ...styles.statIcon, background: stat.color + '20', color: stat.color }}>
                        {idx === 0 ? '👥' : idx === 1 ? '🔄' : idx === 2 ? '🟢' : '⏱️'}
                      </div>
                      <div style={styles.statContent}>
                        <div style={styles.statValue}>{stat.value}</div>
                        <div style={styles.statLabel}>{stat.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {conversionHistory.length > 0 && (
                <div style={styles.card}>
                  <h3 style={styles.cardTitle}>📜 تاریخچه تبدیل‌ها</h3>
                  <div style={styles.historyList}>
                    {conversionHistory.slice(0, 3).map((item) => (
                      <div key={item.id} style={styles.historyItem}>
                        <div style={styles.historyIcon}>
                          {item.modelType === 'box' ? '🟦' : 
                           item.modelType === 'sphere' ? '🔴' : '🟧'}
                        </div>
                        <div style={styles.historyContent}>
                          <div style={styles.historyName}>{item.fileName}</div>
                          <div style={styles.historyMeta}>
                            <span>{item.format.split('+')[0]}</span>
                            <span>•</span>
                            <span>{item.timestamp.split('،')[0]}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {conversionHistory.length > 3 && (
                    <button style={styles.viewAllBtn}>
                      مشاهده همه ({conversionHistory.length})
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* فوتر */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <p>© ۱۴۰۲ سیستم تبدیل هوشمند 3D | نسخه ۲.۱.۰</p>
          <p>🔄 توسعه‌یافته با Next.js، Three.js و React Three Fiber</p>
          <div style={styles.footerLinks}>
            <a href="#" style={styles.footerLink}>مستندات</a>
            <span>•</span>
            <a href="#" style={styles.footerLink}>پشتیبانی</a>
            <span>•</span>
            <a href="#" style={styles.footerLink}>API</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ==================== استایل‌ها ====================
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    fontFamily: "'Vazirmatn', 'Segoe UI', Tahoma, sans-serif",
    direction: 'rtl'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white'
  },
  header: {
    background: 'white',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
    borderBottom: '3px solid linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center'
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  logoTitle: {
    fontSize: '20px',
    color: '#333',
    margin: '0',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  logoSubtitle: {
    fontSize: '12px',
    color: '#666',
    margin: '3px 0 0 0'
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '25px'
  },
  userProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 15px',
    background: '#f8f9fa',
    borderRadius: '50px',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  userAvatar: {
    width: '36px',
    height: '36px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white'
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column'
  },
  userName: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: '14px'
  },
  userRole: {
    fontSize: '11px',
    color: '#666'
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#ff6b6b',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'transform 0.2s'
  },
  mainContent: {
    padding: '30px',
    maxWidth: '1600px',
    margin: '0 auto'
  },
  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
    '@media (max-width: 1200px)': {
      gridTemplateColumns: '1fr'
    }
  },
  leftPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px'
  },
  rightPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px'
  },
  card: {
    background: 'white',
    padding: '25px',
    borderRadius: '20px',
    boxShadow: '0 5px 25px rgba(0,0,0,0.05)',
    border: '1px solid #eee',
    transition: 'transform 0.3s, box-shadow 0.3s'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '25px',
    color: '#333'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '0',
    color: '#333'
  },
  uploadZone: {
    border: '2px dashed #ddd',
    borderRadius: '15px',
    padding: '40px 20px',
    textAlign: 'center',
    transition: 'all 0.3s',
    marginBottom: '20px'
  },
  uploadContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px'
  },
  uploadText: {
    fontSize: '16px',
    color: '#666',
    margin: '0'
  },
  uploadHint: {
    fontSize: '14px',
    color: '#999',
    margin: '0'
  },
  browseBtn: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'transform 0.2s'
  },
  fileTypes: {
    fontSize: '12px',
    color: '#999',
    margin: '15px 0 0 0'
  },
  filePreview: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    background: '#f8f9fa',
    padding: '15px',
    borderRadius: '12px',
    marginTop: '20px',
    animation: 'slideIn 0.3s ease-out'
  },
  fileIcon: {
    fontSize: '24px'
  },
  fileDetails: {
    flex: 1,
    textAlign: 'right'
  },
  fileName: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: '14px',
    marginBottom: '4px'
  },
  fileMeta: {
    display: 'flex',
    gap: '8px',
    fontSize: '12px',
    color: '#666'
  },
  removeFileBtn: {
    background: '#ffebee',
    color: '#f44336',
    border: 'none',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  progressContainer: {
    margin: '25px 0'
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px'
  },
  progressBar: {
    height: '10px',
    background: '#f0f0f0',
    borderRadius: '5px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    transition: 'width 0.3s'
  },
  actionButtons: {
    display: 'flex',
    gap: '15px',
    marginTop: '25px'
  },
  primaryBtn: {
    flex: 1,
    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
    color: 'white',
    border: 'none',
    padding: '16px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    transition: 'transform 0.2s, opacity 0.3s'
  },
  secondaryBtn: {
    flex: 1,
    background: '#f5f5f5',
    color: '#333',
    border: '1px solid #ddd',
    padding: '16px',
    borderRadius: '12px',
    fontSize: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    transition: 'all 0.3s'
  },
  statusSteps: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '30px 0',
    position: 'relative'
  },
  statusStep: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    flex: 1,
    position: 'relative',
    zIndex: 1
  },
  statusDot: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '16px',
    transition: 'all 0.3s',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
  },
  statusLabel: {
    fontSize: '12px',
    color: '#666',
    textAlign: 'center'
  },
  statusLine: {
    position: 'absolute',
    top: '20px',
    height: '4px',
    width: '100%',
    right: '50%',
    zIndex: 0,
    transition: 'background 0.3s'
  },
  resultCard: {
    background: 'linear-gradient(135deg, #f0f9ff 0%, #e3f2fd 100%)',
    padding: '25px',
    borderRadius: '15px',
    borderLeft: '5px solid #2196F3',
    marginTop: '20px',
    animation: 'slideIn 0.5s ease-out'
  },
  resultHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '20px'
  },
  resultTitle: {
    color: '#2196F3',
    margin: '0',
    fontSize: '18px'
  },
  resultDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '25px'
  },
  resultRow: {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px dashed #90caf9',
    paddingBottom: '10px',
    fontSize: '14px'
  },
  resultActions: {
    display: 'flex',
    gap: '15px'
  },
  downloadBtn: {
    flex: 2,
    background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
    color: 'white',
    border: 'none',
    padding: '14px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    transition: 'transform 0.2s'
  },
  viewBtn: {
    flex: 1,
    background: 'rgba(33, 150, 243, 0.1)',
    color: '#2196F3',
    border: '1px solid #2196F3',
    padding: '14px',
    borderRadius: '10px',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    transition: 'all 0.3s'
  },
  errorCard: {
    background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
    padding: '25px',
    borderRadius: '15px',
    borderLeft: '5px solid #f44336',
    marginTop: '20px',
    textAlign: 'center'
  },
  errorTitle: {
    color: '#f44336',
    margin: '15px 0 10px 0'
  },
  retryBtn: {
    background: '#f44336',
    color: 'white',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '8px',
    marginTop: '15px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  canvasContainer: {
    position: 'relative',
    borderRadius: '15px',
    overflow: 'hidden',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
  },
  canvas: {
    width: '100%',
    height: '450px',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
  },
  canvasOverlay: {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    left: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  canvasControls: {
    display: 'flex',
    gap: '10px',
    background: 'rgba(255,255,255,0.9)',
    padding: '10px',
    borderRadius: '10px',
    backdropFilter: 'blur(10px)'
  },
  modelTypeBtn: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'all 0.3s'
  },
  modelTypeBadge: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    marginRight: 'auto'
  },
  canvasInstructions: {
    background: 'rgba(0,0,0,0.7)',
    color: 'white',
    padding: '15px',
    borderRadius: '10px',
    fontSize: '12px',
    maxWidth: '200px',
    backdropFilter: 'blur(10px)'
  },
  statsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px'
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
    marginTop: '15px'
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '20px',
    background: '#f8f9fa',
    borderRadius: '15px',
    transition: 'transform 0.2s'
  },
  statIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px'
  },
  statContent: {
    display: 'flex',
    flexDirection: 'column'
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333'
  },
  statLabel: {
    fontSize: '12px',
    color: '#666',
    marginTop: '5px'
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginTop: '20px'
  },
  historyItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    background: '#f8f9fa',
    borderRadius: '12px',
    transition: 'transform 0.2s'
  },
  historyIcon: {
    fontSize: '24px'
  },
  historyContent: {
    flex: 1,
    textAlign: 'right'
  },
  historyName: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: '14px',
    marginBottom: '4px'
  },
  historyMeta: {
    display: 'flex',
    gap: '8px',
    fontSize: '12px',
    color: '#666'
  },
  viewAllBtn: {
    width: '100%',
    background: 'transparent',
    color: '#667eea',
    border: '1px solid #667eea',
    padding: '12px',
    borderRadius: '10px',
    marginTop: '15px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'all 0.3s'
  },
  footer: {
    background: 'white',
    padding: '30px',
    textAlign: 'center',
    borderTop: '1px solid #eee',
    marginTop: '50px'
  },
  footerContent: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  footerLinks: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    marginTop: '15px',
    fontSize: '14px'
  },
  footerLink: {
    color: '#667eea',
    textDecoration: 'none'
  }
};

// اضافه کردن استایل‌های CSS برای انیمیشن‌ها
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .spinner-large {
      width: 60px;
      height: 60px;
      border: 5px solid rgba(255,255,255,0.3);
      border-top: 5px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 20px;
    }
    .spinner-small {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    }
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 35px rgba(0,0,0,0.1);
    }
    .stat-item:hover, .history-item:hover {
      transform: translateY(-3px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    .user-profile:hover {
      background: #e9ecef;
      transform: translateY(-2px);
    }
  `;
  document.head.appendChild(style);
}
