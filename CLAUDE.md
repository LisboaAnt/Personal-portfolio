# CLAUDE.md — Documentação viva do portfolio

Este ficheiro é **documentação de contexto** para humanos e para assistentes de código.  
**Ainda não contém detalhes do teu projeto** — só a planta do que deve existir aqui. À medida que o repositório evolui, **preenche cada secção** (e cria subsecções quando fizer sentido). Objetivo: qualquer pessoa (ou agente) perceber **arquitetura, operação e convenções** sem vasculhar só o código.

---

## Como este documento deve crescer

- Atualiza **sempre que** mudares stack, variáveis de ambiente, pipelines ou estrutura de pastas relevantes.
- Preferência por **factos verificáveis** (comandos, paths, nomes de serviços) em vez de descrições vagas.
- Quando uma secção ainda estiver vazia, mantém o placeholder `_(a preencher)_` ou apaga o bullet até haver conteúdo real — evita documentação falsa.

---

## Estado atual *(baseline — atualiza quando mudares)*

- **Framework:** Next.js 16 (App Router), React 19, TypeScript.
- **Estilos:** Tailwind CSS v4 (`app/globals.css`).
- **i18n:** `next-intl`; rotas em `app/[locale]/`; locales `pt`, `en`, `es`; `localePrefix: as-needed`; textos em `messages/*.json` (ex.: namespace `Home`, metadados em `meta`).
- **Proxy (Next 16):** `proxy.ts` chama `createMiddleware` do `next-intl` com `i18n/routing.ts` (substitui o antigo `middleware.ts`).
- **Navegação tipada:** `i18n/navigation.ts` (`Link`, `useRouter`, `usePathname`, …).
- **Roadmap:** ver `ROADMAP.md` (ciclos, tarefas e estado).
- **UI:** `components/LocaleSwitcher.tsx` (client); página inicial `app/[locale]/page.tsx` mostra também `Accept-Language` e `x-vercel-ip-country` quando existir.

---

## 1. Visão geral da arquitetura

_(a preencher — diagrama mental ou real: monólito, monorepo, microserviços, BFF, edge, CDN, bases de dados, filas, etc.)_

---

## 2. Stack tecnológico completo

_(a preencher — linguagens, frameworks, runtime, base de dados, ORM, auth, hosting, CI, observabilidade, versões quando relevante)_

---

## 3. Todas as variáveis de ambiente

_(a preencher — tabela ou lista: nome, obrigatória?, exemplo **sem segredos**, onde é lida `.env` / plataforma)_

> **Regra:** nunca commits de valores reais de produção; apenas nomes e descrição.

---

## 4. Estrutura do diretório de conteúdo

_(a preencher — árvore ou descrição das pastas importantes: `apps/`, `packages/`, `content/`, etc., e o papel de cada uma)_

---

## 5. Serviços, jobs e models de cada app

_(a preencher — por aplicação: serviços expostos, workers/cron/queues, modelos de domínio ou ORM; ligações entre apps se existirem)_

---

## 6. Doze “common hurdles” com soluções documentadas

Documenta **12** problemas recorrentes (build, deploy, tipos, CORS, cache, auth, etc.) e a **solução** ou workaround verificado.

1. _(título + sintoma)_ → _(solução)_
2. …
3. …
4. …
5. …
6. …
7. …
8. …
9. …
10. …
11. …
12. …

---

## 7. Catorze design patterns do projeto

Lista **14** padrões que o projeto **usa de facto** (não teoria genérica), com **onde** aparecem (ficheiro, camada ou módulo).

1. …
2. …
3. …
4. …
5. …
6. …
7. …
8. …
9. …
10. …
11. …
12. …
13. …
14. …

---

## 8. Pipeline semanal completo com horários

_(a preencher — rotina semanal: releases, reviews, deploys, backups, dependabot, etc., com **dias e horários** em timezone explícito)_

---

## 9. Checklist pós-implementação

_(a preencher — lista reutilizável após feature ou deploy: testes, lint, métricas, rollback, comunicação, etc.)_

---

## Ligação a outros ficheiros

- **`ROADMAP.md`** — ciclos de desenvolvimento, tarefas e o que já está feito.
- Se existir **`AGENTS.md`** no repositório, pode complementar regras de agente; este **`CLAUDE.md`** foca-se em **arquitetura e operação do portfolio**.
