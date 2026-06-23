import  axiosInstance  from "../../../shared/api/axiosInstance";
import type {
  LoginPayload,
  LoginResponse,
  SignupPayload,
  SignupResponse,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  VerifyEmailPayload,
  GenericAuthResponse,
  RefreshTokenResponse,
} from "../types/auth.types";

// ─── Auth Service ─────────────────────────────────────────────────────────────
// Pure API functions — no side effects, no UI, no state management.

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await axiosInstance.post<LoginResponse>(
      "/auth/login",
      payload
    );
    return data;
  },

  async signup(payload: SignupPayload): Promise<SignupResponse> {
    const { data } = await axiosInstance.post<SignupResponse>(
      "/auth/signup",
      payload
    );
    return data;
  },

  async verifyEmail(payload: VerifyEmailPayload): Promise<GenericAuthResponse> {
    const { data } = await axiosInstance.post<GenericAuthResponse>(
      "/auth/verifyEmail",
      payload
    );
    return data;
  },

  async forgotPassword(
    payload: ForgotPasswordPayload
  ): Promise<GenericAuthResponse> {
    const { data } = await axiosInstance.post<GenericAuthResponse>(
      "/auth/forgotPassword",
      payload
    );
    return data;
  },

  async resetPassword(
    payload: ResetPasswordPayload
  ): Promise<GenericAuthResponse> {
    const { data } = await axiosInstance.post<GenericAuthResponse>(
      "/auth/resetPassword",
      payload
    );
    return data;
  },

  async refreshToken(): Promise<RefreshTokenResponse> {
    const { data } = await axiosInstance.post<RefreshTokenResponse>(
      "/auth/refreshToken"
    );
    return data;
  },
};
