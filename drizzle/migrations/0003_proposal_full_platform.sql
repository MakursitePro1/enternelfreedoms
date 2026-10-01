ALTER TABLE public.institution_content DROP CONSTRAINT institution_content_kind_check;
ALTER TABLE public.institution_content ADD CONSTRAINT institution_content_kind_check CHECK (kind IN ('teacher','achievement','event','gallery','testimonial','facility','meal','program','stat','news','video','safety','fee','faq'));
ALTER TABLE public.institution_content ADD COLUMN IF NOT EXISTS slug text;

ALTER TABLE public.books ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS author text;
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS pages integer;
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS details text;
CREATE UNIQUE INDEX IF NOT EXISTS books_slug_key ON public.books(slug) WHERE slug IS NOT NULL;

ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS documents jsonb NOT NULL DEFAULT '[]'::jsonb;

CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  subject text NOT NULL DEFAULT 'সাধারণ জিজ্ঞাসা',
  message text NOT NULL,
  status text NOT NULL DEFAULT 'নতুন',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin read messages" ON public.contact_messages FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admin update messages" ON public.contact_messages FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admin delete messages" ON public.contact_messages FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin write settings" ON public.site_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));