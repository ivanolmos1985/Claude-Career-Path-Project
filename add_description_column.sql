-- Add description column to competencies table
ALTER TABLE IF EXISTS public.competencies
ADD COLUMN IF NOT EXISTS description TEXT;
