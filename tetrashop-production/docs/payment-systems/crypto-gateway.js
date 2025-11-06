// درگاه پرداخت رمزارز
class CryptoPaymentGateway {
    async createPayment(amount, currency) {
        return {
            paymentId: 'pay_' + Date.now(),
            amount,
            currency,
            status: 'pending'
        };
    }
}
module.exports = CryptoPaymentGateway;
