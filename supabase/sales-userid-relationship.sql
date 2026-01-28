 -- 1. Identify and drop the existing constraint that points to auth.users
     -- Note: The name might vary, usually it is 'sales_user_id_fkey'
     ALTER TABLE public.sales DROP CONSTRAINT IF EXISTS sales_user_id_fkey;
    
     -- 2. Add a new constraint that points to public.profiles(user_id)
    -- This allows Supabase to see the direct relationship for joining
    ALTER TABLE public.sales
    ADD CONSTRAINT sales_user_id_profiles_fkey
    FOREIGN KEY (user_id)
    REFERENCES public.profiles(user_id)
    ON DELETE CASCADE;