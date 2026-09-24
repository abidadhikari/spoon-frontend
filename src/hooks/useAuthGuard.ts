"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useGetMe } from "@/hooks/services/auth/useGetMe";

const subscribeToAuthStorage = (callback: () => void) => {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};

const getAuthTokenSnapshot = () =>
  !!window.localStorage.getItem("access_token");

const getServerAuthTokenSnapshot = () => false;

/**
 * Client-side route guard for authenticated pages.
 *
 * Usage: call at the top of a layout or page that requires auth.
 * Shows nothing (loading) until the auth state is resolved.
 *
 * Returns { isLoading, user } so callers can conditionally render.
 */
export const useAuthGuard = () => {
  const router = useRouter();
  const { data: user, isLoading, isError } = useGetMe();
  const hasToken = useSyncExternalStore(
    subscribeToAuthStorage,
    getAuthTokenSnapshot,
    getServerAuthTokenSnapshot,
  );

  useEffect(() => {
    // Wait until we're done loading before deciding to redirect
    if (isLoading) return;

    // No token at all → go to login immediately
    if (!hasToken) {
      router.replace("/login");
      return;
    }

    // Token exists but get-me failed (expired / invalid) → clear + redirect
    if (isError) {
      localStorage.removeItem("access_token");
      router.replace("/login");
    }
  }, [isLoading, isError, hasToken, router]);

  return {
    isLoading:
      isLoading || (!user && hasToken && !isError),
    user,
  };
};

