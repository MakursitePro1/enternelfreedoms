CREATE OR REPLACE FUNCTION public.public_track_order(_reference text, _phone text)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT to_jsonb(t) FROM (SELECT reference,customer_name,phone,address,items,status,created_at,total,payment_method,payment_reference,payment_status,paid_amount,approved_at,courier_name,tracking_number,delivery_note,history,updated_at FROM public.orders WHERE reference = upper(trim(_reference)) AND phone = _phone LIMIT 1) t
$$;
CREATE OR REPLACE FUNCTION public.public_track_admission(_reference text, _phone text)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT to_jsonb(t) FROM (SELECT student_name,program,status,created_at FROM public.admissions WHERE reference = upper(trim(_reference)) AND phone = _phone LIMIT 1) t
$$;
REVOKE ALL ON FUNCTION public.public_track_order(text,text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.public_track_admission(text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.public_track_order(text,text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.public_track_admission(text,text) TO anon, authenticated;

GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT INSERT ON public.admissions TO anon, authenticated;
GRANT INSERT ON public.orders TO anon, authenticated;
CREATE POLICY "Public submit contact" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (status = 'নতুন');

CREATE POLICY "Public upload admission docs" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'admission-docs');
CREATE POLICY "Admin read admission docs" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'admission-docs' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admin upload site media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-media' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admin read site media" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'site-media' AND public.has_role(auth.uid(),'admin'));