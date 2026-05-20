# Roadmap — Mundo 3D (antoniolisboa.site)

Documento vivo: marca `[x]` ao concluir. Tarefas detalhadas em [`tasks/`](./tasks/).

**Referências:** LittleBigPlanet (diorama, materiais macios), Super Mario Wonder (zoom / transição cinematográfica entre áreas).

---

## Legenda

- `[ ]` por fazer · `[x]` feito · `[-]` cancelado
- **Saída da fase:** critérios que impedem avançar sem dívida técnica grave

---

## Visão

| Hoje | Alvo |
|------|------|
| Páginas 2D + fundo CSS rotativo (a remover) | Mundo 3D contínuo + overlay HTML |
| Navegação = troca de documento estática | Navegação = **animação de câmara** + fade do overlay |
| Vários padrões `bg-pattern--*` | **Salas** (`home`, `work`, `flow`, `lab`, …) |

### Princípios

1. Híbrido **3D + overlay 2D** (conteúdo e a11y no HTML).
2. **Um Canvas** persistente (React Three Fiber).
3. **Fallback 2D** sempre disponível.
4. **Leve na v1:** geometria simples; GLTF e post-processing depois.
5. **Mesmas URLs** e i18n (`pt`, `en`, `es`, `de`).

---

## Stack prevista

| Pacote | Uso |
|--------|-----|
| `three` | Motor 3D |
| `@react-three/fiber` | React renderer |
| `@react-three/drei` | Câmara, luzes, helpers |
| `@react-spring/three` ou `gsap` | Animação de câmara (decidir Fase 1) |
| `zustand` | Estado global (sala, transição, qualidade) |

**Não na v1:** Rapier, Spline, Babylon, Theatre.js.

---

## Fases (resumo)

| Fase | Nome | Duração orientativa | Documento de tarefas |
|------|------|---------------------|----------------------|
| **0** | Limpeza e preparação | 1–2 dias | [PHASE-00-cleanup.md](./tasks/PHASE-00-cleanup.md) |
| **1** | Spike técnico | 3–5 dias | [PHASE-01-spike.md](./tasks/PHASE-01-spike.md) |
| **2** | Orquestrador + rotas | 1–2 semanas | [PHASE-02-orchestrator.md](./tasks/PHASE-02-orchestrator.md) |
| **3** | Direção de arte | 1–2 semanas | [PHASE-03-art.md](./tasks/PHASE-03-art.md) |
| **4** | Conteúdo e a11y | ~1 semana | [PHASE-04-a11y-content.md](./tasks/PHASE-04-a11y-content.md) |
| **5** | Performance e produção | ~1 semana | [PHASE-05-performance.md](./tasks/PHASE-05-performance.md) |
| **6** | Robustez e evolução | contínuo | [PHASE-06-robustness.md](./tasks/PHASE-06-robustness.md) |

### Cronograma lógico

```text
Semana 1     → Fase 0 + Fase 1
Semana 2–3   → Fase 2
Semana 4     → Fase 3
Semana 5     → Fase 4
Semana 6     → Fase 5
Contínuo     → Fase 6
```

---

## Fase 0 — Limpeza

**Objetivo:** Remover sistema de fundos decorativos CSS; site 2D estável; docs 3D no repo.

**Saída:** Build verde; zero imports `backgrounds/*`; [ARCHITECTURE.md](./ARCHITECTURE.md) criado.

- [ ] Ver [PHASE-00-cleanup.md](./tasks/PHASE-00-cleanup.md) (tarefas 0.1–0.10)

---

## Fase 1 — Spike

**Objetivo:** Provar câmara + 3 ilhas clicáveis; medir FPS; escolher spring vs GSAP.

**Saída:** Demo em `/lab` ou flag; relatório 1 página; decisão D1 documentada.

- [ ] Ver [PHASE-01-spike.md](./tasks/PHASE-01-spike.md) (tarefas 1.1–1.10)

---

## Fase 2 — Orquestrador

**Objetivo:** Navegação real do site com transição 3D + overlay sincronizado.

**Saída:** Home ↔ Work ↔ Flow ↔ Lab sem remount do canvas; deep links OK.

- [ ] Ver [PHASE-02-orchestrator.md](./tasks/PHASE-02-orchestrator.md) (tarefas 2.1–2.12)

---

## Fase 3 — Arte

**Objetivo:** Identidade LBP/Wonder; salas reconhecíveis; ≤15k triângulos (v1).

**Saída:** [ART.md](./ART.md) preenchido; screenshots claro/escuro.

- [ ] Ver [PHASE-03-art.md](./tasks/PHASE-03-art.md) (tarefas 3.1–3.12)

---

## Fase 4 — Conteúdo e a11y

**Objetivo:** Páginas atuais no overlay; teclado e leitores de ecrã; reduced motion.

**Saída:** Checklist [QA-CHECKLIST.md](./QA-CHECKLIST.md) sem bloqueios críticos de a11y.

- [ ] Ver [PHASE-04-a11y-content.md](./tasks/PHASE-04-a11y-content.md) (tarefas 4.1–4.10)

---

## Fase 5 — Performance

**Objetivo:** Perfis `low`/`high`; mobile; bundle medido; flag produção.

**Saída:** Metas FPS documentadas; `NEXT_PUBLIC_WORLD_3D=0` default seguro.

- [ ] Ver [PHASE-05-performance.md](./tasks/PHASE-05-performance.md) (tarefas 5.1–5.10)

---

## Fase 6 — Robustez

**Objetivo:** ADD-ROOM, E2E, issue template, opcional física no lab.

**Saída:** Contribuição interna clara; plano para 3D default (D3).

- [ ] Ver [PHASE-06-robustness.md](./tasks/PHASE-06-robustness.md) (tarefas 6.1–6.8)

---

## O que NÃO fazer em paralelo

- Evoluir `backgrounds/patterns.css` ou novos padrões CSS rotativos.
- Migrar todo o texto para meshes 3D.
- Ativar 3D por defeito em produção antes da Fase 5.

---

## Ligação ao roadmap geral

Ver também [`ROADMAP.md`](../../ROADMAP.md) na raiz (SEO, blog, etc.). O mundo 3D é um **ciclo maior** que pode sobrepor-se aos ciclos 1–5 do site clássico.

---

## Decisões

Pendentes: [DECISIONS.md](./DECISIONS.md).

---

*Última atualização: 2026-05 — plano inicial documentado.*
