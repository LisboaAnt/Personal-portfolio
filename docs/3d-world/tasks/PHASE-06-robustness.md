# Fase 6 — Robustez, DX e evolução

**Objetivo:** Manutenção a longo prazo; contribuição; testes; ativação gradual em produção.

**Duração:** contínua  
**Saída:** ADD-ROOM testado; E2E smoke; decisão D3 (default 3D).

**Dependências:** Fase 5

---

## Tarefas

### 6.1 — [ADD-ROOM.md](../ADD-ROOM.md) validado

| Campo | Valor |
|-------|--------|
| **Aceite** | Alguém segue o guia e adiciona sala fake em branch sem ajuda |

---

### 6.2 — Storybook / isolado (opcional)

| Campo | Valor |
|-------|--------|
| **Aceite** | `RoomHome` renderizável sem Next |

---

### 6.3 — Playwright E2E

| Cenário | WORLD_3D=0 | WORLD_3D=1 |
|---------|------------|------------|
| Rotas principais | smoke | canvas visible + h1 |
| Locales | smoke | 1 locale |

---

### 6.4 — Feature flag produção

| Campo | Valor |
|-------|--------|
| **Default** | `0` até sign-off explícito |
| **Aceite** | Documentado em README raiz |

---

### 6.5 — Som ambiente (opcional)

| Campo | Valor |
|-------|--------|
| **Regras** | Muted por defeito; off em reduced motion |
| **Aceite** | N/A se cancelado |

---

### 6.6 — Física no lab (opcional)

| Campo | Valor |
|-------|--------|
| **Pacote** | `@react-three/rapier` lazy |
| **Aceite** | Só carrega em `/lab` desktop high |

---

### 6.7 — Issue template “Nova sala 3D”

| Campo | Valor |
|-------|--------|
| **Ficheiros** | `.github/ISSUE_TEMPLATE/world-room.yml` |
| **Aceite** | Link no README `docs/3d-world` |

---

### 6.8 — Ativar 3D por defeito

| Campo | Valor |
|-------|--------|
| **Pré-requisitos** | D2, D3 fechados; QA completo; métricas OK |
| **Aceite** | `NEXT_PUBLIC_WORLD_3D=1` em produção + comunicação no changelog |

---

## Checklist de fecho

- [ ] 6.1 – 6.8 (opcionais marcados N/A se não fizerem sentido)

**Estado final:** mundo 3D em produção com fallback 2D permanente.
