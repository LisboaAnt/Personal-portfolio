# Fase 5 — Performance, mobile e produção

**Objetivo:** Perfis gráficos, bundle medido, deploy seguro com flag off por defeito.

**Duração orientativa:** ~1 semana  
**Saída:** Metas FPS; `NEXT_PUBLIC_WORLD_3D=0` em produção até sign-off.

**Dependências:** Fases 2–4 estáveis

---

## Tarefas

### 5.1 — `useWorldQuality()`

| Campo | Valor |
|-------|--------|
| **Sinais** | `matchMedia`, memória, FPS média 5s após load |
| **Aceite** | `low` em mobile fraco automático |

---

### 5.2 — Perfis `low` / `high`

| Definição | low | high |
|-----------|-----|------|
| dpr | 1 | 1.5–2 |
| Sombras | off | optional |
| Post | off | bloom leve |
| frameloop idle | demand | always ou demand |

---

### 5.3 — Tab em background

| Campo | Valor |
|-------|--------|
| **Aceite** | `visibilitychange` reduz trabalho GPU |

---

### 5.4 — Bundle analyzer

| Campo | Valor |
|-------|--------|
| **Meta** | Incremento gzip ≤280KB vs baseline 2D |
| **Aceite** | Número em `docs/3d-world/spike/REPORT.md` ou PERFORMANCE.md |

---

### 5.5 — Code splitting

| Campo | Valor |
|-------|--------|
| **Aceite** | `WorldCanvas` + salas em chunks separados |

---

### 5.6 — Pipeline GLTF (se usado)

| Campo | Valor |
|-------|--------|
| **Regras** | Draco, ≤512KB, lazy por sala |
| **Aceite** | N/A se só geometria procedural |

---

### 5.7 — `WebGLErrorBoundary`

| Campo | Valor |
|-------|--------|
| **UI** | “Modo clássico” + `localStorage` |
| **Aceite** | Crash WebGL não mata página inteira |

---

### 5.8 — Deploy Vercel

| Campo | Valor |
|-------|--------|
| **Aceite** | Preview testado; env documentado em `.env.example` |

---

### 5.9 — RUM opcional

| Campo | Valor |
|-------|--------|
| **Métricas** | duração transição, webgl_fail |
| **Aceite** | Opcional — não bloquear fase |

---

### 5.10 — Checklist dispositivos reais

| Dispositivo | low | high | Notas |
|-------------|-----|------|-------|
| | | | |

| **Aceite** | [QA-CHECKLIST.md](../QA-CHECKLIST.md) § Performance |

---

## Checklist de fecho

- [ ] 5.1 – 5.10

**Próximo:** [PHASE-06-robustness.md](./PHASE-06-robustness.md)
