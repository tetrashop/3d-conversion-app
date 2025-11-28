<<<<<<< HEAD
#!/usr/bin/env python3
from http.server import HTTPServer, SimpleHTTPRequestHandler
import json

class APIHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/api/status':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            response = {
                "status": "operational",
                "message": "API is running locally",
                "timestamp": "2024-01-01 12:00:00",
                "services": {
                    "main": "active",
                    "database": "connected"
                }
            }
            self.wfile.write(json.dumps(response).encode())
        else:
            super().do_GET()

print("🚀 سرور ساده در حال اجرا روی پورت 8000...")
print("📱 برو به: http://localhost:8000/api/status")
httpd = HTTPServer(('localhost', 8000), APIHandler)
httpd.serve_forever()
||||||| parent of 230c3731 (fix: remove sqlite3 and prepare for vercel postgres)
=======
import http.server
import socketserver
import os

PORT = 8081

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.end_headers()
            
            html_content = '''
            <!DOCTYPE html>
            <html dir="rtl" lang="fa">
            <head>
                <meta charset="UTF-8">
                <title>پنل تبدیل 3D - پورت 8081</title>
                <style>
                    body { 
                        font-family: Tahoma, Arial, sans-serif; 
                        margin: 0; 
                        padding: 40px; 
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                    }
                    .container {
                        max-width: 800px;
                        margin: 0 auto;
                        background: rgba(255,255,255,0.1);
                        padding: 30px;
                        border-radius: 15px;
                        backdrop-filter: blur(10px);
                    }
                    .nav {
                        display: flex;
                        justify-content: center;
                        gap: 15px;
                        margin: 20px 0;
                    }
                    .nav a {
                        color: white;
                        text-decoration: none;
                        padding: 10px 20px;
                        border: 2px solid white;
                        border-radius: 25px;
                        transition: all 0.3s;
                    }
                    .nav a:hover {
                        background: white;
                        color: #667eea;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>🔄 پنل تبدیل 3D فعال است</h1>
                    <p>📍 پورت: <strong>8081</strong></p>
                    <p>✅ سیستم تبدیل فایل‌های سه‌بعدی آماده به کار</p>
                    
                    <div class="nav">
                        <a href="http://localhost:3000">🛍️ فروشگاه</a>
                        <a href="http://localhost:8081">🔄 تبدیل 3D</a>
                        <a href="http://localhost:3002">⚙️ مدیریت</a>
                    </div>
                    
                    <div style="margin-top: 30px; padding: 20px; background: rgba(255,255,255,0.2); border-radius: 10px;">
                        <h3>📤 آپلود فایل 3D</h3>
                        <p>فرمت‌های پشتیبانی شده: OBJ, STL, FBX, GLTF, GLB</p>
                        <p>سیستم تبدیل خودکار بین فرمت‌های مختلف</p>
                    </div>
                </div>
            </body>
            </html>
            '''
            self.wfile.write(html_content.encode('utf-8'))
        else:
            super().do_GET()

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"🔄 پنل تبدیل 3D راه‌اندازی شد")
    print(f"📍 آدرس: http://localhost:{PORT}")
    print(f"🚀 وضعیت: فعال")
    print("=" * 50)
    httpd.serve_forever()
>>>>>>> 230c3731 (fix: remove sqlite3 and prepare for vercel postgres)
