"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthUser } from "@/lib/auth/authTypes";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type AuthContextValue = {
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;
  isCloudConfigured: boolean;
  refresh: () => void;
};

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  accessToken: null,
  isLoading: true,
  isCloudConfigured: false,
  refresh: () => undefined,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const cloudConfigured = isSupabaseConfigured();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(() => cloudConfigured);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (!cloudConfigured) {
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      return;
    }

    let mounted = true;

    async function loadSession() {
      const { data } = await supabase!.auth.getSession();
      if (!mounted) return;

      if (data.session?.user) {
        setUser({
          id: data.session.user.id,
          email: data.session.user.email ?? "",
          displayName:
            (data.session.user.user_metadata?.display_name as string) ??
            undefined,
        });
        setAccessToken(data.session.access_token);
      } else {
        setUser(null);
        setAccessToken(null);
      }
      setIsLoading(false);
    }

    void loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? "",
          displayName:
            (session.user.user_metadata?.display_name as string) ?? undefined,
        });
        setAccessToken(session.access_token);
      } else {
        setUser(null);
        setAccessToken(null);
      }
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
    // refreshKey triggers re-check after manual refresh
  }, [cloudConfigured, refreshKey]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      isLoading,
      isCloudConfigured: cloudConfigured,
      refresh,
    }),
    [user, accessToken, isLoading, cloudConfigured, refresh],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
