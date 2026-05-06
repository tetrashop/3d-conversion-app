import { useState, useCallback } from 'react';

export default function FileUploader({ onFileUpload, acceptedFormats, maxSize }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // اعتبارسنجی فرمت (در صورت تعیین)
      if (acceptedFormats) {
        const ext = file.name.split('.').pop().toLowerCase();
        const allowed = acceptedFormats.map(f => f.replace('.', ''));
        if (!allowed.includes(ext)) {
          setError(`فرمت فایل پشتیبانی نمی‌شود. فرمت‌های مجاز: ${acceptedFormats.join(', ')}`);
          setSelectedFile(null);
          return;
        }
      }

      // اعتبارسنجی حجم (در صورت تعیین)
      if (maxSize && file.size > maxSize) {
        setError(`حجم فایل بیش از حد مجاز است (حداکثر ${(maxSize / 1024 / 1024).toFixed(2)} MB)`);
        setSelectedFile(null);
        return;
      }

      setError('');
      setSelectedFile(file);
      if (onFileUpload) onFileUpload(file);
    },
    [onFileUpload, acceptedFormats, maxSize]
  );

  const removeFile = () => {
    setSelectedFile(null);
    if (onFileUpload) onFileUpload(null);
  };

  return (
    <div>
      <label
        htmlFor="file-upload"
        style={{
          display: 'block',
          border: '2px dashed #ccc',
          borderRadius: '10px',
          padding: '30px',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: '#f9f9f9',
          marginBottom: '10px',
        }}
      >
        {selectedFile ? (
          <div>
            <strong>{selectedFile.name}</strong>
            <br />
            <span style={{ color: '#666' }}>
              {(selectedFile.size / 1024).toFixed(2)} KB
            </span>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '2rem' }}>📁</div>
            <p>فایل 3D خود را بکشید و رها کنید یا کلیک کنید</p>
          </div>
        )}
        <input
          id="file-upload"
          type="file"
          accept={acceptedFormats ? acceptedFormats.join(',') : '.obj,.stl,.fbx,.gltf,.glb,.blend,.3ds,.dae'}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </label>

      {error && (
        <p style={{ color: 'red', fontSize: '0.9rem' }}>❌ {error}</p>
      )}

      {selectedFile && (
        <button
          type="button"
          onClick={removeFile}
          style={{
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '5px 15px',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          حذف فایل
        </button>
      )}
    </div>
  );
}
