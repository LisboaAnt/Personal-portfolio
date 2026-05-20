import { redirect } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

/** CV unificado na home — formação */
export default async function FlowRedirectPage(_props: Props) {
  redirect({ pathname: "/", hash: "education" });
}
