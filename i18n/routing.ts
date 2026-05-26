import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es", "de"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  /** `/` usa sempre `defaultLocale` (en), sem redirecionar por Accept-Language/cookie. */
  localeDetection: false,
});
