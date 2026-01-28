 -- Ensure the bucket is public (This is often a toggle in UI, but this SQL helps)
    UPDATE storage.buckets SET public = true WHERE id = 'myola';
   
    -- 2. Allow anyone (including guests) to see files in the 'products' folder
    DROP POLICY IF EXISTS "Public Access for Products" ON storage.objects;
    CREATE POLICY "Public Access for Products"
    ON storage.objects FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'myola' AND (storage.foldername(name))[1] = 'products');