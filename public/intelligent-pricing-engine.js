// 🧠 موتور هوشمند محاسبه قیمت و زمان
class IntelligentPricingEngine {
    constructor() {
        this.baseConfig = {
            currencyRates: {
                USD: 50000, // نرخ دلار به تومان
                EUR: 55000,
                GBP: 65000
            },
            complexityFactors: {
                low: 1.0,
                medium: 1.5,
                high: 2.0,
                extreme: 3.0
            },
            timeMultipliers: {
                standard: 1.0,
                priority: 1.8,
                express: 2.5
            }
        };
        
        this.realTimeData = {};
        this.init();
    }

    async init() {
        await this.fetchRealTimeData();
        this.startDataSync();
    }

    // دریافت داده‌های لحظه‌ای
    async fetchRealTimeData() {
        try {
            // شبیه‌سازی دریافت داده‌های زنده
            this.realTimeData = {
                serverLoad: Math.random() * 100,
                networkLatency: 50 + Math.random() * 100,
                demandFactor: 0.8 + Math.random() * 0.4,
                energyCost: 1200 + Math.random() * 500
            };
        } catch (error) {
            console.warn('خطا در دریافت داده‌های لحظه‌ای:', error);
            this.useFallbackData();
        }
    }

    // الگوریتم محاسبه قیمت پویا
    calculateDynamicPrice(planType, fileComplexity = 'medium') {
        const basePlans = {
            standard: { basePrice: 25, baseTime: 5 },
            premium: { basePrice: 50, baseTime: 2 },
            express: { basePrice: 75, baseTime: 1 }
        };

        const plan = basePlans[planType];
        if (!plan) throw new Error('پلن نامعتبر');

        // فاکتورهای پویا
        const loadFactor = 1 + (this.realTimeData.serverLoad / 200);
        const demandFactor = this.realTimeData.demandFactor;
        const complexityFactor = this.baseConfig.complexityFactors[fileComplexity];
        const timeMultiplier = this.baseConfig.timeMultipliers[planType];

        // محاسبه نهایی
        const dynamicPrice = plan.basePrice * loadFactor * demandFactor * complexityFactor;
        const dynamicTime = plan.baseTime * (1 / timeMultiplier) * complexityFactor;

        return {
            originalPrice: plan.basePrice,
            finalPrice: Math.round(dynamicPrice * 100) / 100,
            originalTime: plan.baseTime,
            finalTime: Math.max(0.5, Math.round(dynamicTime * 10) / 10), // حداقل ۰.۵ ساعت
            currency: 'USD',
            factors: {
                load: loadFactor,
                demand: demandFactor,
                complexity: complexityFactor,
                urgency: timeMultiplier
            }
        };
    }

    // الگوریتم تبدیل ارز هوشمند
    calculateLocalCurrency(priceUSD, targetCurrency = 'IRT') {
        const rate = this.baseConfig.currencyRates.USD;
        let localPrice = priceUSD * rate;

        // اعمال کارمزدهای بانکی و مالیات
        const bankFee = localPrice * 0.01; // 1% کارمزد بانک
        const tax = localPrice * 0.09;     // 9% مالیات بر ارزش افزوده
        
        return {
            rial: Math.round(localPrice),
            toman: Math.round(localPrice / 10),
            totalWithFees: Math.round((localPrice + bankFee + tax) / 10),
            breakdown: {
                basePrice: Math.round(localPrice / 10),
                bankFee: Math.round(bankFee / 10),
                tax: Math.round(tax / 10)
            }
        };
    }

    // الگوریتم بهینه‌سازی زمان پردازش
    optimizeProcessingTime(planType, fileSize, complexity) {
        const baseTimes = {
            standard: 5 * 3600, // 5 hours in seconds
            premium: 2 * 3600,  // 2 hours
            express: 1 * 3600   // 1 hour
        };

        let optimizedTime = baseTimes[planType];

        // فاکتورهای بهینه‌سازی
        if (fileSize > 50 * 1024 * 1024) { // بیش از 50MB
            optimizedTime *= 1.3;
        }

        if (complexity === 'high') {
            optimizedTime *= 1.5;
        } else if (complexity === 'extreme') {
            optimizedTime *= 2.0;
        }

        // اعمال فاکتورهای لحظه‌ای
        optimizedTime *= (1 + this.realTimeData.serverLoad / 200);

        return Math.max(1800, Math.round(optimizedTime)); // حداقل 30 دقیقه
    }

    // همگام‌سازی دوره‌ای داده‌ها
    startDataSync() {
        setInterval(() => {
            this.fetchRealTimeData();
        }, 30000); // هر 30 ثانیه
    }

