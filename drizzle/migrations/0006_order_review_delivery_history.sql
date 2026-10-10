ALTER TABLE public.orders ADD COLUMN payment_status text NOT NULL DEFAULT 'অপরিশোধিত', ADD COLUMN paid_amount numeric NOT NULL DEFAULT 0, ADD COLUMN approved_at timestamptz, ADD COLUMN courier_name text, ADD COLUMN tracking_number text, ADD COLUMN delivery_note text, ADD COLUMN history jsonb NOT NULL DEFAULT '[]'::jsonb, ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
UPDATE public.orders SET payment_status = CASE WHEN payment_method = 'ক্যাশ অন ডেলিভারি' THEN 'অপরিশোধিত' ELSE 'যাচাই অপেক্ষায়' END, history = jsonb_build_array(jsonb_build_object('status', status, 'payment_status', CASE WHEN payment_method = 'ক্যাশ অন ডেলিভারি' THEN 'অপরিশোধিত' ELSE 'যাচাই অপেক্ষায়' END, 'at', created_at));
CREATE OR REPLACE FUNCTION public.validate_order_workflow() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
 IF NEW.payment_status NOT IN ('অপরিশোধিত','যাচাই অপেক্ষায়','পরিশোধিত','পেমেন্ট বাতিল','ফেরত দেওয়া হয়েছে') OR NEW.paid_amount < 0 OR NEW.paid_amount > NEW.total THEN RAISE EXCEPTION 'Invalid payment'; END IF;
 IF NEW.payment_status = 'পরিশোধিত' AND NEW.paid_amount <> NEW.total THEN RAISE EXCEPTION 'Full payment required'; END IF;
 IF TG_OP = 'INSERT' THEN
  IF NEW.status <> 'নতুন' OR NEW.paid_amount <> 0 OR NEW.approved_at IS NOT NULL THEN RAISE EXCEPTION 'Invalid initial order'; END IF;
  NEW.payment_status := CASE WHEN NEW.payment_method = 'ক্যাশ অন ডেলিভারি' THEN 'অপরিশোধিত' ELSE 'যাচাই অপেক্ষায়' END;
  NEW.history := jsonb_build_array(jsonb_build_object('status', NEW.status, 'payment_status', NEW.payment_status, 'at', now()));
 ELSE
  IF NEW.status IS DISTINCT FROM OLD.status THEN
   IF NOT ((OLD.status = 'নতুন' AND NEW.status IN ('যাচাই চলছে','অনুমোদিত','বাতিল')) OR (OLD.status = 'যাচাই চলছে' AND NEW.status IN ('অনুমোদিত','বাতিল')) OR (OLD.status = 'অনুমোদিত' AND NEW.status IN ('প্রক্রিয়াধীন','বাতিল')) OR (OLD.status = 'প্রক্রিয়াধীন' AND NEW.status IN ('পাঠানো হয়েছে','বাতিল')) OR (OLD.status = 'পাঠানো হয়েছে' AND NEW.status IN ('সম্পন্ন','বাতিল'))) THEN RAISE EXCEPTION 'Invalid order stage'; END IF;
   IF NEW.status = 'অনুমোদিত' THEN
    IF NEW.payment_method <> 'ক্যাশ অন ডেলিভারি' AND NEW.payment_status <> 'পরিশোধিত' THEN RAISE EXCEPTION 'Verify payment before approval'; END IF;
    NEW.approved_at := now();
   END IF;
   IF NEW.status IN ('প্রক্রিয়াধীন','পাঠানো হয়েছে','সম্পন্ন') AND NEW.approved_at IS NULL THEN RAISE EXCEPTION 'Approval required'; END IF;
   IF NEW.status = 'পাঠানো হয়েছে' AND (coalesce(trim(NEW.courier_name),'') = '' OR coalesce(trim(NEW.tracking_number),'') = '') THEN RAISE EXCEPTION 'Courier details required'; END IF;
   IF NEW.status = 'সম্পন্ন' AND NEW.payment_status <> 'পরিশোধিত' THEN RAISE EXCEPTION 'Payment receipt required'; END IF;
  END IF;
  IF NEW.status IS DISTINCT FROM OLD.status OR NEW.payment_status IS DISTINCT FROM OLD.payment_status OR NEW.paid_amount IS DISTINCT FROM OLD.paid_amount OR NEW.courier_name IS DISTINCT FROM OLD.courier_name OR NEW.tracking_number IS DISTINCT FROM OLD.tracking_number OR NEW.delivery_note IS DISTINCT FROM OLD.delivery_note THEN
   NEW.history := OLD.history || jsonb_build_array(jsonb_build_object('status',NEW.status,'payment_status',NEW.payment_status,'paid_amount',NEW.paid_amount,'courier_name',NEW.courier_name,'tracking_number',NEW.tracking_number,'note',NEW.delivery_note,'at',now()));
  ELSE NEW.history := OLD.history; END IF;
 END IF;
 NEW.updated_at := now();
 RETURN NEW;
END; $$;
CREATE TRIGGER order_workflow_guard BEFORE INSERT OR UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.validate_order_workflow();