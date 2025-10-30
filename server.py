import http.server
import socketserver
import os

class CORSRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

PORT = 8000

with socketserver.TCPServer(("", PORT), CORSRequestHandler) as httpd:
    print(f"🚀 سرور در حال اجرا در پورت {PORT}")
    print(f"📱 روی موبایل به آدرس زیر بروید:")
    print(f"   http://localhost:{PORT}/admin/index.html")
    print(f"   یا")
    print(f"   http://127.0.0.1:{PORT}/admin/index.html")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n⏹️ سرور متوقف شد")
