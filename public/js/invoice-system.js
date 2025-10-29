// سیستم فاکتورسازی و پشتیبانی رسمی
class InvoiceSystem {
    constructor() {
        this.invoices = [];
        this.taxRate = 0.09; // 9% مالیات بر ارزش افزوده
    }

    // ایجاد فاکتور رسمی
    createInvoice(userInfo, plan, fileInfo) {
        const invoice = {
            id: 'INV-' + Date.now(),
            date: new Date().toLocaleDate('fa-IR'),
            time: new Date().toLocaleTimeString('fa-IR'),
            user: userInfo,
            plan: plan,
            file: fileInfo,
            subtotal: plan.price,
            tax: Math.round(plan.price * this.taxRate),
            total: Math.round(plan.price * (1 + this.taxRate)),
            status: 'paid',
            trackingCode: 'TRK-' + Math.random().toString(36).substr(2, 8).toUpperCase()
        };

        this.invoices.push(invoice);
        this.saveInvoice(invoice);
        return invoice;
    }

    // ذخیره فاکتور
    saveInvoice(invoice) {
        const invoices = JSON.parse(localStorage.getItem('3d_invoices') || '[]');
        invoices.push(invoice);
        localStorage.setItem('3d_invoices', JSON.stringify(invoices));
    }

    // تولید متن فاکتور
    generateInvoiceText(invoice) {
        return `
        🧾 فاکتور رسمی خدمات تبدیل 3D
        ----------------------------
        📋 شماره فاکتور: ${invoice.id}
        📅 تاریخ: ${invoice.date}
        ⏰ زمان: ${invoice.time}
        
        👤 اطلاعات مشتری:
        نام: ${invoice.user.fullName}
        کد ملی: ${invoice.user.nationalCode}
        موبایل: ${invoice.user.phone}
        
        🎯 خدمات:
        پلن: ${invoice.plan.name}
        زمان تحویل: ${invoice.plan.time}
        فایل: ${invoice.file.name}
        
        💰 مبلغ:
        هزینه سرویس: ${invoice.subtotal.toLocaleString()} تومان
        مالیات ارزش افزوده: ${invoice.tax.toLocaleString()} تومان
        جمع کل: ${invoice.total.toLocaleString()} تومان
        
        🔍 کد پیگیری: ${invoice.trackingCode}
        📞 پشتیبانی: XXX XXX XXX
        
        با تشکر از اعتماد شما
        `.trim();
    }

    // دانلود فاکتور
    downloadInvoice(invoice) {
        const invoiceText = this.generateInvoiceText(invoice);
        const blob = new Blob([invoiceText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `فاکتور-${invoice.id}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// سیستم پشتیبانی
class SupportSystem {
    constructor() {
        this.supportContacts = {
            email: 'support@3d-conversion.com',
            whatsapp: 'XXX XXX XXX',
            phone: '۰۲۱-XXXXXXX'
        };
    }

    // ایجاد تیکت پشتیبانی
    createSupportTicket(userInfo, issue, priority = 'normal') {
        const ticket = {
            id: 'TKT-' + Date.now(),
            user: userInfo,
            issue: issue,
            priority: priority,
            status: 'open',
            createdAt: new Date().toISOString(),
            responses: []
        };

        this.saveTicket(ticket);
        return ticket;
    }

    // ذخیره تیکت
    saveTicket(ticket) {
        const tickets = JSON.parse(localStorage.getItem('3d_support_tickets') || '[]');
        tickets.push(ticket);
        localStorage.setItem('3d_support_tickets', JSON.stringify(tickets));
    }

    // ارسال پیام به پشتیبانی
    sendSupportMessage(ticketId, message) {
        const tickets = JSON.parse(localStorage.getItem('3d_support_tickets') || '[]');
        const ticket = tickets.find(t => t.id === ticketId);
        
        if (ticket) {
            ticket.responses.push({
                message: message,
                from: 'user',
                timestamp: new Date().toISOString()
            });
            
            localStorage.setItem('3d_support_tickets', JSON.stringify(tickets));
            
            // شبیه‌سازی پاسخ پشتیبانی
            setTimeout(() => {
                this.simulateSupportResponse(ticketId);
            }, 5000);
        }
    }

    // شبیه‌سازی پاسخ پشتیبانی
    simulateSupportResponse(ticketId) {
        const tickets = JSON.parse(localStorage.getItem('3d_support_tickets') || '[]');
        const ticket = tickets.find(t => t.id === ticketId);
        
        if (ticket) {
            const responses = [
                'پیام شما دریافت شد. همکاران ما در حال بررسی هستند.',
                'سپاس از تماس شما. مشکل در حال پیگیری است.',
                'برای بررسی دقیق‌تر، لطفاً اطلاعات بیشتری ارائه دهید.',
                'مشکل گزارش شده برطرف گردید. در صورت نیاز مجدد تماس بگیرید.'
            ];
            
            ticket.responses.push({
                message: responses[Math.floor(Math.random() * responses.length)],
                from: 'support',
                timestamp: new Date().toISOString()
            });
            
            localStorage.setItem('3d_support_tickets', JSON.stringify(tickets));
            
            // نمایش نوتیفیکیشن
            if (Notification.permission === 'granted') {
                new Notification('💬 پاسخ پشتیبانی', {
                    body: 'پاسخ جدید از پشتیبانی دریافت شد',
                    icon: '/icon.png'
                });
            }
        }
    }
}

// نمونه‌های جهانی
const invoiceSystem = new InvoiceSystem();
const supportSystem = new SupportSystem();

// صادر کردن برای استفاده جهانی
window.invoiceSystem = invoiceSystem;
window.supportSystem = supportSystem;
