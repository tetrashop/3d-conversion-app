-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    api_token VARCHAR(255) UNIQUE,
    plan_type VARCHAR(50) DEFAULT 'free',
    credits INTEGER DEFAULT 0,
    total_conversions INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Conversions table
CREATE TABLE IF NOT EXISTS conversions (
    id VARCHAR(50) PRIMARY KEY,
    user_id INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'queued',
    input_file VARCHAR(500) NOT NULL,
    output_file VARCHAR(500),
    output_format VARCHAR(10),
    file_size INTEGER,
    processing_time FLOAT,
    error_message TEXT,
    credits_used INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    started_at DATETIME,
    completed_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(50) PRIMARY KEY,
    user_id INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    currency VARCHAR(10) DEFAULT 'IRT',
    payment_method VARCHAR(20),
    status VARCHAR(20) DEFAULT 'pending',
    transaction_id VARCHAR(255),
    credits_added INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- API keys table
CREATE TABLE IF NOT EXISTS api_keys (
    id VARCHAR(50) PRIMARY KEY,
    user_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    key_hash VARCHAR(255) NOT NULL,
    last_used DATETIME,
    is_active BOOLEAN DEFAULT true,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- System settings
CREATE TABLE IF NOT EXISTS settings (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_conversions_user_id ON conversions(user_id);
CREATE INDEX idx_conversions_status ON conversions(status);
CREATE INDEX idx_conversions_created_at ON conversions(created_at);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);

-- Default settings
INSERT INTO settings (key, value, description) VALUES
('conversion_price', '1', 'تعداد اعتبار مورد نیاز برای هر تبدیل'),
('max_file_size', '104857600', 'حداکثر حجم فایل ورودی (بایت)'),
('supported_formats', 'stl,obj,glb', 'فرمت‌های خروجی پشتیبانی شده'),
('crypto_payments', 'true', 'فعال بودن پرداخت‌های رمزارزی'),
('maintenance_mode', 'false', 'حالت تعمیرات سیستم');
