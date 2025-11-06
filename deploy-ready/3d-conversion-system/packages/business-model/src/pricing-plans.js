// پلن‌های قیمت‌گذاری
class PricingPlans {
    constructor() {
        this.plans = {
            free: { name: 'رایگان', price: 0, credits: 5 },
            pro: { name: 'حرفه‌ای', price: 99000, credits: 100 }
        };
    }
}
module.exports = PricingPlans;
