# Fase 3 — Direção de arte (LBP / Wonder)

**Objetivo:** Salas reconhecíveis, materiais coerentes com tema claro/escuro, orçamento de polígonos respeitado.

**Duração orientativa:** 1–2 semanas  
**Saída:** [ART.md](../ART.md) preenchido; screenshots; ≤15k triângulos.

**Dependências:** Fase 2  
**Bloqueia:** Fase 4 (parcialmente paralelizável)

---

## Tarefas

### 3.1 — Tokens 3D desde CSS

| Campo | Valor |
|-------|--------|
| **Ficheiros** | `world/theme-colors.ts` ou hook `useWorldThemeColors` |
| **Aceite** | Trocar tema atualiza névoa e materiais em <1s |

---

### 3.2 — Material base toon

| Campo | Valor |
|-------|--------|
| **Aceite** | Componente `WorldMaterial` reutilizável |

---

### 3.3 — Iluminação + névoa

| Campo | Valor |
|-------|--------|
| **Aceite** | Sem “buracos” negros no horizonte |

---

### 3.4 — Sala `home`

| Campo | Valor |
|-------|--------|
| **Ficheiros** | `components/world/rooms/RoomHome.tsx` |
| **Aceite** | Identificável em screenshot sem texto |

---

### 3.5 — Sala `work`

| Campo | Valor |
|-------|--------|
| **Props** | 3 pedestais (Vittahub, Ussin, UFC) |
| **Aceite** | Cores distintas; alinhado a `/work` |

---

### 3.6 — Sala `flow`

| Campo | Valor |
|-------|--------|
| **Opção A** | Trilho 3D decorativo |
| **Opção B** | Portal/frame para overlay timeline |
| **Aceite** | Não competir visualmente com `flow-well` |

---

### 3.7 — Sala `lab`

| Campo | Valor |
|-------|--------|
| **Aceite** | Tom “devtools” / neon suave |

---

### 3.8 — Contact (se D4 = sala própria)

| Campo | Valor |
|-------|--------|
| **Aceite** | Nav para contacto com transição |

---

### 3.9 — Idle animations

| Campo | Valor |
|-------|--------|
| **Regra** | `useFrame` leve; pausa se `document.hidden` |
| **Aceite** | Sem rotação frenética |

---

### 3.10 — Suspense / Loader

| Campo | Valor |
|-------|--------|
| **Ficheiros** | `drei/Loader` na primeira carga |
| **Aceite** | Sem ecrã branco >2s em 4G |

---

### 3.11 — Contagem de triângulos

| Campo | Valor |
|-------|--------|
| **Ferramenta** | `renderer.info.render.triangles` |
| **Aceite** | ≤15k documentado em ART.md |

---

### 3.12 — Guia ART.md completo

| Campo | Valor |
|-------|--------|
| **Aceite** | Paleta, limites, screenshots links |

---

## Checklist de fecho

- [ ] 3.1 – 3.12

**Próximo:** [PHASE-04-a11y-content.md](./PHASE-04-a11y-content.md)
