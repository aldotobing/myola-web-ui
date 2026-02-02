/** @format */

"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

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
  isInitialLoading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const supabase = createClient();

/**
 * Utility to wrap a promise with a timeout
 */
const withTimeout = (promise: Promise<any>, ms: number) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), ms))
  ]);
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const router = useRouter();
  const isMounted = useRef(true);
  const fetchingRef = useRef<string | null>(null);

  const fetchProfile = useCallback(async (sUser: SupabaseUser) => {
    if (fetchingRef.current === sUser.id) return;
    fetchingRef.current = sUser.id;

    try {
      // Use maybeSingle and parallel fetch with a soft timeout
      const response = await withTimeout(
        Promise.all([
          supabase.from("profiles").select("*").eq("user_id", sUser.id).maybeSingle(),
          supabase.from("memberships")
            .select("expires_at, status")
            .eq("user_id", sUser.id)
            .order("activated_at", { ascending: false })
            .limit(1)
            .maybeSingle()
        ]),
        5000 // 5 seconds to fetch profile
      );

      if (!isMounted.current) return;

      const [profileRes, membershipRes] = response;
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
      // Silently ignore aborts and timeouts to keep the app "un-stuck"
      if (!error.message?.includes('AbortError') && error.message !== 'Timeout') {
        console.error("Auth fetch error:", error);
      }
    } finally {
      fetchingRef.current = null;
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;

    const initializeAuth = async () => {
      try {
        // RACE: Don't let a stuck lock block the entire app boot
        const sessionRes = await withTimeout(supabase.auth.getSession(), 3000)
          .catch(() => ({ data: { session: null } })); // Fallback to null session on timeout/lock error
        
        const session = sessionRes.data?.session;
        if (session?.user && isMounted.current) {
          setSupabaseUser(session.user);
          await fetchProfile(session.user);
        }
      } catch (err) {
        // Ignore initialization errors
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
          setIsInitialLoading(false);
        }
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (!isMounted.current) return;

          if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
            if (session?.user) {
              setSupabaseUser(session.user);
              await fetchProfile(session.user);
            }
          } else if (event === "SIGNED_OUT") {
            setSupabaseUser(null);
            setUser(null);
            router.refresh(); 
          }
          setIsLoading(false);
          setIsInitialLoading(false); // Ensure this is cleared
        }
      );

      return () => subscription.unsubscribe();
    };

    const handleFocus = async () => {
      // Re-verify session validity on window focus with race protection
      try {
        const sessionRes = await withTimeout(supabase.auth.getSession(), 2000).catch(() => null);
        if (sessionRes?.data?.session?.user && isMounted.current) {
          fetchProfile(sessionRes.data.session.user);
        }
      } catch (e) { /* ignore focus check errors */ }
    };

    window.addEventListener('focus', handleFocus);
    initializeAuth();

    return () => {
      isMounted.current = false;
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchProfile, router]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSupabaseUser(null);
      localStorage.clear();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const refreshProfile = async () => {
    if (supabaseUser) await fetchProfile(supabaseUser);
  };

  return (
    <AuthContext.Provider value={{ user, supabaseUser, isLoading, isInitialLoading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

export const isMemberActive = (memberUntil?: string | null) => {
  if (!memberUntil) return false;
  if (memberUntil === 'LIFETIME') return true;
  return new Date(memberUntil).getTime() > Date.now();
};
