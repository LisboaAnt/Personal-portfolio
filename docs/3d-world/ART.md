# Direção de arte — mundo 3D

**Estado:** Fase 3 implementada (v1). Geometria procedural em `components/world/rooms/`.

---

## Referências

| Referência | O que copiar | O que evitar |
|------------|--------------|--------------|
| **LittleBigPlanet** | Diorama, materiais “macios”, profundidade, props artesanais | Física complexa na v1 |
| **Super Mario Wonder** | Zoom rápido entre áreas, cores saturadas, leitura clara | Excesso de partículas |

**Eixo recomendado:** materiais toon (LBP) + transição zoom (Wonder).

---

## Paleta

Ligar ao CSS existente (`app/globals.css`):

| Token CSS | Uso 3D |
|-----------|--------|
| `--surface` | Chão, névoa (`fog`) |
| `--accent` | Props principais, luz de destaque |
| `--foreground` | Contorno toon (opcional) |
| `--muted` | Props secundários |

---

## Materiais (v1)

- **Base:** `WorldMaterial` → `MeshToonMaterial` + `world/toon-gradient.ts` (3 níveis).
- **Chão distante:** `meshStandardMaterial` no plano global (`WorldEnvironment`).
- **Sem** PBR pesado, normal maps ou HDRI na v1.
- **Tema:** `hooks/useWorldThemeColors.ts` lê `--surface`, `--accent`, etc. do CSS.

---

## Iluminação

- 1× `ambientLight` (fraca)
- 1× `directionalLight` (sombra **off** em `low`)
- Névoa: `Fog` cor `var(--surface)`

---

## Orçamento geometria (v1)

| Métrica | Limite |
|---------|--------|
| Triângulos totais | ≤ 15 000 |
| GLTF por sala | ≤ 512 KB (se usar) |
| Texturas | ≤ 512², preferir cores sólidas |

---

## Salas (implementado v1)

| Sala | Ficheiro | Props |
|------|----------|-------|
| `home` | `RoomHome.tsx` | Secretária, ecrã, candeeiro emissive |
| `work` | `RoomWork.tsx` | 3 pedestais — `#8b5cf6` Vittahub, `#10b981` Ussin, `#6366f1` UFC |
| `flow` | `RoomFlow.tsx` | Portal (arco + pilares) + trilho de esferas |
| `lab` | `RoomLab.tsx` | Terminal + ecrã `#22d3ee` emissive |
| `contact` | — | Hash `/#contact` na home (sem sala 3D; ver D4) |

Base comum: `RoomShell.tsx` (cilindro ilha + anel ativo).

---

## Orçamento (medido em dev)

| Métrica | Valor |
|---------|--------|
| Triângulos (4 salas + chão + estrelas) | ~8–12k típico — ver `console` `[world-3d]` em `NODE_ENV=development` |
| Limite v1 | ≤ 15 000 |

## Screenshots de referência

_Adicionar capturas claro/escuro em `docs/3d-world/assets/` quando disponíveis._

---

Ver tarefas: [tasks/PHASE-03-art.md](./tasks/PHASE-03-art.md).
