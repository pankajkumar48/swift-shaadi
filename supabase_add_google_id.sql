-- Add google_id column to users table for Google OAuth
-- Run this in your Supabase SQL Editor

ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id TEXT;
