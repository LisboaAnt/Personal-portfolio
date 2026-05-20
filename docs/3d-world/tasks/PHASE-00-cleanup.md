# Fase 0 — Limpeza e preparação

**Objetivo:** Remover o sistema de fundos decorativos CSS; restaurar site 2D estável; documentação 3D no repositório.

**Duração orientativa:** 1–2 dias  
**Saída da fase:** Build verde; sem imports `backgrounds/*`; [ARCHITECTURE.md](../ARCHITECTURE.md) e [ROADMAP.md](../ROADMAP.md) publicados.

**Dependências:** nenhuma  
**Bloqueia:** Fase 1

---

## Tarefas

### 0.1 — Remover `SiteBackground` do layout

| Campo | Valor |
|-------|--------|
| **Ficheiros** | `app/[locale]/layout.tsx` |
| **Ação** | Remover import e `<SiteBackground />` |
| **Aceite** | Layout renderiza sem componente de fundo rotativo |

---

### 0.2 — Remover `BackgroundPatternHint` do rodapé

| Campo | Valor |
|-------|--------|
| **Ficheiros** | `components/SiteChrome.tsx` |
| **Ação** | Remover import e componente do footer |
| **Aceite** | Rodapé sem linha “Fundo: … / Sugerir padrão” |

---

### 0.3 — Apagar pasta `backgrounds/`

| Campo | Valor |
|-------|--------|
| **Ficheiros** | `backgrounds/registry.ts`, `patterns.css`, `events.ts`, `README.md` |
| **Ação** | Eliminar pasta (ou arquivar noutra branch com nota no PR) |
| **Aceite** | `rg backgrounds` no repo = 0 (exceto docs que mencionam remoção) |

---

### 0.4 — Reverter estilos em `globals.css`

| Campo | Valor |
|-------|--------|
| **Ficheiros** | `app/globals.css` |
| **Ação** | Remover `@import` de `patterns.css`; remover `.site-bg`, `.site-bg__layer`; `body` só `background-color: var(--surface)` |
| **Aceite** | Sem animação aurora no `body::before` do sistema antigo |

---

### 0.5 — Remover issue template de padrões CSS

| Campo | Valor |
|-------|--------|
| **Ficheiros** | `.github/ISSUE_TEMPLATE/background-pattern.yml` |
| **Aceite** | Template não listado no GitHub |

---

### 0.6 — Limpar i18n

| Campo | Valor |
|-------|--------|
| **Ficheiros** | `messages/pt.json`, `en.json`, `es.json`, `de.json` |
| **Ação** | Remover `Nav.backgroundPattern`, `Nav.suggestBackground` |
| **Aceite** | Build sem chaves órfãs referenciadas |

---

### 0.7 — Apagar componentes órfãos

| Campo | Valor |
|-------|--------|
| **Ficheiros** | `components/SiteBackground.tsx`, `components/BackgroundPatternHint.tsx` |
| **Aceite** | Ficheiros não existem |

---

### 0.8 — Verificar página `/flow`

| Campo | Valor |
|-------|--------|
| **Ficheiros** | `app/globals.css` (`.flow-page`) |
| **Ação** | **Manter** overlay calmo da timeline — independente do sistema removido |
| **Aceite** | `/flow` legível como antes |

---

### 0.9 — CI e branch

| Campo | Valor |
|-------|--------|
| **Ação** | `npm run lint && npm run build`; branch `feat/3d-world` ou trabalhar em `main` conforme fluxo |
| **Aceite** | CI verde |

---

### 0.10 — Confirmar documentação 3D

| Campo | Valor |
|-------|--------|
| **Ficheiros** | `docs/3d-world/*` |
| **Aceite** | README, ROADMAP, ARCHITECTURE, DECISIONS, tasks presentes |

---

## Checklist de fecho

- [x] 0.1
- [x] 0.2
- [x] 0.3
- [x] 0.4
- [x] 0.5
- [x] 0.6
- [x] 0.7
- [x] 0.8
- [x] 0.9
- [x] 0.10

**Próximo:** [PHASE-01-spike.md](./PHASE-01-spike.md)
