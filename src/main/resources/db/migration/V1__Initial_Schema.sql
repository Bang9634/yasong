-- Initial Schema
-- Created for existing database baseline

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(50),
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    created_at DATETIME,
    updated_at DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create notices table
CREATE TABLE IF NOT EXISTS notices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    view_count INT NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'PUBLISHED',
    author_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    deleted_at DATETIME,
    FOREIGN KEY (author_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create notice_attachments table
CREATE TABLE IF NOT EXISTS notice_attachments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    notice_id BIGINT,
    file_name VARCHAR(255),
    file_url VARCHAR(1000),
    file_size BIGINT,
    content_type VARCHAR(100),
    FOREIGN KEY (notice_id) REFERENCES notices(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create collections table
CREATE TABLE IF NOT EXISTS collections (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    year VARCHAR(100) NOT NULL,
    size VARCHAR(100) NOT NULL,
    image_url VARCHAR(1000) NOT NULL,
    description TEXT NOT NULL,
    display_order INT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create exhibitions table
CREATE TABLE IF NOT EXISTS exhibitions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    artist VARCHAR(200) NOT NULL,
    location VARCHAR(500) NOT NULL,
    image_url VARCHAR(1000) NOT NULL,
    description TEXT NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create website_settings table
CREATE TABLE IF NOT EXISTS website_settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    description VARCHAR(500),
    created_at DATETIME NOT NULL,
    updated_at DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create login_logs table
CREATE TABLE IF NOT EXISTS login_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    ip_address VARCHAR(45) NOT NULL,
    username VARCHAR(50) NOT NULL,
    device_type VARCHAR(20),
    browser VARCHAR(100),
    os VARCHAR(100),
    login_time DATETIME NOT NULL,
    created_at DATETIME,
    login_status VARCHAR(20) NOT NULL,
    failure_reason VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create indexes for better performance
CREATE INDEX idx_notices_author ON notices(author_id);
CREATE INDEX idx_notices_category ON notices(category);
CREATE INDEX idx_notices_status ON notices(status);
CREATE INDEX idx_notices_created_at ON notices(created_at);
CREATE INDEX idx_collections_display_order ON collections(display_order);
CREATE INDEX idx_exhibitions_start_date ON exhibitions(start_date);
CREATE INDEX idx_exhibitions_end_date ON exhibitions(end_date);
CREATE INDEX idx_website_settings_key ON website_settings(setting_key);
CREATE INDEX idx_login_logs_user_id ON login_logs(user_id);
CREATE INDEX idx_login_logs_login_time ON login_logs(login_time);
