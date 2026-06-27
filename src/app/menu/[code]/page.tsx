type Props = {
  params: Promise<{
    code: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { code } = await params;

  return <div>{code}</div>;
}
