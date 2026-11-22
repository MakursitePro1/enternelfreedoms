DROP POLICY IF EXISTS "Public create wallet orders for review" ON public.orders;
CREATE POLICY "Public create wallet orders for review" ON public.orders FOR INSERT TO anon, authenticated
WITH CHECK (status = 'নতুন' AND payment_method = ANY (ARRAY['বিকাশ','নগদ','রকেট','উপায়']) AND payment_reference IS NOT NULL AND length(payment_reference) BETWEEN 5 AND 100);
UPDATE public.books SET cover_url = '/__l5e/assets-v1/6999a65c-01ea-4a74-9299-a4a587c6f0a3/magic-english-reader.jpg' WHERE slug = 'magic-english';