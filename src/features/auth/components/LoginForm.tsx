import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthInput } from "./AuthInput";
import { AuthButton } from "./AuthButton";
import { AlertBanner } from "./AlertBanner";
import { useLogin } from "../hooks/useLogin";

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

// ─── Component ────────────────────────────────────────────────────────────────

export function LoginForm() {
  const { mutateAsync, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    await mutateAsync(values).catch(() => {
      // error is surfaced via the hook — no rethrow needed here
    });
  };

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

      <div className="space-y-1.5">
        <AuthInput
          label="Password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Forgot password?
          </Link>
        </div>
      </div>

      <AuthButton type="submit" isLoading={isPending} loadingText="Signing in…">
        Sign in
      </AuthButton>

      <p className="text-center text-sm text-gray-500">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
