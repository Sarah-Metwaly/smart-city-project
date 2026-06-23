import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { AuthCard } from "../components/AuthCard";
import { AlertBanner } from "../components/AlertBanner";
import { useVerifyEmail } from "../hooks/useVerifyEmail";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const { mutateAsync, isPending, isSuccess, error } = useVerifyEmail();

  // Auto-submit the token as soon as the page mounts
  useEffect(() => {
    if (token) {
      mutateAsync({ token }).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthCard title="Email verification">
      <div className="space-y-4">
        {/* No token in URL */}
        {!token && (
          <AlertBanner
            variant="error"
            message="No verification token found. Please check the link in your email."
          />
        )}

        {/* Verifying… */}
        {token && isPending && (
          <div className="flex items-center justify-center gap-3 py-4 text-sm text-gray-400">
            <Spinner />
            <span>Verifying your email…</span>
          </div>
        )}

        {/* Success */}
        {isSuccess && (
          <AlertBanner
            variant="success"
            message="Your email has been verified. Redirecting you to sign in…"
          />
        )}

        {/* Error */}
        {error && (
          <>
            <AlertBanner variant="error" message={error.message} />
            <p className="text-center text-sm text-gray-500">
              <Link
                to="/login"
                className="text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Back to sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </AuthCard>
  );
}

function Spinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin text-indigo-400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
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
  );
}
