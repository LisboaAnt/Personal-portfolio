# Como adicionar uma sala 3D

Guia para **Fase 6+**. Pré-requisito: Fases 0–2 concluídas.

---

## 1. Configuração — `world/rooms.ts`

```ts
{
  id: "nova-sala",
  paths: ["/nova-rota", "/pt/nova-rota"], // incluir locales se necessário
  camera: {
    position: [4, 2, 8],
    target: [4, 0, 0],
    fov: 50,
  },
  transition: {
    durationMs: 1200,
    style: "zoom", // ou "arc"
  },
  overlay: {
    fadeOutMs: 200,
    fadeInMs: 400,
    enterDelayMs: 800,
  },
},
```

Mapear pathname em `hooks/useWorldRoomFromPath.ts` (se não for automático por prefixo).

---

## 2. Mesh — `components/world/rooms/RoomNova.tsx`

- Exportar grupo `<group name="room-nova-sala">`.
- Usar materiais de [ART.md](./ART.md).
- Manter triângulos dentro do orçamento global.

Registar em `WorldScene.tsx`:

```tsx
<RoomNova visible={currentRoomId === "nova-sala" || isNeighbor} />
```

_(visibilidade de vizinhos opcional para pré-carregar)_

---

## 3. Rota Next.js

- `app/[locale]/nova-rota/page.tsx` — conteúdo overlay (pode reutilizar layout).
- `generateMetadata` + entradas em `messages/*.json`.

---

## 4. Navegação

- Link em `SiteChrome` ou home → usar `WorldLink href="/nova-rota"`.

---

## 5. Testes

- [QA-CHECKLIST.md](./QA-CHECKLIST.md) — navegação + deep link.
- `npm run build`

---

## 6. Documentação

- Atualizar tabela de salas em [ART.md](./ART.md).
- Screenshot em PR.

---

## Pedido sem código (visitante)

Template GitHub: `.github/ISSUE_TEMPLATE/world-room.yml` (criar na Fase 6).
