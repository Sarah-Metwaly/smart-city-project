// ─── Request Payloads ────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface VerifyEmailPayload {
  token: string;
}

// ─── Response Shapes ─────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  role: string;
  createdAt: string;
}

export interface LoginResponse {
  status: string;
  data: {
    accessToken: string;
    user: AuthUser;
  };
}

export interface SignupResponse {
  status: string;
  message: string;
  data: {
    user: Partial<AuthUser>;
  };
}

export interface RefreshTokenResponse {
  data: {
    accessToken: string;
  };
}

export interface GenericAuthResponse {
  status: string;
  message: string;
}

// ─── Auth State ───────────────────────────────────────────────────────────────

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

// ─── Error Shape ──────────────────────────────────────────────────────────────

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}
