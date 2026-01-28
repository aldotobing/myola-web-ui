  -- Fix Commissions
     ALTER TABLE public.commissions DROP CONSTRAINT IF EXISTS commissions_user_id_fkey;
    ALTER TABLE public.commissions ADD CONSTRAINT commissions_user_id_profiles_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;
    
    -- Fix Orders
    ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;
    ALTER TABLE public.orders ADD CONSTRAINT orders_user_id_profiles_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

    -- Fix Event Orders
   ALTER TABLE public.event_orders DROP CONSTRAINT IF EXISTS event_orders_user_id_fkey;
   ALTER TABLE public.event_orders ADD CONSTRAINT event_orders_user_id_profiles_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;