    useFallbackData() {
        this.realTimeData = {
            serverLoad: 50,
            networkLatency: 100,
            demandFactor: 1.0,
            energyCost: 1500
        };
    }
}

// 💰 سیستم مالی و حقوقی پیشرفته
class AdvancedFinancialEngine {
    constructor() {
        this.taxConfig = {
            vat: 0.09,      // مالیات بر ارزش افزوده
            incomeTax: 0.05, // مالیات بر درآمد
            municipality: 0.01 // عوارض شهرداری
        };
        
        this.complianceRules = {
            minTransaction: 10000,    // حداقل تراکنش (تومان)
            maxTransaction: 100000000, // حداکثر تراکنش
            dailyLimit: 5000000,      // سقف روزانه
            requiredDocs: ['nationalId', 'phoneVerification']
        };
    }

    // الگوریتم محاسبه مالیات و عوارض
    calculateTaxes(baseAmount) {
        const vat = baseAmount * this.taxConfig.vat;
        const incomeTax = baseAmount * this.taxConfig.incomeTax;
        const municipality = baseAmount * this.taxConfig.municipality;
        
        const totalTax = vat + incomeTax + municipality;
        const totalAmount = baseAmount + totalTax;

        return {
            baseAmount: Math.round(baseAmount),
            taxes: {
                vat: Math.round(vat),
                incomeTax: Math.round(incomeTax),
                municipality: Math.round(municipality),
                total: Math.round(totalTax)
            },
            grandTotal: Math.round(totalAmount),
            breakdown: {
                base: Math.round(baseAmount),
                vat: Math.round(vat),
                incomeTax: Math.round(incomeTax),
                municipality: Math.round(municipality)
            }
        };
    }

    // الگوریتم اعتبارسنجی حقوقی
    validateLegalCompliance(userData, transactionAmount) {
        const errors = [];
        const warnings = [];

        // بررسی حداقل و حداکثر مبلغ
        if (transactionAmount < this.complianceRules.minTransaction) {
            errors.push(`مبلغ تراکنش کمتر از حد مجاز (${this.complianceRules.minTransaction.toLocaleString()} تومان)`);
        }

        if (transactionAmount > this.complianceRules.maxTransaction) {
            errors.push(`مبلغ تراکنش بیشتر از حد مجاز (${this.complianceRules.maxTransaction.toLocaleString()} تومان)`);
        }

        // بررسی مدارک required
        this.complianceRules.requiredDocs.forEach(doc => {
            if (!userData[doc]) {
                errors.push(`مدرک ${doc} الزامی است`);
            }
        });

        // بررسی سقف روزانه
        const dailyTotal = this.getUserDailyTransactions(userData.id);
        if (dailyTotal + transactionAmount > this.complianceRules.dailyLimit) {
            warnings.push(`نزدیک به سقف مجاز روزانه. مانده: ${(this.complianceRules.dailyLimit - dailyTotal).toLocaleString()} تومان`);
        }

        return {
            isValid: errors.length === 0,
            errors: errors,
            warnings: warnings,
            complianceScore: errors.length === 0 ? 100 : Math.max(0, 100 - (errors.length * 25))
        };
    }

    // الگوریتم تولید فاکتور رسمی
    generateLegalInvoice(transactionData, userData) {
        const taxCalculation = this.calculateTaxes(transactionData.amount);
        
        return {
            invoiceNumber: 'INV-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
            issueDate: new Date().toLocaleDateString('fa-IR'),
            issueTime: new Date().toLocaleTimeString('fa-IR'),
            seller: {
                name: 'شرکت تبدیل 3D حرفه‌ای',
                taxId: '1234567890',
                economicCode: '4111111111',
                address: 'تهران، خیابان ولیعصر'
            },
            buyer: {
                name: userData.fullName,
                nationalId: userData.nationalId,
                phone: userData.phone
            },
            items: [{
                description: `تبدیل 3D - پلن ${transactionData.plan}`,
                quantity: 1,
                unitPrice: taxCalculation.baseAmount,
                total: taxCalculation.baseAmount
            }],
            taxDetails: taxCalculation,
            payment: {
                method: 'درگاه بانکی',
                transactionId: 'TX-' + Date.now(),
                trackingCode: 'TRK-' + Math.random().toString(36).substr(2, 8).toUpperCase()
            },
            legalNotes: [
                'این فاکتور دارای اعتبار قانونی می‌باشد',
                'مطابق با قوانین جمهوری اسلامی ایران',
                'مالیات بر ارزش افزوده محاسبه و واریز شده است'
            ]
        };
    }

