# Fase 2 — Orquestrador e rotas reais

**Objetivo:** Navegação do site real dispara transição 3D sincronizada com overlay e App Router.

**Duração orientativa:** 1–2 semanas  
**Saída:** Todas as rotas principais ligadas; deep links; QA navegação verde.

**Dependências:** Fase 1 + D1 (estilo de transição)  
**Bloqueia:** Fases 3–4

---

## Tarefas

### 2.1 — `world/rooms.ts` + `types.ts`

| Campo | Valor |
|-------|--------|
| **Salas v1** | `home`, `work`, `flow`, `lab` (+ `contact` se D4=sim) |
| **Aceite** | Cada rota `app/[locale]/*` mapeada para `RoomId` |

---

### 2.2 — `stores/world-store.ts`

| Campo | Valor |
|-------|--------|
| **Estado** | `currentRoomId`, `phase`, `quality`, `motion`, `webgl` |
| **Aceite** | Transições só via actions documentadas |

---

### 2.3 — `WorldProvider`

| Campo | Valor |
|-------|--------|
| **Ficheiros** | `components/world/WorldProvider.tsx` |
| **Condição** | Monta filhos 3D só se `NEXT_PUBLIC_WORLD_3D=1` e WebGL ok |
| **Aceite** | Flag `0` = zero código three no bundle principal (dynamic) |

---

### 2.4 — `WorldCanvas` no layout

| Campo | Valor |
|-------|--------|
| **Ficheiros** | `app/[locale]/layout.tsx` |
| **z-index** | Canvas atrás (0), conteúdo à frente |
| **Aceite** | Header/footer sempre clicáveis |

---

### 2.5 — `WorldOverlay`

| Campo | Valor |
|-------|--------|
| **Comportamento** | Wrap `{children}`; opacity/pointer-events por `phase` |
| **Aceite** | Durante `traveling`, overlay não recebe cliques |

---

### 2.6 — `WorldLink` / `useWorldNavigate`

| Campo | Valor |
|-------|--------|
| **Fluxo** | preventDefault → animar → `router.push` |
| **Aceite** | Links do header usam WorldLink com 3D on |

---

### 2.7 — Sincronização URL ↔ sala

| Campo | Valor |
|-------|--------|
| **Ficheiros** | `hooks/useWorldRoomFromPath.ts` |
| **Casos** | mount, `popstate`, locale prefix |
| **Aceite** | Refresh em `/en/work` abre sala work |

---

### 2.8 — Bloqueio de input

| Campo | Valor |
|-------|--------|
| **UI** | `aria-busy` no `<main>`; nav `pointer-events-none` |
| **Aceite** | Spam click não quebra estado |

---

### 2.9 — Prefetch

| Campo | Valor |
|-------|--------|
| **Ação** | `router.prefetch` on `mouseEnter` do `WorldLink` |
| **Aceite** | Overlay seguinte aparece <300ms após animação em rede fast 3G simulada |

---

### 2.10 — Timeline de transição

| Fase temporal | Overlay | Câmara |
|---------------|---------|--------|
| 0–200ms | fade out | início |
| 200–1400ms | opaco baixo | traveling |
| 1000–1600ms | fade in | settling |

| **Aceite** | Documentado em `TransitionController.tsx` e testado |

---

### 2.11 — i18n

| Campo | Valor |
|-------|--------|
| **Regra** | Mudar `/pt` → `/en` na mesma path = só overlay |
| **Aceite** | Mudar `/` → `/work` = transição 3D |

---

### 2.12 — QA navegação

| Campo | Valor |
|-------|--------|
| **Doc** | [QA-CHECKLIST.md](../QA-CHECKLIST.md) § Navegação |
| **Aceite** | Todos ✅ ou bugs com issue |

---

## Checklist de fecho

- [ ] 2.1 – 2.12

**Próximo:** [PHASE-03-art.md](./PHASE-03-art.md)
