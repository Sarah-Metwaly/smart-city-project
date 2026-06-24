import { AxiosError } from "axios";
import type { ApiError } from "../features/auth/types/auth.types";

/**
 * Extracts a human-readable error message (and optional field errors) from an
 * Axios error response.  Falls back to the generic JS error message.
 */
export function extractApiError(error: unknown): ApiError {
  if (error instanceof AxiosError && error.response?.data) {
    const data = error.response.data as {
      message?: string;
      errors?: Record<string, string[]>;
      statusCode?: number;
    };
    return {
      message: data.message ?? "An unexpected error occurred.",
      statusCode: error.response.status,
      errors: data.errors,
    };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: "An unexpected error occurred." };
}
