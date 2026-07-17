import AuthLayout from "@/components/layout/AuthLayout";
import { LoginForm } from "@/components/organisms/LoginForm";

export default function Page() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
