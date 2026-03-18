-- ================================================
-- Invoice & Business Profile Enhancement Migration
-- Run this in your Supabase SQL Editor
-- ================================================

-- Add business/tax fields to designer_profiles
ALTER TABLE designer_profiles ADD COLUMN IF NOT EXISTS gstin TEXT;
ALTER TABLE designer_profiles ADD COLUMN IF NOT EXISTS pan_number TEXT;
ALTER TABLE designer_profiles ADD COLUMN IF NOT EXISTS hsn_sac_code TEXT DEFAULT '9971';
ALTER TABLE designer_profiles ADD COLUMN IF NOT EXISTS invoice_due_days INTEGER DEFAULT 7;

-- Add bank/payment fields to designer_profiles
ALTER TABLE designer_profiles ADD COLUMN IF NOT EXISTS bank_name TEXT;
ALTER TABLE designer_profiles ADD COLUMN IF NOT EXISTS bank_account_number TEXT;
ALTER TABLE designer_profiles ADD COLUMN IF NOT EXISTS bank_ifsc TEXT;
ALTER TABLE designer_profiles ADD COLUMN IF NOT EXISTS upi_id TEXT;
