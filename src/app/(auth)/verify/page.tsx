import { VerifyForm } from "@/components/organisms/VerifyForm";

type Props = {
  searchParams: Promise<{
    email?: string;
  }>;
};

export default async function Page({ searchParams }: Props) {
  const { email } = await searchParams;

  return (
    <>
      <VerifyForm email={email} />
    </>
  );
}
