import TemplateTest, {
  TemplateTestData,
} from "@/components/organisms/TemplateTest";
import TemplateWrapper from "@/components/organisms/TemplateWrapper";

type Props = {
  params: Promise<{
    code: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { code } = await params;
  return <TemplateWrapper code={code} />;
}
