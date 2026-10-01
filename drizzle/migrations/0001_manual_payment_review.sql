-- Mobile wallet transaction identifiers are submitted for staff review, never automatically verified.
DROP POLICY IF EXISTS "Public create COD orders" ON public.orders;
CREATE POLICY "Public create orders for review" ON public.orders FOR INSERT TO anon, authenticated
WITH CHECK (
  status = 'নতুন' AND (
    (payment_method = 'ক্যাশ অন ডেলিভারি' AND payment_reference IS NULL)
    OR (payment_method IN ('বিকাশ', 'নগদ') AND payment_reference IS NOT NULL AND length(payment_reference) BETWEEN 5 AND 100)
  )
);
