"use client";

/**
 * Camada opcional: animações leves na bio (HeroBioContent).
 * Não altera textos — só entrada suave se animações não estiverem desligadas.
 */
import { motion, useReducedMotion } from "framer-motion";
import { isHeroFastEnter } from "@/lib/hero-enter";

export function HeroBioMotion({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const fast = isHeroFastEnter();

  if (reduced || fast) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
