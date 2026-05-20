# Relatório — Mundo 3D (Fases 1–5)

_Atualizado após implementação do orquestrador, arte, scroll e performance._

---

## Ambiente

| Campo | Valor |
|-------|--------|
| Data | 2026-05 |
| Stack | Next.js 16.2.4, React 19, R3F 9.6, drei 10.7, three 0.184 |
| Ativação | `?world=1`, toggle header, ou `NEXT_PUBLIC_WORLD_3D=1` |

---

## Dependências (produção)

| Pacote | Versão |
|--------|--------|
| three | ^0.184.0 |
| @react-three/fiber | ^9.6.1 |
| @react-three/drei | ^10.7.7 |
| @react-spring/three | ^10.0.3 (instalado; câmara usa lerp manual) |
| zustand | ^5.0.13 |

---

## Bundle

| Métrica | Valor | Notas |
|---------|--------|--------|
| Chunks 3D | Lazy (`WorldCanvas` dynamic) | Não carrega com `WORLD_3D=0` e sem opt-in |
| Delta gzip estimado | ~180–280 KB | Medir com `@next/bundle-analyzer` antes de prod |

_Comando sugerido:_ `npm run build` e inspecionar `.next/static/chunks` com nomes `three`, `fiber`, `world`.

---

## FPS (orientativo)

| Dispositivo | Idle (demand) | Transição | Notas |
|-------------|---------------|-----------|-------|
| Desktop | 0 GPU se idle | 55–60 FPS típico | `frameloop: demand` + `FrameDriver` |
| Mobile | idem | 30–50 FPS | `quality: low`, DPR 1 |

_Console dev:_ `[world-3d] render triangles` — orçamento v1 ≤15k.

---

## Spring vs GSAP

**Recomendação:** lerp manual em `CameraRig` (easing cúbico).

**Motivos:** zero dependência extra no caminho crítico; `@react-spring/three` disponível para fase futura.

---

## Zoom vs Arc (D1)

**Recomendação:** `zoom` — **fechado.**

Arco vertical apenas em mudanças por scroll (`arc` prop).

---

## Riscos

| Risco | Severidade | Mitigação |
|-------|------------|-----------|
| WebGL indisponível | Média | `WebGLErrorBoundary`, fallback 2D |
| Mobile fraco | Média | `useWorldQuality`, `WORLD_3D_MOBILE=0` |
| Bundle | Média | dynamic import, flag off em prod |

---

## Conclusão

- [x] Fases 2–3 entregues (orquestrador, salas, scroll)
- [x] Fase 4 parcial (a11y, reduced motion)
- [x] Fase 5 parcial (quality, toggle 2D/3D, demand frameloop)
- [ ] Medição bundle formal antes de `NEXT_PUBLIC_WORLD_3D=1` em produção
