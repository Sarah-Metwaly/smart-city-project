import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthInput } from "./AuthInput";
import { AuthButton } from "./AuthButton";
import { AlertBanner } from "./AlertBanner";
import { useForgotPassword } from "../hooks/useForgotPassword";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
});

type FormValues = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const { mutateAsync, isPending, isSuccess, successMessage, error } =
    useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    await mutateAsync(values).catch(() => {});
  };

  if (isSuccess) {
    return (
      <AlertBanner
        variant="success"
        message={successMessage ?? "Password reset email sent successfully"}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {error && <AlertBanner variant="error" message={error.message} />}

      <AuthInput
        label="Email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />

      <AuthButton
        type="submit"
        isLoading={isPending}
        loadingText="Sending…"
      >
        Send reset link
      </AuthButton>

      <p className="text-center text-sm text-gray-500">
        Remembered it?{" "}
        <Link
          to="/login"
          className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
        >
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
