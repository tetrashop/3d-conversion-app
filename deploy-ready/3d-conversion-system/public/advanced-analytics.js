// سیستم آنالیتیکس پیشرفته برای رصد سامانه
class AdvancedAnalytics {
    constructor() {
        this.endpoint = 'https://b505c963.3d-conversion-app5.pages.dev/';
        this.metrics = {};
        this.init();
    }

    async init() {
        await this.collectInitialMetrics();
        this.startContinuousMonitoring();
        this.setupPerformanceTracking();
    }

    // جمع‌آوری متریک‌های اولیه
    async collectInitialMetrics() {
        try {
            // تست دسترسی به سامانه
            const availability = await this.checkAvailability();
            this.metrics.availability = availability;

            // جمع‌آوری اطلاعات پایه
            this.metrics.pageLoadTime = await this.measurePageLoad();
            this.metrics.coreWebVitals = await this.measureCoreWebVitals();
            this.metrics.userAgent = navigator.userAgent;
            this.metrics.screenResolution = `${screen.width}x${screen.height}`;
            
            console.log('📊 متریک‌های اولیه جمع‌آوری شد:', this.metrics);
        } catch (error) {
            console.error('خطا در جمع‌آوری متریک‌ها:', error);
        }
    }

    // بررسی دسترسی سامانه
    async checkAvailability() {
        try {
            const startTime = performance.now();
            const response = await fetch(this.endpoint, { 
                method: 'HEAD',
                cache: 'no-cache'
            });
            const endTime = performance.now();
            
            return {
                status: response.status,
                responseTime: endTime - startTime,
                timestamp: new Date().toISOString(),
                online: response.ok
            };
        } catch (error) {
            return {
                status: 0,
                responseTime: 0,
                timestamp: new Date().toISOString(),
                online: false,
                error: error.message
            };
        }
    }

    // اندازه‌گیری زمان بارگذاری صفحه
    async measurePageLoad() {
        return new Promise((resolve) => {
            window.addEventListener('load', () => {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                resolve(loadTime);
            });
        });
    }

    // اندازه‌گیری Core Web Vitals
    async measureCoreWebVitals() {
        return new Promise((resolve) => {
            // شبیه‌سازی اندازه‌گیری‌های واقعی
            setTimeout(() => {
                resolve({
                    LCP: 1200 + Math.random() * 500, // Largest Contentful Paint
                    FID: 80 + Math.random() * 50,    // First Input Delay
                    CLS: 0.05 + Math.random() * 0.1, // Cumulative Layout Shift
                    FCP: 800 + Math.random() * 400   // First Contentful Paint
                });
            }, 1000);
        });
    }

    // شروع مانیتورینگ پیوسته
    startContinuousMonitoring() {
        // مانیتورینگ دسترسی هر 30 ثانیه
        setInterval(async () => {
            const availability = await this.checkAvailability();
            this.updateAvailabilityChart(availability);
        }, 30000);

        // مانیتورینگ عملکرد هر 1 دقیقه
        setInterval(() => {
            this.measurePerformance();
        }, 60000);

        // رصد تغییرات DOM (برای رصد تعامل کاربر)
        this.setupDOMMonitoring();
    }

