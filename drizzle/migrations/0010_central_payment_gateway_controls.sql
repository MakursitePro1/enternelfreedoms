CREATE TABLE public.payment_gateways (id text PRIMARY KEY, enabled boolean NOT NULL DEFAULT false, mode text NOT NULL DEFAULT 'sandbox' CHECK (mode IN ('sandbox','live','manual')), account_number text NOT NULL DEFAULT '', merchant_id text NOT NULL DEFAULT '', updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.payment_gateways TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.payment_gateways TO authenticated;
GRANT ALL ON public.payment_gateways TO service_role;
ALTER TABLE public.payment_gateways ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public safe gateway configuration" ON public.payment_gateways FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Administrator gateway controls" ON public.payment_gateways FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TABLE public.payment_attempts (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), order_reference text NOT NULL REFERENCES public.orders(reference), gateway text NOT NULL, transaction_id text UNIQUE NOT NULL, provider_reference text UNIQUE, mode text NOT NULL, amount numeric(10,2) NOT NULL, status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','failed')), created_at timestamptz NOT NULL DEFAULT now(), verified_at timestamptz);
GRANT SELECT ON public.payment_attempts TO authenticated;
GRANT ALL ON public.payment_attempts TO service_role;
ALTER TABLE public.payment_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Administrator payment history" ON public.payment_attempts FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE OR REPLACE FUNCTION public.confirm_gateway_payment(_transaction_id text, _provider_reference text, _amount numeric) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE attempt public.payment_attempts; existing_order public.orders;
BEGIN
 SELECT * INTO attempt FROM public.payment_attempts WHERE transaction_id=_transaction_id FOR UPDATE;
 IF NOT FOUND OR attempt.amount <> _amount THEN RETURN false; END IF;
 IF attempt.status='paid' THEN RETURN attempt.provider_reference=_provider_reference; END IF;
 SELECT * INTO existing_order FROM public.orders WHERE reference=attempt.order_reference FOR UPDATE;
 IF NOT FOUND OR existing_order.total <> _amount OR existing_order.status='বাতিল' THEN RETURN false; END IF;
 UPDATE public.payment_attempts SET status='paid',provider_reference=_provider_reference,verified_at=now() WHERE id=attempt.id;
 UPDATE public.orders SET payment_status='পরিশোধিত',paid_amount=_amount,payment_reference=_provider_reference WHERE reference=attempt.order_reference;
 RETURN true;
END; $$;
REVOKE ALL ON FUNCTION public.confirm_gateway_payment(text,text,numeric) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_gateway_payment(text,text,numeric) TO service_role;