    getUserDailyTransactions(userId) {
        // شبیه‌سازی - در حالت واقعی از دیتابیس خوانده می‌شود
        return Math.random() * 1000000;
    }
}

// ⚡ الگوریتم بهره‌وری و پردازش
class EfficiencyOptimizer {
    constructor() {
        this.performanceMetrics = {
            processingSpeed: 1.0,
            resourceUsage: 0.7,
            queueLength: 0,
            successRate: 0.98
        };
    }

    // الگوریتم تخصیص منابع بهینه
    allocateResources(planType, fileComplexity, fileSize) {
        const resourceProfiles = {
            standard: { cpu: 2, memory: 4, priority: 1 },
            premium: { cpu: 4, memory: 8, priority: 2 },
            express: { cpu: 8, memory: 16, priority: 3 }
        };

        const baseResources = resourceProfiles[planType];
        
        // تطبیق منابع با پیچیدگی فایل
        const complexityMultipliers = {
            low: 0.8,
            medium: 1.0,
            high: 1.5,
            extreme: 2.0
        };

        const sizeMultiplier = Math.min(2.0, 1 + (fileSize / (100 * 1024 * 1024))); // حداکثر 2x برای فایل‌های بزرگ

        const allocatedResources = {
            cpu: Math.round(baseResources.cpu * complexityMultipliers[fileComplexity] * sizeMultiplier),
            memory: Math.round(baseResources.memory * complexityMultipliers[fileComplexity] * sizeMultiplier),
            priority: baseResources.priority,
            estimatedTime: this.estimateProcessingTime(planType, fileComplexity, fileSize),
            costEfficiency: this.calculateCostEfficiency(planType, baseResources)
        };

        return allocatedResources;
    }

    // الگوریتم تخمین زمان پردازش
    estimateProcessingTime(planType, complexity, fileSize) {
        const baseTimes = {
            standard: 5 * 60, // 5 hours in minutes
            premium: 2 * 60,  // 2 hours
            express: 1 * 60   // 1 hour
        };

        let estimatedTime = baseTimes[planType];

        // اعمال فاکتورهای پیچیدگی
        const complexityFactors = { low: 0.8, medium: 1.0, high: 1.8, extreme: 2.5 };
        estimatedTime *= complexityFactors[complexity];

        // اعمال فاکتور اندازه فایل
        const sizeFactor = Math.min(2.0, 1 + (fileSize / (50 * 1024 * 1024)));
        estimatedTime *= sizeFactor;

        // اعمال متریک‌های عملکرد سیستم
        estimatedTime /= this.performanceMetrics.processingSpeed;

        return Math.max(10, Math.round(estimatedTime)); // حداقل 10 دقیقه
    }

    // الگوریتم محاسبه بهره‌وری هزینه
    calculateCostEfficiency(planType, resources) {
        const costPerUnit = {
            cpu: 0.1,
            memory: 0.05,
            storage: 0.01
        };

        const planPrices = { standard: 25, premium: 50, express: 75 };
        const resourceCost = (resources.cpu * costPerUnit.cpu) + (resources.memory * costPerUnit.memory);
        
        return {
            resourceCost: resourceCost,
            planPrice: planPrices[planType],
            efficiency: planPrices[planType] / resourceCost,
            profitability: (planPrices[planType] - resourceCost) / planPrices[planType]
        };
    }

    // الگوریتم بهینه‌سازی صف پردازش
    optimizeProcessingQueue(jobs) {
        return jobs.sort((a, b) => {
            // اولویت‌بندی بر اساس:
            const aPriority = a.priority * 3 + (a.estimatedTime / 60) * 2 + (a.urgency || 1);
            const bPriority = b.priority * 3 + (b.estimatedTime / 60) * 2 + (b.urgency || 1);
            
            return bPriority - aPriority; // اولویت بالاتر اول
        });
    }

    // بروزرسانی متریک‌های عملکرد
    updatePerformanceMetrics(success, processingTime, resourceUsage) {
        // به روز رسانی نرخ موفقیت
        this.performanceMetrics.successRate = 
            (this.performanceMetrics.successRate * 0.95) + (success ? 0.05 : 0);

        // به روز رسانی سرعت پردازش
        this.performanceMetrics.processingSpeed = 
            (this.performanceMetrics.processingSpeed * 0.9) + ((1 / processingTime) * 0.1);

        // به روز رسانی استفاده از منابع
        this.performanceMetrics.resourceUsage = 
            (this.performanceMetrics.resourceUsage * 0.8) + (resourceUsage * 0.2);
    }
}

