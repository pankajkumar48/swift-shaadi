-- Add phone column to users table for SMS OTP authentication
-- Run this in the Supabase SQL Editor

ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20) UNIQUE;

-- Create index for faster phone lookups
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
