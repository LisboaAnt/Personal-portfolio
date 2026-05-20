# Mundo 3D — documentação

Portfólio com navegação estilo **diorama 3D** (referências: LittleBigPlanet, Super Mario Wonder): um canvas persistente, salas por rota e transição de **câmara** (zoom / perspectiva) em vez de “página morta”.

## Documentos

| Ficheiro | Conteúdo |
|----------|----------|
| [ROADMAP.md](./ROADMAP.md) | Visão, fases, cronograma, critérios de saída |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Stack, pastas, fluxo router ↔ câmara ↔ overlay |
| [DECISIONS.md](./DECISIONS.md) | Decisões pendentes e registadas |
| [QA-CHECKLIST.md](./QA-CHECKLIST.md) | Testes manuais transversais |
| [ART.md](./ART.md) | Direção de arte LBP / Wonder (Fase 3) |
| [ADD-ROOM.md](./ADD-ROOM.md) | Como acrescentar uma sala (Fase 6) |

## Tarefas por fase

| Fase | Documento | Objetivo |
|------|-----------|----------|
| 0 | [tasks/PHASE-00-cleanup.md](./tasks/PHASE-00-cleanup.md) | Remover sistema de fundos CSS; preparar repo |
| 1 | [tasks/PHASE-01-spike.md](./tasks/PHASE-01-spike.md) | Prova de conceito R3F + câmara |
| 2 | [tasks/PHASE-02-orchestrator.md](./tasks/PHASE-02-orchestrator.md) | Rotas reais + transições |
| 3 | [tasks/PHASE-03-art.md](./tasks/PHASE-03-art.md) | Direção de arte e salas |
| 4 | [tasks/PHASE-04-a11y-content.md](./tasks/PHASE-04-a11y-content.md) | Overlay, i18n, acessibilidade |
| 5 | [tasks/PHASE-05-performance.md](./tasks/PHASE-05-performance.md) | Mobile, bundle, produção |
| 6 | [tasks/PHASE-06-robustness.md](./tasks/PHASE-06-robustness.md) | DX, testes, evolução |

## Estado

- **Sistema de fundos decorativos (CSS):** removido (Fase 0 concluída).
- **Mundo 3D:** spike em `/lab/world` — Fase 1 em curso; orquestrador global (Fase 2) por fazer.

## Feature flag (previsto)

```env
NEXT_PUBLIC_WORLD_3D=0   # 0 = site 2D clássico (default até Fase 6)
NEXT_PUBLIC_WORLD_3D=1   # ativa canvas + orquestrador
```

Query de teste opcional: `?world=1` (a definir na Fase 1).
