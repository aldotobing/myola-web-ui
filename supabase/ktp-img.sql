CREATE POLICY "Users can upload their own KTP"
     ON storage.objects FOR INSERT
     TO authenticated
     WITH CHECK (
       bucket_id = 'myola' AND
       (storage.foldername(name))[1] = 'ktp' AND
       (storage.filename(name) LIKE auth.uid() || '-%')
   );

   -- 2. Allow users to view (Select) their own KTP
   -- This is what 'createSignedUrl' needs to work!
   CREATE POLICY "Users can view their own KTP"
   ON storage.objects FOR SELECT
   TO authenticated
   USING (
      bucket_id = 'myola' AND
      (storage.foldername(name))[1] = 'ktp' AND
      (storage.filename(name) LIKE auth.uid() || '-%')
   );

   -- 3. Allow users to update/replace their own KTP
   CREATE POLICY "Users can update their own KTP"
   ON storage.objects FOR UPDATE
   TO authenticated
   USING (
      bucket_id = 'myola' AND
      (storage.foldername(name))[1] = 'ktp' AND
      (storage.filename(name) LIKE auth.uid() || '-%')
   );