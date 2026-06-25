import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { tokenManager } from "../features/auth/utils/tokenManager";
import { authService } from "../features/auth/services/auth.services";
import { useAuth } from "../features/auth/hooks/useAuth";

type Status = "checking" | "authorized" | "unauthorized";

/**
 * ProtectedRoute
 *
 * Render flow:
 * 1. If a token already exists in memory → allow through immediately.
 * 2. If no token → attempt a silent refresh (refresh token cookie is sent
 *    automatically by the browser).
 * 3. If refresh succeeds → store the new token and allow through.
 * 4. If refresh fails → redirect to /login.
 *
 * This covers both "tab just opened" and "token expired mid-session" scenarios.
 */
export default function ProtectedRoute() {
  const { setUser } = useAuth();
  const [status, setStatus] = useState<Status>(() =>
    tokenManager.hasToken() ? "authorized" : "checking"
  );

  useEffect(() => {
    // Already authorized — nothing to do
    if (status === "authorized") return;

    let cancelled = false;

    async function attemptRefresh() {
      try {
        const response = await authService.refreshToken();
        if (cancelled) return;
        tokenManager.setAccessToken(response.data.accessToken);
        setStatus("authorized");
      } catch {
        if (cancelled) return;
        tokenManager.clearAccessToken();
        setStatus("unauthorized");
      }
    }

    attemptRefresh();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "checking") {
    return <FullPageSpinner />;
  }

  if (status === "unauthorized") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function FullPageSpinner() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <svg
        className="h-8 w-8 animate-spin text-indigo-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-label="Loading"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    </div>
  );
}
