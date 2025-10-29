CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    api_token VARCHAR(255) UNIQUE,
    plan_type VARCHAR(50) DEFAULT 'free',
    credits INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conversions (
    id VARCHAR(50) PRIMARY KEY,
    user_id INTEGER,
    status VARCHAR(20) DEFAULT 'queued',
    input_file VARCHAR(500),
    output_file VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_conversions_user_id ON conversions(user_id);
CREATE INDEX idx_conversions_status ON conversions(status);
