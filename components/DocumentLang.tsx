"use client";

import { useLayoutEffect } from "react";

/** Atualiza `<html lang>` sem remontar o documento ao trocar locale. */
export function DocumentLang({ locale }: { locale: string }) {
  useLayoutEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
