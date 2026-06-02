import { redirect } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

/** CV unificado na home — formação */
export default async function FlowRedirectPage({ params }: Props) {
  const { locale } = await params;
  redirect({ href: "/#education", locale });
}
