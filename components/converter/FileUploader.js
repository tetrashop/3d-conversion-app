import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

export default function FileUploader({ onFileUpload }) {
  const [dragActive, setDragActive] = useState(false);
  
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // بررسی فرمت فایل
      const allowedFormats = ['.obj', '.fbx', '.stl', '.gltf', '.glb', '.blend', '.3ds', '.dae'];
      const fileExt = '.' + file.name.split('.').pop().toLowerCase();
      
      if (!allowedFormats.includes(fileExt)) {
        alert('❌ فرمت فایل پشتیبانی نمی‌شود. لطفاً فایل ۳D معتبر آپلود کنید.');
        return;
      }
      
      // بررسی حجم فایل (حداکثر 50MB)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        alert('❌ حجم فایل بیش از حد مجاز است (حداکثر 50 مگابایت).');
        return;
      }
      
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'model/obj': ['.obj'],
      'model/fbx': ['.fbx'],
      'model/stl': ['.stl'],
      'model/gltf+json': ['.gltf'],
      'model/gltf-binary': ['.glb'],
      'application/x-blender': ['.blend'],
      'application/x-3ds': ['.3ds'],
      'model/vnd.collada+xml': ['.dae']
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  const handleClick = () => {
    document.getElementById('file-input').click();
  };

  return (
    <div
      {...getRootProps()}
      style={{
        border: `2px dashed ${isDragActive ? '#3498db' : '#ddd'}`,
        borderRadius: '12px',
        padding: '40px 20px',
        textAlign: 'center',
        background: isDragActive ? '#f0f8ff' : '#fafafa',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}
      onClick={handleClick}
    >
      <input {...getInputProps()} id="file-input" />
      
      <div style={{ fontSize: '48px', marginBottom: '20px' }}>
        📤
      </div>
      
      <h3 style={{ marginBottom: '10px', color: '#2c3e50' }}>
        {isDragActive ? 'فایل را رها کنید' : 'فایل ۳D خود را آپلود کنید'}
      </h3>
      
      <p style={{ color: '#666', marginBottom: '20px' }}>
        فایل را به اینجا بکشید یا برای انتخاب فایل کلیک کنید
      </p>
      
      <div style={{
        display: 'inline-block',
        padding: '12px 30px',
        background: '#3498db',
        color: 'white',
        borderRadius: '8px',
        fontWeight: 'bold',
        fontSize: '16px'
      }}>
        انتخاب فایل
      </div>
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#999' }}>
        فرمت‌های پشتیبانی شده: OBJ, FBX, STL, GLTF, GLB, BLEND, 3DS, DAE
        <br />
        حداکثر حجم: 50 مگابایت
      </div>
    </div>
  );
}