// 🌐 الگوریتم نمایش و رابط کاربری
class DynamicDisplayEngine {
    constructor() {
        this.displayConfig = {
            updateInterval: 5000, // به روز رسانی هر 5 ثانیه
            animationDuration: 1000,
            numberFormats: {
                rial: 'fa-IR',
                dollar: 'en-US',
                euro: 'de-DE'
            }
        };
    }

    // الگوریتم به روز رسانی پویای قیمت‌ها
    initializeDynamicPricing() {
        const pricingEngine = new IntelligentPricingEngine();
        const plans = ['standard', 'premium', 'express'];
        
        setInterval(async () => {
            await pricingEngine.fetchRealTimeData();
            
            plans.forEach(plan => {
                const calculation = pricingEngine.calculateDynamicPrice(plan);
                const localPrice = pricingEngine.calculateLocalCurrency(calculation.finalPrice);
                
                this.updatePlanDisplay(plan, calculation, localPrice);
            });
        }, this.displayConfig.updateInterval);
    }

    // الگوریتم به روز رسانی نمایش
    updatePlanDisplay(planType, calculation, localPrice) {
        const planElement = document.getElementById(`plan-${planType}`);
        if (!planElement) return;

        const elements = {
            price: planElement.querySelector('.dynamic-price'),
            time: planElement.querySelector('.dynamic-time'),
            original: planElement.querySelector('.original-price'),
            factors: planElement.querySelector('.price-factors')
        };

        if (elements.price) {
            this.animateNumberChange(elements.price, 
                `${calculation.finalPrice} USD | ${localPrice.totalWithFees.toLocaleString()} تومان`);
        }

        if (elements.time) {
            this.animateNumberChange(elements.time, 
                `⏱ ${calculation.finalTime} ساعت`);
        }

        if (elements.original) {
            elements.original.innerHTML = 
                `<del>${calculation.originalPrice} USD</del>`;
        }

        if (elements.factors) {
            elements.factors.innerHTML = this.generateFactorsHTML(calculation.factors);
        }
    }

    // الگوریتم انیمیشن تغییر اعداد
    animateNumberChange(element, newValue) {
        element.style.transition = 'all 0.5s ease';
        element.style.transform = 'scale(1.1)';
        element.style.color = '#f59e0b';
        
        setTimeout(() => {
            element.textContent = newValue;
            element.style.transform = 'scale(1)';
            element.style.color = '';
        }, 250);
    }

    // تولید HTML فاکتورهای قیمت‌گذاری
    generateFactorsHTML(factors) {
        return `
            <div class="text-xs text-gray-400 mt-2">
                <div>بار سرور: ${(factors.load * 100 - 100).toFixed(1)}%</div>
                <div>تقاضا: ${(factors.demand * 100).toFixed(1)}%</div>
                <div>پیچیدگی: ${factors.complexity}x</div>
                <div>فوریت: ${factors.urgency}x</div>
            </div>
        `;
    }

    // الگوریتم نمایش وضعیت لحظه‌ای
    createRealtimeStatus() {
        const statusElement = document.createElement('div');
        statusElement.className = 'fixed top-4 left-4 bg-green-500 text-white p-3 rounded-lg shadow-lg z-50';
        statusElement.innerHTML = `
            <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span class="font-semibold">قیمت‌های لحظه‌ای فعال</span>
            </div>
            <div class="text-xs mt-1">آخرین به روز رسانی: <span id="last-update">هم اکنون</span></div>
        `;

        document.body.appendChild(statusElement);

        // به روز رسانی زمان
        setInterval(() => {
            document.getElementById('last-update').textContent = 
                new Date().toLocaleTimeString('fa-IR');
        }, 1000);
    }
}

// راه‌اندازی سیستم‌های هوشمند
const pricingEngine = new IntelligentPricingEngine();
const financialEngine = new AdvancedFinancialEngine();
const efficiencyOptimizer = new EfficiencyOptimizer();
const displayEngine = new DynamicDisplayEngine();

// صادر کردن برای استفاده جهانی
window.pricingEngine = pricingEngine;
window.financialEngine = financialEngine;
window.efficiencyOptimizer = efficiencyOptimizer;
window.displayEngine = displayEngine;

// راه‌اندازی اولیه
document.addEventListener('DOMContentLoaded', () => {
    displayEngine.initializeDynamicPricing();
    displayEngine.createRealtimeStatus();
    
    console.log('✅ سیستم‌های هوشمند با موفقیت راه‌اندازی شدند');
});
