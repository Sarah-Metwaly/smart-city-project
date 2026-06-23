import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth.services";
import { tokenManager } from "../utils/tokenManager";
import { useAuth } from "./useAuth";
import type { LoginPayload } from "../types/auth.types";
import { extractApiError } from "../../../lib/extractApiError";

export function useLogin() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const mutation = useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (response) => {
      const { accessToken, user } = response.data;
      tokenManager.setAccessToken(accessToken);
      setUser(user);
      navigate("/dashboard", { replace: true });
    },
  });

  return {
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error ? extractApiError(mutation.error) : null,
  };
}
