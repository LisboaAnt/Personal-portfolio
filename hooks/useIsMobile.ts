"use client";

import { useEffect, useState } from "react";

const QUERY = "(max-width: 639px)";

/** < 640px — alinhado a `sm:` do Tailwind. */
export function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return mobile;
}
