-- Run this SQL in your Supabase SQL Editor to add the accompanying_count column to existing guests table
-- This is an update script for existing databases

ALTER TABLE guests ADD COLUMN IF NOT EXISTS accompanying_count INTEGER NOT NULL DEFAULT 0;