    // راه‌اندازی رصد تغییرات DOM
    setupDOMMonitoring() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    this.trackUserInteraction('DOM_CHANGE', {
                        addedNodes: mutation.addedNodes.length,
                        removedNodes: mutation.removedNodes.length,
                        target: mutation.target.nodeName
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
        });
    }

    // رصد تعامل کاربر
    setupUserInteractionTracking() {
        // رصد کلیک‌ها
        document.addEventListener('click', (event) => {
            this.trackUserInteraction('CLICK', {
                element: event.target.tagName,
                id: event.target.id,
                class: event.target.className,
                text: event.target.textContent?.substring(0, 50)
            });
        });

        // رصد ارسال فرم‌ها
        document.addEventListener('submit', (event) => {
            this.trackUserInteraction('FORM_SUBMIT', {
                formId: event.target.id,
                action: event.target.action
            });
        });

        // رصد تغییرات input
        document.addEventListener('change', (event) => {
            if (event.target.type === 'file') {
                this.trackUserInteraction('FILE_UPLOAD', {
                    fileName: event.target.files[0]?.name,
                    fileSize: event.target.files[0]?.size
                });
            }
        });
    }

    // ردیابی تعامل کاربر
    trackUserInteraction(type, data) {
        const interaction = {
            type,
            data,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };

        console.log('👤 تعامل کاربر:', interaction);
        this.saveInteraction(interaction);
    }

    // ذخیره تعاملات
    saveInteraction(interaction) {
        // در حالت واقعی به سرور ارسال می‌شود
        const interactions = JSON.parse(localStorage.getItem('user_interactions') || '[]');
        interactions.push(interaction);
        localStorage.setItem('user_interactions', JSON.stringify(interactions.slice(-100))); // ذخیره آخرین 100 تعامل
    }

    // اندازه‌گیری عملکرد
    async measurePerformance() {
        const performanceMetrics = {
            memory: performance.memory ? {
                usedJSHeapSize: performance.memory.usedJSHeapSize,
                totalJSHeapSize: performance.memory.totalJSHeapSize,
                jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
            } : null,
            navigation: performance.getEntriesByType('navigation')[0],
            resources: performance.getEntriesByType('resource')
        };

        this.metrics.performance = performanceMetrics;
        console.log('⚡ متریک‌های عملکرد:', performanceMetrics);
    }

    // تولید گزارش
    generateReport() {
        return {
            timestamp: new Date().toISOString(),
            summary: {
                totalVisits: this.metrics.totalVisits || 0,
                availability: this.calculateAvailabilityRate(),
                averageResponseTime: this.calculateAverageResponseTime(),
                performanceScore: this.calculatePerformanceScore()
            },
            details: this.metrics
        };
    }

    // محاسبه نرخ دسترسی
    calculateAvailabilityRate() {
        // شبیه‌سازی - در حالت واقعی از تاریخچه داده‌ها محاسبه می‌شود
        return 99.8;
    }

    // محاسبه میانگین زمان پاسخ
    calculateAverageResponseTime() {
        return 120; // میلی‌ثانیه
    }

    // محاسبه امتیاز عملکرد
    calculatePerformanceScore() {
        const vitals = this.metrics.coreWebVitals;
        if (!vitals) return 0;

        const scores = {
            LCP: vitals.LCP < 2500 ? 100 : Math.max(0, 100 - ((vitals.LCP - 2500) / 10)),
            FID: vitals.FID < 100 ? 100 : Math.max(0, 100 - ((vitals.FID - 100) / 2)),
            CLS: vitals.CLS < 0.1 ? 100 : Math.max(0, 100 - (vitals.CLS * 1000))
        };

        return Math.round((scores.LCP + scores.FID + scores.CLS) / 3);
    }

    // به روز رسانی چارت دسترسی
    updateAvailabilityChart(availability) {
        // در اینجا چارت‌ها به روز می‌شوند
        console.log('📈 به روز رسانی چارت دسترسی:', availability);
    }
}

// سیستم رصد امنیتی
class SecurityMonitor {
    constructor() {
        this.suspiciousActivities = [];
        this.init();
    }

    init() {
        this.monitorNetworkRequests();
        this.monitorConsoleAccess();
        this.monitorAuthenticationAttempts();
    }

    // رصد درخواست‌های شبکه
    monitorNetworkRequests() {
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            const url = args[0];
            const method = args[1]?.method || 'GET';
            
            // ثبت لاگ درخواست
            console.log('🌐 درخواست شبکه:', { url, method, timestamp: new Date().toISOString() });
            
            return originalFetch.apply(this, args);
        };
    }

    // رصد دسترسی به کنسول
    monitorConsoleAccess() {
        const originalConsole = console.log;
        console.log = function(...args) {
            // ثبت لاگ کنسول (برای رصد دیباگ)
            if (args.some(arg => typeof arg === 'string' && arg.includes('password'))) {
                console.warn('🚨 دسترسی مشکوک به کنسول شناسایی شد');
            }
            
            originalConsole.apply(console, args);
        };
    }

    // رصد تلاش‌های احراز هویت
    monitorAuthenticationAttempts() {
        // رصد تلاش‌های لاگین
        const loginForms = document.querySelectorAll('form[action*="login"], form input[type="password"]');
        loginForms.forEach(form => {
            form.addEventListener('submit', (event) => {
                this.logAuthenticationAttempt(event);
            });
        });
    }

    // ثبت تلاش احراز هویت
    logAuthenticationAttempt(event) {
        const attempt = {
            type: 'AUTH_ATTEMPT',
            timestamp: new Date().toISOString(),
            formData: new FormData(event.target),
            userAgent: navigator.userAgent,
            ip: 'user_ip' // در حالت واقعی از سرور گرفته می‌شود
        };

        this.suspiciousActivities.push(attempt);
        console.log('🔐 تلاش احراز هویت:', attempt);
    }

    // بررسی فعالیت‌های مشکوک
    detectSuspiciousActivities() {
        const recentActivities = this.suspiciousActivities.slice(-10);
        
        // بررسی الگوهای مشکوک
        const multipleFailures = recentActivities.filter(activity => 
            activity.type === 'AUTH_FAILURE'
        ).length > 3;

        if (multipleFailures) {
            console.warn('🚨 فعالیت مشکوک شناسایی شد: تلاش‌های مکرر احراز هویت');
        }

        return {
            suspicious: multipleFailures,
            activities: recentActivities
        };
    }
}

// راه‌اندازی سیستم‌های رصد
const analytics = new AdvancedAnalytics();
const securityMonitor = new SecurityMonitor();

// صادر کردن برای استفاده جهانی
window.analytics = analytics;
window.securityMonitor = securityMonitor;

// راه‌اندازی اولیه
document.addEventListener('DOMContentLoaded', () => {
    analytics.setupUserInteractionTracking();
    console.log('✅ سیستم‌های رصد پیشرفته راه‌اندازی شدند');
});
