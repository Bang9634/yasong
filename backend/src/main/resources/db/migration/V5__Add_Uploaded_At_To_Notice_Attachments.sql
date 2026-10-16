-- Add uploaded_at column to notice_attachments table
ALTER TABLE notice_attachments
ADD COLUMN uploaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Add index on uploaded_at for better query performance
CREATE INDEX idx_notice_attachments_uploaded_at ON notice_attachments(uploaded_at);
