import { AuthCard } from "../components/AuthCard";
import { LoginForm } from "../components/LoginForm";

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to your account to continue"
    >
      <LoginForm />
    </AuthCard>
  );
}
