import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.services";
import type { SignupPayload } from "../types/auth.types";
import { extractApiError } from "../../../lib/extractApiError";

export function useSignup() {
  const mutation = useMutation({
    mutationFn: (payload: SignupPayload) => authService.signup(payload),
  });

  return {
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    successMessage: mutation.data?.message ?? null,
    error: mutation.error ? extractApiError(mutation.error) : null,
  };
}
