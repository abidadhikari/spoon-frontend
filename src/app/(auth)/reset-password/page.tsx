import { ResetPasswordForm } from "@/components/organisms/ResetPasswordForm";

type Props = {
  searchParams: Promise<{ email?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { email } = await searchParams;
  return <ResetPasswordForm email={email} />;
}
