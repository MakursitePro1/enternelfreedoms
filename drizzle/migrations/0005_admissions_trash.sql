ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
CREATE EXTENSION IF NOT EXISTS pg_cron;