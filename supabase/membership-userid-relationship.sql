 -- 1. Identify and drop the existing constraint that points to auth.users
    ALTER TABLE public.memberships DROP CONSTRAINT IF EXISTS memberships_user_id_fkey;

   -- 2. Add a new constraint that points to public.profiles(user_id)
   ALTER TABLE public.memberships
   ADD CONSTRAINT memberships_user_id_profiles_fkey
   FOREIGN KEY (user_id)
   REFERENCES public.profiles(user_id)
   ON DELETE CASCADE;