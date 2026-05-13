# Roadmap — portfolio (antoniolisboa.site)

Documento vivo: marca com `[x]` o que já estiver feito. Ajusta datas e prioridades quando quiseres.

---

## Legenda

- `[ ]` por fazer · `[x]` feito (neste repo, salvo nota em contrário)

---

## Ciclo 0 — Já entregue *(baseline atual)*

- [x] Next.js 16 App Router + React 19 + TypeScript + Tailwind v4
- [x] i18n `next-intl` (`pt` / `en` / `es`, `localePrefix: as-needed`)
- [x] Home com experiência, formação, competências, projetos, contacto
- [x] Páginas `/work` (casos) e `/lab` (demos: Suspense, Server Action, pathname, terminal)
- [x] Navegação global (`SiteChrome`) + troca de idioma
- [x] Easter eggs (Konami → Snake, cliques no kicker, ano no rodapé)
- [x] CI GitHub Actions (`lint` + `build`)
- [x] `.env.example` (placeholder `DATABASE_URL`; base **opcional**)
- [x] LinkedIn atualizado nas mensagens

---

## Ciclo 1 — Navegação, SEO e páginas base

- [ ] `sitemap.xml` / `robots.txt` (App Router ou `metadata` + rotas estáticas)
- [ ] Open Graph / Twitter cards por rota (`generateMetadata` em `/`, `/work`, `/lab`)
- [ ] `manifest.webmanifest` + ícones PWA *(opcional)*
- [ ] Secção ou página **legal** (impressum / privacidade) se publicares na UE *(conforme necessidade)*

---

## Ciclo 2 — Conteúdo e CV

- [ ] Download ou página **CV** (PDF estático ou link para repositório LaTeX)
- [ ] Imagens ou **galeria** por projeto (screenshots com permissão)
- [ ] Métricas nos casos **só** quando forem verificáveis (evitar números frágeis)

---

## Ciclo 3 — Blog ou notas

- [ ] Conteúdo em MDX ou `content/*.md` com listagem e datas
- [ ] RSS (`feed.xml`)
- [ ] OG por artigo

---

## Ciclo 4 — Interação, tema e acessibilidade

- [ ] Alternador **tema** claro / escuro / sistema *(hoje: só `prefers-color-scheme`)*
- [ ] Formulário de contacto com persistência *(aí sim faz sentido Neon + `DATABASE_URL` na Vercel)* ou serviço externo (Resend, Formspree)
- [ ] Revisão a11y (landmarks, foco, `prefers-reduced-motion` nos jogos)

---

## Ciclo 5 — Qualidade e operação

- [ ] Testes E2E (Playwright): locales, links principais, `/lab`
- [ ] Documentar deploy (Vercel, domínio, envs) num único sítio *(ex.: secção no `README` ou `CLAUDE.md`)*
- [ ] Observabilidade opcional (analytics privacy-friendly, Sentry) *(se fizer sentido)*

---

## Base de dados (Neon)

**Não é obrigatória** para o site estático atual. Considera PostgreSQL quando precisares de **persistência** (contactos, CMS, blog na BD, contas).

Variável: `DATABASE_URL` (ver `.env.example`). Nunca commits com passwords.

---

## Como usar isto com GitHub

Podes abrir **uma issue por tarefa** ou **uma issue por ciclo**, copiando as bullets. Este ficheiro continua a ser a visão única do roadmap no repositório.
