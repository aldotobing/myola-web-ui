  -- Allow anyone to view product images
    CREATE POLICY "Public Access for Products"
    ON storage.objects FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'myola' AND (storage.foldername(name))[1] = 'products');