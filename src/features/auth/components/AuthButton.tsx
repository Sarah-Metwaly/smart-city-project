import React from "react";
import { clsx } from "clsx";

interface AuthButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  variant?: "primary" | "ghost";
}

/**
 * AuthButton — full-width submit button with spinner state.
 * Automatically disables itself while loading.
 */
export function AuthButton({
  children,
  isLoading = false,
  loadingText = "Please wait…",
  variant = "primary",
  className,
  disabled,
  ...props
}: AuthButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      disabled={isDisabled}
      aria-busy={isLoading}
      className={clsx(
        "relative w-full rounded-lg px-4 py-2.5 text-sm font-medium",
        "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900",
        "transition-all duration-150 select-none",
        variant === "primary" && [
          "bg-indigo-600 text-white",
          "hover:bg-indigo-500 active:bg-indigo-700",
          "disabled:opacity-50 disabled:cursor-not-allowed",
        ],
        variant === "ghost" && [
          "bg-transparent text-gray-400 border border-gray-700",
          "hover:border-gray-500 hover:text-gray-200",
          "disabled:opacity-40 disabled:cursor-not-allowed",
        ],
        className
      )}
      {...props}
    >
      <span
        className={clsx(
          "flex items-center justify-center gap-2 transition-opacity",
          isLoading && "opacity-0"
        )}
      >
        {children}
      </span>

      {/* Loading overlay */}
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center gap-2">
          <Spinner />
          <span>{loadingText}</span>
        </span>
      )}
    </button>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin text-current"
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
