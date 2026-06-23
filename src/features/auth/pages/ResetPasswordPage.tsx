import { AuthCard } from "../components/AuthCard";
import { ResetPasswordForm } from "../components/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <AuthCard
      title="Set a new password"
      subtitle="Choose a strong password for your account"
    >
      <ResetPasswordForm />
    </AuthCard>
  );
}
