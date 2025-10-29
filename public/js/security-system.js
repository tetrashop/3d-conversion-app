// سیستم امنیتی پیشرفته
class AdvancedSecuritySystem {
    constructor() {
        this.encryptionKey = this.generateEncryptionKey();
        this.failedAttempts = 0;
        this.maxAttempts = 5;
        this.lockUntil = 0;
    }

    // تولید کلید رمزنگاری
    generateEncryptionKey() {
        return 'sec_' + Math.random().toString(36).substr(2, 16) + Date.now().toString(36);
    }

    // اعتبارسنجی تراکنش
    validateTransaction(transaction) {
        const validations = {
            amount: this.validateAmount(transaction.amount),
            recipient: this.validateRecipient(transaction.recipient),
            limits: this.checkLimits(transaction),
            frequency: this.checkFrequency(transaction)
        };

        return Object.values(validations).every(v => v.isValid);
    }

    // اعتبارسنجی مقدار
    validateAmount(amount) {
        if (amount <= 0) {
            return { isValid: false, message: 'مبلغ باید بیشتر از صفر باشد' };
        }
        if (amount > 1000000000) { // 1 میلیارد تومان
            return { isValid: false, message: 'مبلغ بیش از حد مجاز است' };
        }
        return { isValid: true };
    }

    // اعتبارسنجی گیرنده
    validateRecipient(recipient) {
        if (!recipient) {
            return { isValid: false, message: 'گیرنده مشخص نیست' };
        }
        // اعتبارسنجی شماره شبا
        if (recipient.startsWith('IR')) {
            return this.validateSheba(recipient);
        }
        // اعتبارسنجی آدرس رمزارز
        return this.validateCryptoAddress(recipient);
    }

    // اعتبارسنجی شماره شبا
    validateSheba(sheba) {
        if (sheba.length !== 26) {
            return { isValid: false, message: 'طول شماره شبا نامعتبر است' };
        }
        return { isValid: true };
    }

    // اعتبارسنجی آدرس رمزارز
    validateCryptoAddress(address) {
        if (!address || address.length < 25) {
            return { isValid: false, message: 'آدرس رمزارز نامعتبر است' };
        }
        return { isValid: true };
    }

    // بررسی محدودیت‌ها
    checkLimits(transaction) {
        const dailyLimit = 5000000; // 5 میلیون تومان
        const transactionLimit = 10000000; // 10 میلیون تومان

        if (transaction.amount > transactionLimit) {
            return { isValid: false, message: 'مبلغ تراکنش بیش از حد مجاز است' };
        }

        // محاسبه تراکنش‌های امروز
        const todayTransactions = this.getTodayTransactions();
        const todayTotal = todayTransactions.reduce((sum, tx) => sum + tx.amount, 0);

        if (todayTotal + transaction.amount > dailyLimit) {
            return { isValid: false, message: 'محدودیت روزانه تراکنش تکمیل شده' };
        }

        return { isValid: true };
    }

    // بررسی تعدد تراکنش
    checkFrequency(transaction) {
        const lastHourTransactions = this.getLastHourTransactions();
        if (lastHourTransactions.length >= 10) {
            return { isValid: false, message: 'تعداد تراکنش‌ها در یک ساعت بیش از حد مجاز' };
        }
        return { isValid: true };
    }

    // دریافت تراکنش‌های امروز
    getTodayTransactions() {
        const today = new Date().toDateString();
        return []; // در حالت واقعی از دیتابیس خوانده می‌شود
    }

    // دریافت تراکنش‌های یک ساعت گذشته
    getLastHourTransactions() {
        const oneHourAgo = Date.now() - 3600000;
        return []; // در حالت واقعی از دیتابیس خوانده می‌شود
    }

    // رمزنگاری داده‌ها
    encryptData(data) {
        // شبیه‌سازی رمزنگاری
        return btoa(JSON.stringify(data));
    }

    // رمزگشایی داده‌ها
    decryptData(encryptedData) {
        try {
            return JSON.parse(atob(encryptedData));
        } catch (error) {
            console.error('خطا در رمزگشایی:', error);
            return null;
        }
    }

    // لاگ امنیتی
    logSecurityEvent(event, details) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            event: event,
            details: details,
            ip: 'user_ip', // در حالت واقعی از سرور گرفته می‌شود
            userAgent: navigator.userAgent
        };

        console.log('🚨 رویداد امنیتی:', logEntry);
        // در حالت واقعی به سرور لاگ ارسال می‌شود
    }
}

// سیستم مدیریت ریسک
class RiskManagementSystem {
    constructor() {
        this.suspiciousPatterns = [
            'large_amount',
            'frequent_transactions', 
            'new_recipient',
            'off_hours'
        ];
    }

    // ارزیابی ریسک تراکنش
    assessTransactionRisk(transaction) {
        let riskScore = 0;
        const factors = [];

        // بررسی مقدار تراکنش
        if (transaction.amount > 10000000) { // 10 میلیون تومان
            riskScore += 30;
            factors.push('مبلغ بزرگ');
        }

        // بررسی زمان تراکنش (ساعات غیرکاری)
        const hour = new Date().getHours();
        if (hour < 8 || hour > 18) {
            riskScore += 20;
            factors.push('ساعت غیرعادی');
        }

        // بررسی گیرنده جدید
        if (this.isNewRecipient(transaction.recipient)) {
            riskScore += 25;
            factors.push('گیرنده جدید');
        }

        return {
            score: riskScore,
            level: this.getRiskLevel(riskScore),
            factors: factors
        };
    }

    // بررسی گیرنده جدید
    isNewRecipient(recipient) {
        // در حالت واقعی از تاریخچه تراکنش‌ها چک می‌شود
        return true;
    }

    // تعیین سطح ریسک
    getRiskLevel(score) {
        if (score >= 70) return 'high';
        if (score >= 40) return 'medium';
        return 'low';
    }

    // اقدامات متناسب با سطح ریسک
    getRiskMitigation(riskLevel) {
        const actions = {
            low: ['تأیید خودکار'],
            medium: ['تأیید دو مرحله‌ای', 'بررسی دستی'],
            high: ['تأیید دو مرحله‌ای', 'بررسی امنیتی', 'تماس تلفنی']
        };

        return actions[riskLevel] || actions.low;
    }
}

// نمونه‌های جهانی
const securitySystem = new AdvancedSecuritySystem();
const riskSystem = new RiskManagementSystem();

// صادر کردن برای استفاده جهانی
window.securitySystem = securitySystem;
window.riskSystem = riskSystem;
