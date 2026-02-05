-- =============================================================================
-- FIX RLS FOR ORDER DELIVERY CONFIRMATION
-- =============================================================================
-- Issue: Users getting "new row violates row-level security policy" when confirming order.
-- Cause: Missing UPDATE policy for 'orders' table for regular auth users.
-- =============================================================================

-- 1. Allow authenticated users to update their own orders
-- This allows them to change status to 'selesai' and add delivery_proof_url
CREATE POLICY "Users can update own orders"
    ON orders FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 2. Allow authenticated users to upload delivery proofs
-- This targets the 'myola' bucket and 'delivery-proofs' folder
CREATE POLICY "Users can upload delivery proofs"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'myola' AND 
        (storage.foldername(name))[1] = 'delivery-proofs'
    );

-- 3. Allow authenticated users to view delivery proofs (Defensive)
CREATE POLICY "Users can view delivery proofs"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'myola' AND 
        (storage.foldername(name))[1] = 'delivery-proofs'
    );
