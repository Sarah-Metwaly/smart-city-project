import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.services";
import type { ForgotPasswordPayload } from "../types/auth.types";
import { extractApiError } from "../../../lib/extractApiError";

export function useForgotPassword() {
  const mutation = useMutation({
    mutationFn: (payload: ForgotPasswordPayload) =>
      authService.forgotPassword(payload),
  });

  return {
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    successMessage: mutation.data?.message ?? null,
    error: mutation.error ? extractApiError(mutation.error) : null,
  };
}
