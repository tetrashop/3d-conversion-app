import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'querystring';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

// کاربران پیش‌فرض
const users = {
  "admin": { "password": "admin123", "role": "admin", "name": "مدیر سیستم" },
  "user": { "password": "user123", "role": "user", "name": "کاربر عادی" }
};

// تابع برای ایجاد session
function createSession(username) {
  return Buffer.from(JSON.stringify({
    username: username,
    timestamp: Date.now(),
    role: users[username].role
  })).toString('base64');
}

// تابع برای بررسی session
function checkSession(sessionCookie) {
  if (!sessionCookie) return null;
  try {
    const sessionData = JSON.parse(Buffer.from(sessionCookie, 'base64').toString());
    if (users[sessionData.username] && Date.now() - sessionData.timestamp < 24 * 60 * 60 * 1000) {
      return users[sessionData.username];
    }
  } catch (e) {
    return null;
  }
  return null;
}

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;
  
  // بررسی session
  let user = null;
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split('=');
      acc[name] = value;
      return acc;
    }, {});
    user = checkSession(cookies.session);
  }

  // صفحه ورود
  if (url === '/login' && method === 'GET') {
    if (user) {
      res.writeHead(302, { 'Location': '/' });
      res.end();
      return;
    }
    
    sendHTML(res, `
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
          <meta charset="UTF-8">
          <title>ورود به سیستم تبدیل 3D</title>
          <style>
              body { 
                  font-family: Tahoma, Arial; 
                  margin: 0;
                  padding: 0;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                  min-height: 100vh;
                  display: flex;
                  align-items: center;
                  justify-content: center;
              }
              .login-container {
                  background: rgba(255,255,255,0.1);
                  padding: 40px;
                  border-radius: 15px;
                  backdrop-filter: blur(10px);
                  width: 100%;
                  max-width: 400px;
                  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
              }
              .form-group {
                  margin-bottom: 20px;
              }
              label {
                  display: block;
                  margin-bottom: 8px;
                  font-weight: bold;
              }
              input[type="text"], input[type="password"] {
                  width: 100%;
                  padding: 12px;
                  border: none;
                  border-radius: 8px;
                  background: rgba(255,255,255,0.9);
                  font-size: 16px;
                  box-sizing: border-box;
              }
              button {
                  width: 100%;
                  background: #4CAF50;
                  color: white;
                  border: none;
                  padding: 15px;
                  border-radius: 8px;
                  cursor: pointer;
                  font-size: 18px;
                  font-weight: bold;
                  transition: background 0.3s;
              }
              button:hover {
                  background: #45a049;
              }
              .user-accounts {
                  margin-top: 20px;
                  padding: 15px;
                  background: rgba(255,255,255,0.2);
                  border-radius: 8px;
                  font-size: 14px;
              }
              .error {
                  color: #ff6b6b;
                  background: rgba(255,255,255,0.2);
                  padding: 10px;
                  border-radius: 5px;
                  margin-bottom: 15px;
                  display: none;
              }
          </style>
      </head>
      <body>
          <div class="login-container">
              <h1 style="text-align: center; margin-bottom: 30px;">🔐 ورود به سیستم</h1>
              <h2 style="text-align: center; color: #4CAF50;">تبدیل 2D به 3D</h2>
              
              <div id="errorMessage" class="error"></div>
              
              <form id="loginForm">
                  <div class="form-group">
                      <label for="username">👤 نام کاربری:</label>
                      <input type="text" id="username" name="username" required placeholder="نام کاربری خود را وارد کنید">
                  </div>
                  
                  <div class="form-group">
                      <label for="password">🔒 رمز عبور:</label>
                      <input type="password" id="password" name="password" required placeholder="رمز عبور خود را وارد کنید">
                  </div>
                  
                  <button type="submit">🚀 ورود به سیستم</button>
              </form>
              
              <div class="user-accounts">
                  <h3>👥 حساب‌های تست:</h3>
                  <p><strong>مدیر سیستم:</strong><br>نام کاربری: admin<br>رمز عبور: admin123</p>
                  <p><strong>کاربر عادی:</strong><br>نام کاربری: user<br>رمز عبور: user123</p>
              </div>
          </div>

          <script>
              document.getElementById('loginForm').addEventListener('submit', function(e) {
                  e.preventDefault();
                  
                  const username = document.getElementById('username').value;
                  const password = document.getElementById('password').value;
                  const errorDiv = document.getElementById('errorMessage');
                  
                  if (!username || !password) {
                      errorDiv.textContent = 'لطفا نام کاربری و رمز عبور را وارد کنید';
                      errorDiv.style.display = 'block';
                      return;
                  }
                  
                  const formData = new FormData();
                  formData.append('username', username);
                  formData.append('password', password);
                  
                  fetch('/login', {
                      method: 'POST',
                      body: new URLSearchParams(formData)
                  })
                  .then(response => {
                      if (response.redirected) {
                          window.location.href = response.url;
                      } else {
                          return response.text();
                      }
                  })
                  .then(data => {
                      if (data && data.includes('خطا')) {
                          errorDiv.textContent = 'نام کاربری یا رمز عبور اشتباه است';
                          errorDiv.style.display = 'block';
                      }
                  })
                  .catch(error => {
                      errorDiv.textContent = 'خطا در ارتباط با سرور';
                      errorDiv.style.display = 'block';
                  });
              });
          </script>
      </body>
      </html>
    `);
    return;
  }

  // پردازش لاگین
  if (url === '/login' && method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      const { username, password } = parse(body);
      if (users[username] && users[username].password === password) {
        const session = createSession(username);
        res.writeHead(302, {
          'Location': '/',
          'Set-Cookie': `session=${session}; HttpOnly; Path=/; Max-Age=86400`
        });
        res.end();
      } else {
        res.writeHead(302, { 'Location': '/login' });
        res.end();
      }
    });
    return;
  }

  // خروج
  if (url === '/logout') {
    res.writeHead(302, {
      'Location': '/login',
      'Set-Cookie': 'session=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
    });
    res.end();
    return;
  }

  // اگر کاربر لاگین نکرده
  if (!user && url !== '/login') {
    res.writeHead(302, { 'Location': '/login' });
    res.end();
    return;
  }

  // صفحه اصلی
  if (url === '/') {
    const adminPanel = user.role === 'admin' ? `
      <div style="background: rgba(255,255,255,0.2); padding: 20px; border-radius: 10px; margin: 20px 0;">
        <h3>⚙️ تنظیمات مدیریتی</h3>
        <button onclick="showAdminPanel()">👥 مدیریت کاربران</button>
        <button onclick="showReports()">📊 مشاهده گزارشات</button>
        <button onclick="showSystemSettings()">⚙️ تنظیمات سیستم</button>
      </div>
    ` : '';

    sendHTML(res, `
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
          <meta charset="UTF-8">
          <title>سیستم تبدیل 3D - ${user.name}</title>
          <style>
              body { 
                  font-family: Tahoma, Arial; 
                  margin: 0;
                  padding: 20px;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                  min-height: 100vh;
              }
              .container {
                  max-width: 1200px;
                  margin: 0 auto;
                  background: rgba(255,255,255,0.1);
                  padding: 30px;
                  border-radius: 15px;
                  backdrop-filter: blur(10px);
              }
              .user-info {
                  background: rgba(255,255,255,0.2);
                  padding: 15px;
                  border-radius: 10px;
                  margin-bottom: 20px;
                  border-right: 4px solid #4CAF50;
              }
              button {
                  background: #4CAF50;
                  color: white;
                  border: none;
                  padding: 12px 24px;
                  margin: 5px;
                  border-radius: 8px;
                  cursor: pointer;
                  font-size: 16px;
                  transition: all 0.3s;
              }
              button:hover {
                  background: #45a049;
                  transform: translateY(-2px);
              }
              .logout-btn {
                  background: #ff6b6b;
              }
              .logout-btn:hover {
                  background: #ff5252;
              }
              .secondary-btn {
                  background: #6c757d;
              }
              .secondary-btn:hover {
                  background: #5a6268;
              }
              
              /* استایل‌های بهبود یافته برای input فایل */
              .file-upload-container {
                  background: rgba(255,255,255,0.15);
                  padding: 25px;
                  border-radius: 12px;
                  margin: 20px 0;
                  border: 2px dashed rgba(255,255,255,0.3);
                  transition: all 0.3s;
              }
              .file-upload-container:hover {
                  border-color: #4CAF50;
                  background: rgba(255,255,255,0.2);
              }
              .file-input-wrapper {
                  position: relative;
                  display: inline-block;
                  width: 100%;
                  max-width: 400px;
              }
              .file-input {
                  width: 100%;
                  padding: 15px;
                  background: rgba(255,255,255,0.9);
                  border: 2px solid transparent;
                  border-radius: 8px;
                  font-size: 16px;
                  cursor: pointer;
                  transition: all 0.3s;
              }
              .file-input:hover {
                  background: rgba(255,255,255,1);
                  border-color: #4CAF50;
              }
              .file-input:focus {
                  outline: none;
                  border-color: #4CAF50;
                  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.3);
              }
              .file-info {
                  margin-top: 10px;
                  padding: 10px;
                  background: rgba(255,255,255,0.1);
                  border-radius: 6px;
                  display: none;
              }
              .file-info.show {
                  display: block;
              }
              #result {
                  margin-top: 20px;
                  padding: 15px;
                  border-radius: 8px;
                  background: rgba(255,255,255,0.2);
                  min-height: 50px;
              }
              .preview-container {
                  display: none;
                  margin-top: 30px;
                  background: rgba(0,0,0,0.3);
                  padding: 20px;
                  border-radius: 10px;
              }
              .preview-header {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin-bottom: 15px;
              }
              .model-preview {
                  width: 100%;
                  height: 500px;
                  background: #1a1a1a;
                  border-radius: 8px;
                  position: relative;
                  overflow: hidden;
              }
              .model-stats {
                  display: grid;
                  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                  gap: 10px;
                  margin-top: 15px;
              }
              .stat-box {
                  background: rgba(255,255,255,0.1);
                  padding: 10px;
                  border-radius: 5px;
                  text-align: center;
              }
              .loading-bar {
                  width: 100%;
                  height: 6px;
                  background: rgba(255,255,255,0.2);
                  border-radius: 3px;
                  overflow: hidden;
                  margin: 15px 0;
                  display: none;
              }
              .loading-progress {
                  width: 0%;
                  height: 100%;
                  background: linear-gradient(90deg, #4CAF50, #45a049);
                  transition: width 0.3s;
              }
              
              /* پیش‌نمایش تصویر */
              .image-preview {
                  max-width: 300px;
                  max-height: 200px;
                  border-radius: 8px;
                  margin-top: 10px;
                  display: none;
                  border: 2px solid rgba(255,255,255,0.3);
              }

              /* نمایشگر 3D */
              #modelViewer {
                  width: 100%;
                  height: 100%;
                  border-radius: 8px;
              }
          </style>
          <!-- Three.js Library -->
          <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
          <!-- OrbitControls for Three.js -->
          <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/controls/OrbitControls.js"></script>
          <!-- GLTFLoader for Three.js -->
          <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/loaders/GLTFLoader.js"></script>
      </head>
      <body>
          <div class="container">
              <div class="user-info">
                  <button class="logout-btn" onclick="window.location.href='/logout'">🚪 خروج از سیستم</button>
                  <h2>👋 خوش آمدید، ${user.name}</h2>
                  <p>سطح دسترسی: ${user.role === 'admin' ? 'مدیر سیستم' : 'کاربر عادی'}</p>
              </div>
              
              <h1>🔄 سیستم تبدیل 2D به 3D</h1>
              <p>📍 پورت: ${PORT} | وضعیت: فعال ✅ | آخرین بروزرسانی: ${new Date().toLocaleString('fa-IR')}</p>
              
              <div class="file-upload-container">
                  <h3>📤 آپلود تصویر 2D</h3>
                  
                  <div class="file-input-wrapper">
                      <input type="file" id="imageInput" class="file-input" accept="image/*" onchange="handleFileSelect(this)">
                  </div>
                  
                  <div id="fileInfo" class="file-info">
                      <span id="fileName"></span>
                      <span id="fileSize" style="margin-right: 15px;"></span>
                      <span id="fileType"></span>
                  </div>
                  
                  <img id="imagePreview" class="image-preview" alt="پیش‌نمایش تصویر">
                  
                  <button onclick="convertTo3D()" style="margin-top: 15px;">🚀 شروع تبدیل به مدل 3D</button>
                  
                  <div class="loading-bar" id="loadingBar">
                      <div class="loading-progress" id="loadingProgress"></div>
                  </div>
                  
                  <div id="result"></div>
              </div>
              
              <!-- کامپوننت پیش‌نمایش 3D -->
              <div class="preview-container" id="previewContainer">
                  <div class="preview-header">
                      <h3>🎯 پیش‌نمایش مدل 3D تولید شده</h3>
                      <button class="secondary-btn" onclick="togglePreview()">✖ بستن پیش‌نمایش</button>
                  </div>
                  
                  <div class="model-preview">
                      <div id="modelViewer"></div>
                  </div>
                  
                  <div class="model-stats">
                      <div class="stat-box">
                          <strong>📏 ابعاد مدل</strong>
                          <p id="modelDimensions">256×256×128 واحد</p>
                      </div>
                      <div class="stat-box">
                          <strong>🔢 تعداد vertices</strong>
                          <p id="modelVertices">1,847</p>
                      </div>
                      <div class="stat-box">
                          <strong>🔺 تعداد faces</strong>
                          <p id="modelFaces">3,694</p>
                      </div>
                      <div class="stat-box">
                          <strong>💾 حجم فایل</strong>
                          <p id="modelSize">2.4 MB</p>
                      </div>
                  </div>
                  
                  <div style="margin-top: 15px; text-align: center;">
                      <button onclick="downloadModel()">📥 دانلود فایل OBJ</button>
                      <button onclick="downloadSTL()">📥 دانلود فایل STL</button>
                      <button class="secondary-btn" onclick="shareModel()">📤 اشتراک‌گذاری</button>
                  </div>
              </div>
              
              ${adminPanel}

              <div style="margin-top: 30px; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 10px;">
                  <h3>📊 اطلاعات سیستم</h3>
                  <p>🖥️ سرور: Node.js | 🔒 احراز هویت: فعال | 🌐 پورت: ${PORT}</p>
                  <p>👤 کاربر فعلی: ${user.name} | 🕒 زمان ورود: ${new Date().toLocaleString('fa-IR')}</p>
              </div>
          </div>

          <script>
              let selectedFile = null;
              let scene, camera, renderer, controls;
              
              function handleFileSelect(input) {
                  const file = input.files[0];
                  const fileInfo = document.getElementById('fileInfo');
                  const fileName = document.getElementById('fileName');
                  const fileSize = document.getElementById('fileSize');
                  const fileType = document.getElementById('fileType');
                  const imagePreview = document.getElementById('imagePreview');
                  const resultDiv = document.getElementById('result');
                  
                  if (file) {
                      selectedFile = file;
                      
                      // نمایش اطلاعات فایل
                      fileName.textContent = '📄 ' + file.name;
                      fileSize.textContent = '📊 ' + formatFileSize(file.size);
                      fileType.textContent = '🎨 ' + (file.type.split('/')[1] || 'ناشناخته').toUpperCase();
                      
                      fileInfo.classList.add('show');
                      resultDiv.innerHTML = '';
                      
                      // نمایش پیش‌نمایش تصویر
                      if (file.type.startsWith('image/')) {
                          const reader = new FileReader();
                          reader.onload = function(e) {
                              imagePreview.src = e.target.result;
                              imagePreview.style.display = 'block';
                          };
                          reader.readAsDataURL(file);
                      } else {
                          imagePreview.style.display = 'none';
                      }
                  } else {
                      selectedFile = null;
                      fileInfo.classList.remove('show');
                      imagePreview.style.display = 'none';
                  }
              }
              
              function formatFileSize(bytes) {
                  if (bytes === 0) return '0 Bytes';
                  const k = 1024;
                  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
                  const i = Math.floor(Math.log(bytes) / Math.log(k));
                  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
              }
              
              function convertTo3D() {
                  const resultDiv = document.getElementById('result');
                  const loadingBar = document.getElementById('loadingBar');
                  const loadingProgress = document.getElementById('loadingProgress');
                  
                  if (!selectedFile) {
                      resultDiv.innerHTML = '<p style="color: #ff6b6b;">❌ لطفا یک تصویر انتخاب کنید</p>';
                      return;
                  }
                  
                  resultDiv.innerHTML = '<p>🔄 در حال آنالیز تصویر "' + selectedFile.name + '"...</p>';
                  loadingBar.style.display = 'block';
                  loadingProgress.style.width = '0%';
                  
                  // شبیه‌سازی فرآیند تبدیل با progress bar
                  const progressStages = [
                      { percent: 15, message: '📖 در حال خواندن تصویر...' },
                      { percent: 30, message: '🔍 استخراج ویژگی‌ها و لبه‌ها...' },
                      { percent: 50, message: '🏗️ ساخت اسکلت سه بعدی...' },
                      { percent: 70, message: '🎨 اعمال بافت و نور...' },
                      { percent: 85, message: '⚡ بهینه‌سازی مدل...' },
                      { percent: 95, message: '✅ آماده‌سازی خروجی...' }
                  ];
                  
                  let currentStage = 0;
                  
                  function updateProgress() {
                      if (currentStage < progressStages.length) {
                          const stage = progressStages[currentStage];
                          loadingProgress.style.width = stage.percent + '%';
                          resultDiv.innerHTML = '<p>' + stage.message + '</p>';
                          currentStage++;
                          setTimeout(updateProgress, 800);
                      } else {
                          loadingProgress.style.width = '100%';
                          setTimeout(() => {
                              showConversionResult();
                          }, 500);
                      }
                  }
                  
                  updateProgress();
              }
              
              function showConversionResult() {
                  const resultDiv = document.getElementById('result');
                  const previewContainer = document.getElementById('previewContainer');
                  const loadingBar = document.getElementById('loadingBar');
                  
                  resultDiv.innerHTML = 
                      '<p style="color: #4CAF50; font-weight: bold;">✅ تبدیل با موفقیت انجام شد!</p>' +
                      '<p>📁 فایل خروجی: <strong>model_' + new Date().getTime() + '.obj</strong></p>';
                  
                  // به روزرسانی آمار مدل (مقادیر تصادفی برای نمایش)
                  document.getElementById('modelDimensions').textContent = '256×256×128 واحد';
                  document.getElementById('modelVertices').textContent = Math.floor(Math.random() * 2000 + 1500).toLocaleString();
                  document.getElementById('modelFaces').textContent = Math.floor(Math.random() * 4000 + 3000).toLocaleString();
                  document.getElementById('modelSize').textContent = (Math.random() * 2 + 1.5).toFixed(1) + ' MB';
                  
                  // نمایش پیش‌نمایش
                  previewContainer.style.display = 'block';
                  loadingBar.style.display = 'none';
                  
                  // راه‌اندازی نمایشگر 3D
                  init3DViewer();
                  
                  // اسکرول به بخش پیش‌نمایش
                  previewContainer.scrollIntoView({ behavior: 'smooth' });
              }
              
              function init3DViewer() {
                  const container = document.getElementById('modelViewer');
                  
                  // ایجاد صحنه
                  scene = new THREE.Scene();
                  scene.background = new THREE.Color(0x1a1a1a);
                  
                  // ایجاد دوربین
                  camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
                  camera.position.z = 5;
                  
                  // ایجاد رندرر
                  renderer = new THREE.WebGLRenderer({ antialias: true });
                  renderer.setSize(container.clientWidth, container.clientHeight);
                  renderer.setPixelRatio(window.devicePixelRatio);
                  container.innerHTML = '';
                  container.appendChild(renderer.domElement);
                  
                  // ایجاد کنترل‌های مدل
                  controls = new THREE.OrbitControls(camera, renderer.domElement);
                  controls.enableDamping = true;
                  controls.dampingFactor = 0.05;
                  
                  // اضافه کردن نور
                  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
                  scene.add(ambientLight);
                  
                  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
                  directionalLight.position.set(10, 10, 5);
                  scene.add(directionalLight);
                  
                  // ایجاد یک مدل 3D نمونه (مکعب با بافت)
                  const geometry = new THREE.BoxGeometry(2, 2, 2);
                  
                  // ایجاد متریال با رنگ‌های مختلف برای هر وجه
                  const materials = [
                      new THREE.MeshLambertMaterial({ color: 0xff0000 }), // قرمز
                      new THREE.MeshLambertMaterial({ color: 0x00ff00 }), // سبز
                      new THREE.MeshLambertMaterial({ color: 0x0000ff }), // آبی
                      new THREE.MeshLambertMaterial({ color: 0xffff00 }), // زرد
                      new THREE.MeshLambertMaterial({ color: 0xff00ff }), // بنفش
                      new THREE.MeshLambertMaterial({ color: 0x00ffff })  // فیروزه‌ای
                  ];
                  
                  const cube = new THREE.Mesh(geometry, materials);
                  scene.add(cube);
                  
                  // انیمیشن
                  function animate() {
                      requestAnimationFrame(animate);
                      controls.update();
                      renderer.render(scene, camera);
                  }
                  
                  animate();
                  
                  // مدیریت تغییر سایز پنجره
                  window.addEventListener('resize', () => {
                      camera.aspect = container.clientWidth / container.clientHeight;
                      camera.updateProjectionMatrix();
                      renderer.setSize(container.clientWidth, container.clientHeight);
                  });
              }
              
              function togglePreview() {
                  const previewContainer = document.getElementById('previewContainer');
                  previewContainer.style.display = 'none';
              }
              
              function downloadModel() {
                  alert('✅ فایل OBJ با موفقیت دانلود شد!\\n\\nفایل: model_' + new Date().getTime() + '.obj');
              }
              
              function downloadSTL() {
                  alert('✅ فایل STL با موفقیت دانلود شد!\\n\\nفایل: model_' + new Date().getTime() + '.stl');
              }
              
              function shareModel() {
                  alert('🔗 لینک اشتراک‌گذاری ایجاد شد!\\n\\nمی‌توانید این مدل را با دیگران به اشتراک بگذارید.');
              }
              
              // توابع مدیریتی
              function showAdminPanel() {
                  alert('👥 بخش مدیریت کاربران\\n\\nاین بخش در نسخه کامل در دسترس خواهد بود.');
              }
              
              function showReports() {
                  alert('📊 بخش گزارشات\\n\\nگزارشات کامل از فعالیت‌های سیستم.');
              }
              
              function showSystemSettings() {
                  alert('⚙️ بخش تنظیمات سیستم\\n\\nتنظیمات پیشرفته سیستم تبدیل 3D.');
              }
          </script>
      </body>
      </html>
    `);
    return;
  }

  // 404
  sendHTML(res, '<h1>صفحه مورد نظر یافت نشد</h1>', 404);
});

function sendHTML(res, content, statusCode = 200) {
  res.writeHead(statusCode, {
    'Content-Type': 'text/html; charset=utf-8'
  });
  res.end(content);
}

server.listen(PORT, () => {
  console.log(`
🎉 سیستم تبدیل 3D با نمایشگر واقعی راه‌اندازی شد
📍 پورت: ${PORT}
👤 کاربران: admin/admin123 - user/user123
🌐 آدرس: http://localhost:${PORT}
  `);
});

export default server;
