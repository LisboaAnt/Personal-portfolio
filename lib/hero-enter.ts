/** Texto da hero visível logo (sem fades longos). Desligar: NEXT_PUBLIC_HERO_FAST_ENTER=0 */
export function isHeroFastEnter(): boolean {
  return process.env.NEXT_PUBLIC_HERO_FAST_ENTER !== "0";
}

/** Animação SVG do nome letra a letra. Desligar: NEXT_PUBLIC_HERO_DRAW_TITLE=0 */
export function isHeroDrawTitle(): boolean {
  return process.env.NEXT_PUBLIC_HERO_DRAW_TITLE !== "0";
}
