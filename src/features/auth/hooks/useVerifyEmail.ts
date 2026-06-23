import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth.services";
import type { VerifyEmailPayload } from "../types/auth.types";
import { extractApiError } from "../../../lib/extractApiError";

export function useVerifyEmail() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (payload: VerifyEmailPayload) =>
      authService.verifyEmail(payload),
    onSuccess: () => {
      setTimeout(() => navigate("/login", { replace: true }), 2500);
    },
  });

  return {
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error ? extractApiError(mutation.error) : null,
  };
}
