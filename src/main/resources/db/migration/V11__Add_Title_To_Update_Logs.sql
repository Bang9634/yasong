-- Add title column to update_logs table
ALTER TABLE update_logs 
ADD COLUMN title VARCHAR(200) NOT NULL AFTER id;
