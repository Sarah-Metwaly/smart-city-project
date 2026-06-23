import { clsx } from "clsx";

interface AlertBannerProps {
  variant: "error" | "success";
  message: string;
}

export function AlertBanner({ variant, message }: AlertBannerProps) {
  return (
    <div
      role="alert"
      className={clsx(
        "rounded-lg border px-4 py-3 text-sm flex items-start gap-2.5",
        variant === "error" &&
          "bg-red-950/60 border-red-800 text-red-300",
        variant === "success" &&
          "bg-emerald-950/60 border-emerald-800 text-emerald-300"
      )}
    >
      <span className="mt-0.5 shrink-0" aria-hidden="true">
        {variant === "error" ? "✕" : "✓"}
      </span>
      <span>{message}</span>
    </div>
  );
}
