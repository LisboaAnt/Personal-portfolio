# QA — checklist mundo 3D

Usar a partir da **Fase 2**. Marcar data e dispositivo nas colunas.

**Legenda:** ✅ · ❌ · N/A · ⏭ (skip com nota)

---

## Ambiente

| Campo | Valor |
|-------|--------|
| Build / commit | |
| `NEXT_PUBLIC_WORLD_3D` | |
| Browser / OS | |
| Dispositivo | |

---

## Navegação (Fase 2+)

| # | Cenário | pt | en | es | de | Notas |
|---|---------|----|----|----|----|-------|
| 1 | Home → Work → Flow → Lab → Home | | | | | |
| 2 | Refresh em `/work` (deep link) | | | | | |
| 3 | Browser Voltar ×5 | | | | | |
| 4 | Browser Avançar ×3 | | | | | |
| 5 | Link externo para `/#contact` | | | | | |
| 6 | Trocar locale na **mesma** rota | | | | | |
| 7 | Trocar locale **mudando** rota | | | | | |
| 8 | Navegar durante transição (spam click) | | | | | deve bloquear |
| 9 | Prefetch: hover link antes de click | | | | | |

---

## Visual / 3D (Fase 1+)

| # | Cenário | OK | Notas |
|---|---------|----|-------|
| 10 | Canvas não remonta após 10 navegações | | |
| 11 | Transição zoom (se D1=zoom) legível | | |
| 12 | Transição arc (se D1=arc) legível | | |
| 13 | Tema claro: cores coerentes | | |
| 14 | Tema escuro: cores coerentes | | |
| 15 | Trocar tema **durante** transição | | |
| 16 | Tab hidden 30s → FPS/CPU baixa | | |

---

## Acessibilidade (Fase 4+)

| # | Cenário | OK | Notas |
|---|---------|----|-------|
| 17 | Tab: header → main → footer | | |
| 18 | Foco no `h1` após transição | | |
| 19 | `prefers-reduced-motion`: modo clássico ou cut curto | | |
| 20 | Leitor de ecrã: `aria-busy` durante viagem | | |
| 21 | Conteúdo compreensível sem olhar ao 3D | | |

---

## Performance (Fase 5+)

| # | Cenário | OK | Notas |
|---|---------|----|-------|
| 22 | Desktop: ≥40 FPS em transição | | |
| 23 | Mobile: ≥30 FPS idle | | |
| 24 | Rede 3G: overlay aparece sem bloqueio eterno | | |
| 25 | Modo `quality: low` ativo em mobile | | |
| 26 | WebGL off: fallback 2D completo | | |

---

## Regressão 2D (sempre)

| # | Cenário | OK | Notas |
|---|---------|----|-------|
| 27 | `WORLD_3D=0`: site idêntico ao pré-3D | | |
| 28 | `npm run build` + `lint` | | |
| 29 | Easter eggs (Konami) não quebram | | |

---

## Bugs encontrados

| ID | Descrição | Severidade | Issue |
|----|-----------|------------|-------|
| | | | |
