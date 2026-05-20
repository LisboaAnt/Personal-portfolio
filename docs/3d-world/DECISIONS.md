# Decisões — mundo 3D

Regista escolhas **pendentes** e **fechadas**. Atualiza quando houver resposta do produto.

---

## Pendentes

| ID | Pergunta | Opções | Impacto |
|----|----------|--------|---------|
| D3 | Default em produção | 3D on para todos · opt-in `?world=1` / toggle até sign-off · env `NEXT_PUBLIC_WORLD_3D=1` | Deploy |
| D4 | Rota `/contact` | Sala própria · secção na home (actual) | Mapa de salas |

---

## Fechadas

| ID | Decisão | Razão |
|----|---------|--------|
| D1 | Transição **zoom** (Wonder) | Implementado em `CameraRig`; arco opcional no scroll |
| D2 | **3D no mobile** com `quality: low` | `useWorldQuality`; opt-out global com `NEXT_PUBLIC_WORLD_3D_MOBILE=0` |
| D5 | Fundos CSS rotativos removidos | Fase 0 |
| F1–F7 | Ver plano inicial | `ROADMAP.md` |

### D1 — Zoom vs arc

**Escolha:** `zoom` (+ arco vertical leve só em transições por scroll).

### D2 — Mobile

**Escolha:** Mesma cena em mobile com DPR 1 e menos efeitos. Para desligar em telemóveis: `NEXT_PUBLIC_WORLD_3D_MOBILE=0`.

### Modo clássico (Fase 5)

**Escolha:** Toggle no header + painel no `/lab`; `sessionStorage` `portfolio-world-3d-off` desactiva; `portfolio-world-3d` activa.

---

## Histórico

| Data | Decisão | Notas |
|------|---------|-------|
| 2026-05 | Plano 3D documentado | Ver `ROADMAP.md` |
| 2026-05 | D1, D2, toggle 2D/3D | Fases 2–5 em implementação |
