/** Ativa o botão de captura do fundo 3D (dev ou `NEXT_PUBLIC_WORLD_POSTER_CAPTURE=1`). */
export function isWorldPosterCaptureEnabled(): boolean {
  if (process.env.NEXT_PUBLIC_WORLD_POSTER_CAPTURE === "1") return true;
  return process.env.NODE_ENV === "development";
}

export function downloadCanvasPng(canvas: HTMLCanvasElement, filename: string): void {
  const dataUrl = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

export function findWorldCanvasElement(): HTMLCanvasElement | null {
  const root = document.querySelector(".world-canvas-orbit");
  const canvas = root?.querySelector("canvas");
  return canvas instanceof HTMLCanvasElement ? canvas : null;
}
