/** @format */

// app/contexts/AuthContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface Profile {
  full_name: string;
  role: 'member' | 'sales' | 'admin';
  points_balance: number;
  avatar_url?: string;
  ktp_number?: string;
  ktp_image_url?: string;
  phone?: string;
  memberUntil?: string | null;
}

interface User extends Profile {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create client outside component to prevent recreation on every render
const supabase = createClient();

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Refs to prevent race conditions and aborted signals
  const fetchingRef = useRef<string | null>(null);
  const isMounted = useRef(true);

  const fetchProfile = useCallback(async (sUser: SupabaseUser) => {
    // Prevent multiple simultaneous fetches for same user
    if (fetchingRef.current === sUser.id) return;
    fetchingRef.current = sUser.id;

    try {
      // Fetch profile and membership in parallel for speed
      const [profileRes, membershipRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", sUser.id).maybeSingle(),
        supabase.from("memberships")
          .select("expires_at, status")
          .eq("user_id", sUser.id)
          .order("activated_at", { ascending: false })
          .limit(1)
          .maybeSingle()
      ]);

      if (!isMounted.current) return;

      if (profileRes.error) {
        // Ignore AbortError as it's usually benign (tab switching/strict mode)
        if (profileRes.error.message?.includes('AbortError')) return;
        console.error("Error fetching profile:", profileRes.error);
        return;
      }

      const profile = profileRes.data;
      const membership = membershipRes.data;

      if (profile) {
        setUser({
          id: sUser.id,
          email: sUser.email!,
          full_name: profile.full_name,
          role: profile.role,
          points_balance: profile.points_balance,
          avatar_url: profile.avatar_url,
          ktp_number: profile.ktp_number,
          ktp_image_url: profile.ktp_image_url,
          phone: profile.phone,
          memberUntil: membership?.expires_at || (membership?.status === 'active' ? 'LIFETIME' : null),
        });
      }
    } catch (error: any) {
      if (!error.message?.includes('AbortError')) {
        console.error("Failed to fetch profile:", error);
      }
    } finally {
      fetchingRef.current = null;
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;

    // 1. Loading Watchdog
    const watchdog = setTimeout(() => {
      if (isLoading && isMounted.current) {
        setIsLoading(false);
      }
    }, 8000);

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user && isMounted.current) {
          setSupabaseUser(session.user);
          await fetchProfile(session.user);
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
          clearTimeout(watchdog);
        }
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (!isMounted.current) return;

          if (session?.user) {
            setSupabaseUser(session.user);
            await fetchProfile(session.user);
          } else {
            setSupabaseUser(null);
            setUser(null);
          }
          setIsLoading(false);
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    };

    // 2. Focus Listener (Debounced)
    let focusTimer: any;
    const handleFocus = () => {
      clearTimeout(focusTimer);
      focusTimer = setTimeout(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && isMounted.current) {
          fetchProfile(session.user);
        }
      }, 500); // Wait 500ms before re-fetching on focus
    };

    window.addEventListener('focus', handleFocus);
    initializeAuth();

    return () => {
      isMounted.current = false;
      window.removeEventListener('focus', handleFocus);
      clearTimeout(watchdog);
      clearTimeout(focusTimer);
    };
  }, [fetchProfile, isLoading]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSupabaseUser(null);
      localStorage.removeItem("myola_cart");
      localStorage.removeItem("checkout_items");
      localStorage.removeItem("payment_data");
      localStorage.removeItem("event_checkout_data");
      localStorage.removeItem("memberRegistrationData");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const refreshProfile = async () => {
    if (supabaseUser) {
      await fetchProfile(supabaseUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, supabaseUser, isLoading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export const isMemberActive = (memberUntil?: string | null) => {
  if (!memberUntil) return false;
  if (memberUntil === 'LIFETIME') return true;
  return new Date(memberUntil).getTime() > Date.now();
};