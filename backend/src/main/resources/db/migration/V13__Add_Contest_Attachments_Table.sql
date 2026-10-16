-- Add Contest Attachments Table
-- Supports document attachments (PDFs, forms, announcements) for contests
-- Similar to notice_attachments but for contest domain

CREATE TABLE IF NOT EXISTS contest_attachments (
    id BIGINT NOT NULL AUTO_INCREMENT,
    contest_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL COMMENT 'Original filename as uploaded',
    file_url VARCHAR(500) NOT NULL COMMENT 'Server-side storage path',
    file_size BIGINT NOT NULL COMMENT 'File size in bytes',
    content_type VARCHAR(100) NOT NULL COMMENT 'MIME type (e.g., application/pdf)',
    uploaded_at TIMESTAMP NOT NULL COMMENT 'Upload timestamp',
    PRIMARY KEY (id),
    CONSTRAINT fk_contest_attachments_contest
        FOREIGN KEY (contest_id) REFERENCES contests(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Document attachments for contests (forms, announcements, etc.)';

-- Index for fetching attachments by contest
-- Used by: ContestService.getAttachments()
CREATE INDEX idx_contest_attachments_contest_id 
    ON contest_attachments(contest_id);

-- Index for cleanup and monitoring by upload date
CREATE INDEX idx_contest_attachments_uploaded_at 
    ON contest_attachments(uploaded_at);
