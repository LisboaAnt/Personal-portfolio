"use client";

import { useCallback, useState } from "react";
import {
  downloadCanvasPng,
  findWorldCanvasElement,
  isWorldPosterCaptureEnabled,
} from "@/world/world-poster-capture";

export function WorldPosterCaptureButton() {
  const [busy, setBusy] = useState(false);

  const capture = useCallback(() => {
    if (busy) return;

    const canvas = findWorldCanvasElement();
    if (!canvas) {
      window.alert("Canvas 3D não encontrado. Ativa o mundo 3D e espera o GLB carregar.");
      return;
    }

    setBusy(true);

    // Dois frames para o WebGL desenhar antes do toDataURL
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        try {
          const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
          downloadCanvasPng(canvas, `world-wallpaper-${stamp}.png`);
        } catch {
          window.alert(
            "Não foi possível exportar. Confirma que o GLB está visível e que estás em modo blender.",
          );
        } finally {
          setBusy(false);
        }
      });
    });
  }, [busy]);

  if (!isWorldPosterCaptureEnabled()) return null;

  return (
    <button
      type="button"
      onClick={capture}
      disabled={busy}
      title="Descarrega o frame atual do canvas 3D (usa para wallpaper / poster estático)"
      className="fixed bottom-4 left-4 z-[200] rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)]/95 px-3 py-2 text-xs font-medium text-[var(--foreground)] shadow-lg backdrop-blur-sm transition hover:border-[var(--accent)] disabled:opacity-50"
    >
      {busy ? "A guardar…" : "📷 Guardar fundo (PNG)"}
    </button>
  );
}
