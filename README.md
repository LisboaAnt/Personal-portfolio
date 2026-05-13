# Portfolio (Next.js)

Site pessoal em **Next.js 16** com **internacionalização** (`next-intl`): **pt** (default), **en**, **es**.

Conteúdo base alinhado ao README do repositório **my-portfolio** (hub de projetos, blog, carreira) + secção de **projetos** (Vittahub, Ussin, módulo UFC) e **contacto**.

- **Site:** [antoniolisboa.site](https://antoniolisboa.site)
- **Email:** [antoniol.carvalho49@gmail.com](mailto:antoniol.carvalho49@gmail.com)

## i18n e deteção

- **Locale da página:** negociação automática (`Accept-Language`) + cookie `NEXT_LOCALE` se definires um switcher.
- **Região:** na UI mostra-se o cabeçalho `x-vercel-ip-country` quando existir (ex.: deploy na **Vercel**) — é **informativo**; não força o idioma sozinho.

Traduções em `messages/pt.json`, `messages/en.json`, `messages/es.json`.

## Comandos

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) — o middleware/proxy redireciona para o locale adequado.

## Documentação interna

Ver **`CLAUDE.md`**.
