import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth.services";
import type { ResetPasswordPayload } from "../types/auth.types";
import { extractApiError } from "../../../lib/extractApiError";

export function useResetPassword() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (payload: ResetPasswordPayload) =>
      authService.resetPassword(payload),
    onSuccess: () => {
      // Give the success message time to render before redirect
      setTimeout(() => navigate("/login", { replace: true }), 2500);
    },
  });

  return {
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    successMessage: mutation.data?.message ?? null,
    error: mutation.error ? extractApiError(mutation.error) : null,
  };
}
