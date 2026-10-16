-- Add CONTEST to NoticeCategory enum
-- This migration ensures the database supports the CONTEST category that was added to the NoticeCategory enum

-- Change category column from ENUM to VARCHAR to support all category values
ALTER TABLE notices MODIFY COLUMN category VARCHAR(50) NOT NULL;
