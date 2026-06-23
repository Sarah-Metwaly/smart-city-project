import { useQueryClient } from "@tanstack/react-query";
import { tokenManager } from "../utils/tokenManager";
import type { AuthUser } from "../types/auth.types";

export const AUTH_USER_KEY = ["auth", "user"] as const;

/**
 * useAuth
 *
 * Lightweight hook that reads the current user from the TanStack Query cache
 * and exposes auth utilities. No Context API required — the cache is the
 * source of truth for the user object.
 */
export function useAuth() {
  const queryClient = useQueryClient();

  const user = queryClient.getQueryData<AuthUser>(AUTH_USER_KEY) ?? null;
  const isAuthenticated = user !== null && tokenManager.hasToken();

  function setUser(u: AuthUser): void {
    queryClient.setQueryData(AUTH_USER_KEY, u);
  }

  function clearUser(): void {
    queryClient.removeQueries({ queryKey: AUTH_USER_KEY });
    tokenManager.clearAccessToken();
  }

  return {
    user,
    isAuthenticated,
    setUser,
    clearUser,
  };
}
