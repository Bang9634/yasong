-- Add collections table

CREATE TABLE IF NOT EXISTS collections (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    year VARCHAR(100) NOT NULL,
    size VARCHAR(100) NOT NULL,
    image_url VARCHAR(1000) NOT NULL,
    description TEXT NOT NULL,
    artist VARCHAR(200) NOT NULL,
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create indexes for better performance
CREATE INDEX idx_collections_is_pinned ON collections(is_pinned);
CREATE INDEX idx_collections_created_at ON collections(created_at);
