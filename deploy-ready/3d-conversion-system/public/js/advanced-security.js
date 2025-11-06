// سیستم محافظت پیشرفته حریم خصوصی مالی
class FinancialPrivacyShield {
    constructor() {
        this.protectionActive = true;
        this.attemptCount = 0;
        this.maxAttempts = 3;
        this.initAdvancedProtection();
    }

    // محافظت پیشرفته
    initAdvancedProtection() {
        this.protectConsoleAccess();
        this.protectStorageAccess();
        this.protectNetworkRequests();
        this.detectTampering();
    }

    // محافظت از دسترسی کنسول
    protectConsoleAccess() {
        const protectedMethods = ['balance', 'password', 'transaction', 'withdraw', 'deposit'];
        
        // محافظت از console.log
        const originalLog = console.log;
        console.log = function(...args) {
            const message = args.join(' ').toLowerCase();
            if (protectedMethods.some(method => message.includes(method))) {
                console.warn('🔒 دسترسی به اطلاعات مالی محدود شده است');
                return;
            }
            originalLog.apply(console, args);
        };

        // محافظت از localStorage دسترسی مستقیم
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = function(key, value) {
            if (key.toLowerCase().includes('balance') || key.toLowerCase().includes('financial')) {
                console.warn('🚫 ذخیره‌سازی مستقیم اطلاعات مالی مسدود شد');
                return;
            }
            originalSetItem.call(localStorage, key, value);
        };
    }

    // محافظت از دسترسی storage
    protectStorageAccess() {
        // پاک کردن داده‌های حساس از memory
        window.addEventListener('beforeunload', () => {
            const sensitiveKeys = ['password', 'privateKey', 'balance'];
            sensitiveKeys.forEach(key => {
                if (window[key]) {
                    window[key] = null;
                    delete window[key];
                }
            });
        });
    }

    // محافظت از درخواست‌های شبکه
    protectNetworkRequests() {
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            const url = args[0];
            // جلوگیری از ارسال داده‌های مالی به دامنه‌های غیرمجاز
            if (typeof url === 'string' && url.includes('balance') || url.includes('financial')) {
                console.warn('🚫 ارسال اطلاعات مالی به سرور غیرمجاز مسدود شد');
                return Promise.reject(new Error('ارسال اطلاعات مالی ممنوع'));
            }
            return originalFetch.apply(this, args);
        };
    }

    // تشخیص دستکاری
    detectTampering() {
        // مانیتور تغییرات در DOM مربوط به مالی
        const financialElements = document.querySelectorAll('[id*="balance"], [id*="amount"], [id*="transaction"]');
        
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && 
                    (mutation.attributeName === 'value' || mutation.attributeName === 'textContent')) {
                    
                    const element = mutation.target;
                    if (element.id && element.id.includes('balance')) {
                        console.warn('⚠️ تغییر غیرمجاز در اطلاعات مالی شناسایی شد');
                        this.lockSystem();
                    }
                }
            });
        });

        financialElements.forEach(element => {
            observer.observe(element, { 
                attributes: true, 
                attributeFilter: ['value', 'textContent'] 
            });
        });
    }

    // قفل کردن سیستم در صورت شناسایی مشکل
    lockSystem() {
        this.attemptCount++;
        if (this.attemptCount >= this.maxAttempts) {
            document.body.innerHTML = `
                <div class="fixed inset-0 bg-red-900 flex items-center justify-center z-50">
                    <div class="text-center text-white p-8">
                        <i class="fas fa-ban text-6xl mb-4"></i>
                        <h2 class="text-2xl font-bold mb-4">سیستم قفل شد</h2>
                        <p>دسترسی غیرمجاز به اطلاعات مالی شناسایی شد</p>
                        <p class="text-sm mt-2">لطفاً صفحه را رفرش کنید</p>
                    </div>
                </div>
            `;
        }
    }

    // تولید کلید امنیتی
    generateSecureKey() {
        const array = new Uint8Array(32);
        window.crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    // هش کردن رمز عبور
    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password + this.generateSecureKey());
        const hash = await window.crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
}

// سیستم اعتبارسنجی تراکنش
class TransactionValidator {
    constructor() {
        this.rules = {
            minWithdrawal: 10000,
            maxWithdrawal: 5000000,
            minDeposit: 100000,
            maxDeposit: 100000000,
            dailyLimit: 10000000
        };
    }

    validateWithdrawal(amount, currentBalance) {
        const errors = [];

        if (amount < this.rules.minWithdrawal) {
            errors.push(`حداقل مبلغ برداشت ${this.rules.minWithdrawal.toLocaleString()} تومان است`);
        }

        if (amount > this.rules.maxWithdrawal) {
            errors.push(`حداکثر مبلغ برداشت ${this.rules.maxWithdrawal.toLocaleString()} تومان است`);
        }

        if (amount > currentBalance) {
            errors.push('موجودی کافی نیست');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    validateDeposit(amount) {
        const errors = [];

        if (amount < this.rules.minDeposit) {
            errors.push(`حداقل مبلغ واریز ${this.rules.minDeposit.toLocaleString()} تومان است`);
        }

        if (amount > this.rules.maxDeposit) {
            errors.push(`حداکثر مبلغ واریز ${this.rules.maxDeposit.toLocaleString()} تومان است`);
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    validateSheba(sheba) {
        if (!sheba || !sheba.startsWith('IR') || sheba.length !== 26) {
            return {
                isValid: false,
                error: 'شماره شبا معتبر نیست'
            };
        }

        return {
            isValid: true
        };
    }
}

// راه‌اندازی سیستم‌های امنیتی
const privacyShield = new FinancialPrivacyShield();
const transactionValidator = new TransactionValidator();

// صادر کردن برای استفاده جهانی
window.privacyShield = privacyShield;
window.transactionValidator = transactionValidator;

// محافظت از global scope
Object.freeze(window.privacyShield);
Object.freeze(window.transactionValidator);
