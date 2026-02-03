-- Create contests table
CREATE TABLE contests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    location VARCHAR(500) NOT NULL,
    image_url VARCHAR(1000) NOT NULL,
    host VARCHAR(1000) NOT NULL,
    description TEXT NOT NULL,
    announcement_url VARCHAR(1000) NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    
    INDEX idx_start_date (start_date),
    INDEX idx_end_date (end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
