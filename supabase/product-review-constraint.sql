 -- 1. Identify and drop the existing constraint that points to auth.users
    ALTER TABLE public.product_reviews DROP CONSTRAINT IF EXISTS product_reviews_user_id_fkey;
   
    -- 2. Add a new constraint that points to public.profiles(user_id)
    ALTER TABLE public.product_reviews
    ADD CONSTRAINT product_reviews_user_id_profiles_fkey
    FOREIGN KEY (user_id)
    REFERENCES public.profiles(user_id)
    ON DELETE CASCADE;