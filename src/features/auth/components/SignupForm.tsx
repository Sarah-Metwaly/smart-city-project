import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthInput } from "./AuthInput";
import { AuthButton } from "./AuthButton";
import { AlertBanner } from "./AlertBanner";
import { useSignup } from "../hooks/useSignup";

// ─── Schema ───────────────────────────────────────────────────────────────────

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[a-z]/, "Must contain at least one lowercase letter")
  .regex(/[0-9]/, "Must contain at least one number");

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: passwordSchema,
});

type FormValues = z.infer<typeof schema>;

// ─── Component ────────────────────────────────────────────────────────────────

export function SignupForm() {
  const { mutateAsync, isPending, isSuccess, successMessage, error } =
    useSignup();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    await mutateAsync(values).catch(() => {});
  };

  if (isSuccess) {
    return (
      <AlertBanner
        variant="success"
        message={
          successMessage ??
          "Account created! Check your email to verify your account."
        }
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {error && <AlertBanner variant="error" message={error.message} />}

      <div className="grid grid-cols-2 gap-3">
        <AuthInput
          label="First name"
          type="text"
          placeholder="John"
          autoComplete="given-name"
          error={errors.firstName?.message}
          {...register("firstName")}
        />
        <AuthInput
          label="Last name"
          type="text"
          placeholder="Doe"
          autoComplete="family-name"
          error={errors.lastName?.message}
          {...register("lastName")}
        />
      </div>

      <AuthInput
        label="Email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />

      <AuthInput
        label="Password"
        type="password"
        placeholder="Min. 8 characters"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />

      <AuthButton
        type="submit"
        isLoading={isPending}
        loadingText="Creating account…"
        className="mt-1"
      >
        Create account
      </AuthButton>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
