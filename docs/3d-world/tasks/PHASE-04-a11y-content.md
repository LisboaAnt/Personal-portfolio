# Fase 4 — Conteúdo, overlay e acessibilidade

**Objetivo:** Páginas atuais funcionam no overlay; WCAG razoável; reduced motion; i18n intacto.

**Duração orientativa:** ~1 semana  
**Saída:** QA a11y sem bloqueios críticos.

**Dependências:** Fase 2 (Fase 3 pode estar em paralelo)

---

## Tarefas

### 4.1 — Overlay por rota

| Campo | Valor |
|-------|--------|
| **Páginas** | `page.tsx` home, work, flow, lab — conteúdo existente |
| **Aceite** | Paridade de copy com modo 2D (`WORLD_3D=0`) |

---

### 4.2 — Gestão de foco

| Campo | Valor |
|-------|--------|
| **Aceite** | Após transição, foco no `h1` ou skip interno do painel |

---

### 4.3 — `prefers-reduced-motion`

| Campo | Valor |
|-------|--------|
| **Opções** | Modo clássico automático · transição ≤150ms |
| **Aceite** | Respeita SO; documentado em DECISIONS D2 se aplicável |

---

### 4.4 — `aria-live`

| Campo | Valor |
|-------|--------|
| **Mensagens i18n** | `World.navigatingTo` em 4 locales |
| **Aceite** | Anúncio ao iniciar viagem para sala X |

---

### 4.5 — Metadata e título

| Campo | Valor |
|-------|--------|
| **Aceite** | `generateMetadata` inalterado por rota |

---

### 4.6 — `/flow` timeline

| Campo | Valor |
|-------|--------|
| **Aceite** | Scroll, hover minor events, teclado OK no overlay |

---

### 4.7 — Easter eggs

| Campo | Valor |
|-------|--------|
| **Decisão** | Pausar `useFrame` do mundo quando Snake aberto |
| **Aceite** | Konami não deixa canvas a consumir 100% CPU |

---

### 4.8 — Tema claro/escuro

| Campo | Valor |
|-------|--------|
| **Aceite** | Toggle durante idle e durante transição |

---

### 4.9 — Contraste overlay

| Campo | Valor |
|-------|--------|
| **Aceite** | Texto `--foreground` em painel com fundo legível (glass) |

---

### 4.10 — Auditoria a11y

| Campo | Valor |
|-------|--------|
| **Ferramentas** | axe DevTools, Lighthouse a11y |
| **Aceite** | Zero critical; issues médias triadas |

---

## Checklist de fecho

- [ ] 4.1 – 4.10
- [ ] [QA-CHECKLIST.md](../QA-CHECKLIST.md) § Acessibilidade

**Próximo:** [PHASE-05-performance.md](./PHASE-05-performance.md)
