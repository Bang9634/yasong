-- Add exhibition_type column to exhibitions table
ALTER TABLE exhibitions 
ADD COLUMN exhibition_type VARCHAR(20) NOT NULL DEFAULT 'RETROSPECTIVE' AFTER description;

-- Update existing data to have proper type
-- (기존 데이터는 회고전으로 설정)
UPDATE exhibitions SET exhibition_type = 'RETROSPECTIVE' WHERE exhibition_type = 'RETROSPECTIVE';
