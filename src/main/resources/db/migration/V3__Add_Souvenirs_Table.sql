-- Add souvenirs table

CREATE TABLE IF NOT EXISTS souvenirs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    image_url VARCHAR(1000) NOT NULL,
    description TEXT NOT NULL,
    price DOUBLE NOT NULL,
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create index for better performance
CREATE INDEX idx_souvenirs_is_pinned ON souvenirs(is_pinned);
CREATE INDEX idx_souvenirs_created_at ON souvenirs(created_at);
