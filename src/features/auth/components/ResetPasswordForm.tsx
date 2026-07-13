import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthInput } from "./AuthInput";
import { AuthButton } from "./AuthButton";
import { AlertBanner } from "./AlertBanner";
import { useResetPassword } from "../hooks/useResetPassword";

const schema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
});

type FormValues = z.infer<typeof schema>;

export function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const { mutateAsync, isPending, isSuccess, successMessage, error } =
    useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    if (!token) return;
    await mutateAsync({ token, password: values.password }).catch(() => {});
  };

  if (!token) {
    return (
      <AlertBanner
        variant="error"
        message="Invalid or missing reset token. Please request a new password reset link."
      />
    );
  }

  if (isSuccess) {
    return (
      <AlertBanner
        variant="success"
        message={
          successMessage ?? "Password updated. Redirecting you to sign in…"
        }
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {error && <AlertBanner variant="error" message={error.message} />}

      <AuthInput
        label="New password"
        type="password"
        placeholder="Min. 8 characters"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />

      <AuthButton
        type="submit"
        isLoading={isPending}
        loadingText="Updating password…"
      >
        Update password
      </AuthButton>
    </form>
  );
}
