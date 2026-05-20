import { redirect } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

/** CV unificado na home — experiência */
export default async function WorkRedirectPage(_props: Props) {
  redirect({ pathname: "/", hash: "experience" });
}
