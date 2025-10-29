// پیکربندی امنیتی پیشرفته برای پروتکل‌های SSL/TLS
class SecurityProtocolManager {
    constructor() {
        this.supportedProtocols = [
            'TLSv1.3',
            'TLSv1.2'
        ];
        
        this.supportedCiphers = [
            'ECDHE-ECDSA-AES128-GCM-SHA256',
            'ECDHE-RSA-AES128-GCM-SHA256',
            'ECDHE-ECDSA-AES256-GCM-SHA384',
            'ECDHE-RSA-AES256-GCM-SHA384'
        ];
        
        this.init();
    }

    init() {
        this.checkProtocolSupport();
        this.enableSecureConnection();
    }

    checkProtocolSupport() {
        const userAgent = navigator.userAgent;
        const isModernBrowser = 
            userAgent.includes('Chrome/9') || 
            userAgent.includes('Firefox/78') ||
            userAgent.includes('Safari/14') ||
            userAgent.includes('Edge/9');

        if (!isModernBrowser) {
            this.showBrowserWarning();
        }
    }

    showBrowserWarning() {
        const warningDiv = document.createElement('div');
        warningDiv.className = 'fixed top-0 left-0 right-0 bg-red-600 text-white p-4 text-center z-50';
        warningDiv.innerHTML = `
            <div class="container mx-auto">
                <i class="fas fa-exclamation-triangle ml-2"></i>
                مرورگر شما قدیمی است. برای امنیت بیشتر، لطفاً آخرین نسخه 
                <a href="https://www.google.com/chrome/" class="underline font-bold" target="_blank">Chrome</a>،
                <a href="https://www.mozilla.org/firefox/" class="underline font-bold" target="_blank">Firefox</a> یا
                <a href="https://www.microsoft.com/edge" class="underline font-bold" target="_blank">Edge</a> را نصب کنید.
                <button onclick="this.parentElement.parentElement.remove()" class="mr-4 text-white hover:text-gray-200">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        document.body.prepend(warningDiv);
    }

    enableSecureConnection() {
        // فعال کردن امنیت پیشرفته برای ارتباطات
        if (window.location.protocol === 'http:') {
            window.location.href = window.location.href.replace('http:', 'https:');
            return;
        }

        // پیکربندی امنیتی برای fetch
        this.secureFetchConfig = {
            mode: 'cors',
            credentials: 'same-origin',
            redirect: 'follow',
            referrerPolicy: 'strict-origin-when-cross-origin'
        };
    }

    // تست اتصال امن
    async testSecureConnection() {
        try {
            const response = await fetch('/', {
                method: 'HEAD',
                credentials: 'same-origin'
            });
            
            const securityHeaders = {
                'hsts': response.headers.get('strict-transport-security'),
                'xFrameOptions': response.headers.get('x-frame-options'),
                'contentTypeOptions': response.headers.get('x-content-type-options')
            };

            return {
                success: response.ok,
                securityHeaders: securityHeaders,
                protocol: window.location.protocol
            };
        } catch (error) {
            console.error('خطا در تست اتصال امن:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// سیستم مدیریت خطاهای امنیتی
class SecurityErrorHandler {
    constructor() {
        this.setupErrorHandling();
    }

    setupErrorHandling() {
        // مدیریت خطاهای SSL/TLS
        window.addEventListener('error', (event) => {
            if (this.isSecurityError(event.error)) {
                this.handleSecurityError(event.error);
            }
        });

        // مدیریت خطاهای fetch
        window.addEventListener('unhandledrejection', (event) => {
            if (this.isNetworkError(event.reason)) {
                this.handleNetworkError(event.reason);
            }
        });
    }

    isSecurityError(error) {
        const errorMsg = error?.toString().toLowerCase();
        return errorMsg?.includes('ssl') || 
               errorMsg?.includes('tls') ||
               errorMsg?.includes('certificate') ||
               errorMsg?.includes('protocol');
    }

    isNetworkError(error) {
        const errorMsg = error?.toString().toLowerCase();
        return errorMsg?.includes('network') || 
               errorMsg?.includes('fetch') ||
               errorMsg?.includes('cors');
    }

    handleSecurityError(error) {
        console.warn('خطای امنیتی شناسایی شد:', error);
        
        // نمایش راهنمای عیب‌یابی به کاربر
        this.showTroubleshootingGuide();
    }

    handleNetworkError(error) {
        console.warn('خطای شبکه شناسایی شد:', error);
        
        // پیشنهاد راه‌حل‌های جایگزین
        this.showNetworkSolutions();
    }

    showTroubleshootingGuide() {
        const guide = document.createElement('div');
        guide.className = 'fixed bottom-4 right-4 bg-yellow-500 text-white p-4 rounded-lg shadow-2xl max-w-sm z-50';
        guide.innerHTML = `
            <div class="flex items-start justify-between mb-2">
                <h4 class="font-bold text-lg">
                    <i class="fas fa-shield-alt ml-2"></i>
                    راهنمای امنیت
                </h4>
                <button onclick="this.parentElement.parentElement.remove()" class="text-white hover:text-yellow-200">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <ul class="text-sm space-y-1 text-right">
                <li>✓ از آخرین نسخه مرورگر استفاده کنید</li>
                <li>✓ اتصال اینترنت خود را بررسی کنید</li>
                <li>✓ فایروال/آنتی‌ویروس را موقتاً غیرفعال کنید</li>
                <li>✓ صفحه را رفرش کنید</li>
            </ul>
        `;
        document.body.appendChild(guide);

        // حذف خودکار پس از 10 ثانیه
        setTimeout(() => {
            if (guide.parentElement) {
                guide.remove();
            }
        }, 10000);
    }

    showNetworkSolutions() {
        const solutions = document.createElement('div');
        solutions.className = 'fixed bottom-4 left-4 bg-blue-500 text-white p-4 rounded-lg shadow-2xl max-w-sm z-50';
        solutions.innerHTML = `
            <div class="flex items-start justify-between mb-2">
                <h4 class="font-bold text-lg">
                    <i class="fas fa-wifi ml-2"></i>
                    راه‌حل‌های شبکه
                </h4>
                <button onclick="this.parentElement.parentElement.remove()" class="text-white hover:text-blue-200">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <ul class="text-sm space-y-1 text-right">
                <li>✓ اتصال اینترنت خود را بررسی کنید</li>
                <li>✓ VPN خود را غیرفعال کنید</li>
                <li>✓ DNS را به 8.8.8.8 تغییر دهید</li>
                <li>✓ صفحه را دوباره بارگذاری کنید</li>
            </ul>
        `;
        document.body.appendChild(solutions);

        setTimeout(() => {
            if (solutions.parentElement) {
                solutions.remove();
            }
        }, 10000);
    }
}

// راه‌اندازی سیستم‌های امنیتی
const securityManager = new SecurityProtocolManager();
const errorHandler = new SecurityErrorHandler();

// تست اتصال هنگام بارگذاری صفحه
document.addEventListener('DOMContentLoaded', async () => {
    const connectionTest = await securityManager.testSecureConnection();
    
    if (!connectionTest.success) {
        console.warn('هشدار: مشکلات اتصال امن شناسایی شد', connectionTest);
    } else {
        console.log('اتصال امن برقرار شد:', connectionTest);
    }
});

// صادر کردن برای استفاده جهانی
window.securityManager = securityManager;
window.errorHandler = errorHandler;
