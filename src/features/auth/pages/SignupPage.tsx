import { AuthCard } from "../components/AuthCard";
import { SignupForm } from "../components/SignupForm";

export default function SignupPage() {
  return (
    <AuthCard
      title="Create an account"
    >
      <SignupForm />
    </AuthCard>
  );
}
