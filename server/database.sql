-- ایجاد دیتابیس
CREATE DATABASE IF NOT EXISTS conversion_3d;
USE conversion_3d;

-- جدول تراکنش‌ها
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    amount DECIMAL(10,2) NOT NULL,
    profit DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    description TEXT,
    status ENUM('pending', 'completed', 'failed', 'withdrawal') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- جدول برداشت‌ها
CREATE TABLE IF NOT EXISTS withdrawals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    wallet_address VARCHAR(255) NOT NULL,
    network VARCHAR(20) NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    tx_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL
);

-- جدول کاربران
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    wallet_address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ایندکس‌ها برای عملکرد بهتر
CREATE INDEX idx_transactions_created ON transactions(created_at);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_withdrawals_status ON withdrawals(status);

-- داده‌های نمونه
INSERT INTO transactions (user_id, amount, profit, currency, description, status) VALUES
(1, 100.00, 30.00, 'USD', 'تبدیل تصویر پرتره به 3D', 'completed'),
(2, 150.00, 45.00, 'USD', 'تبدیل تصویر محصول به 3D', 'completed'),
(3, 200.00, 60.00, 'USD', 'تبدیل تصویر معماری به 3D', 'pending');
