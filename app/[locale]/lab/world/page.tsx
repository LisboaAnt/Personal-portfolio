import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { WorldLabShell } from "@/components/world/WorldLabShell";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Lab.world.meta" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LabWorldPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Lab.world");

  return (
    <WorldLabShell
      backLabel={t("back")}
      title={t("title")}
      intro={t("intro")}
      hint={t("hint")}
      fallbackTitle={t("fallbackTitle")}
      fallbackBody={t("fallbackBody")}
      classicLabel={t("classicLabel")}
    />
  );
}
