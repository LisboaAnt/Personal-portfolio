# Fase 1 — Spike técnico

**Objetivo:** Provar React Three Fiber + animação de câmara entre 3 pontos; medir performance; decidir biblioteca de animação.

**Duração orientativa:** 3–5 dias  
**Saída:** Demo isolada; relatório spike; decisão **D1** em [DECISIONS.md](../DECISIONS.md).

**Dependências:** Fase 0 concluída  
**Bloqueia:** Fase 2

---

## Tarefas

### 1.1 — Instalar dependências

| Campo | Valor |
|-------|--------|
| **Pacotes** | `three`, `@react-three/fiber`, `@react-three/drei`, `@react-spring/three` (e/ou `gsap`) |
| **Aceite** | `npm run build` passa; versões fixadas no `package-lock.json` |

---

### 1.2 — `WorldCanvas` com dynamic import

| Campo | Valor |
|-------|--------|
| **Ficheiros** | `components/world/WorldCanvas.tsx` |
| **Detalhe** | `dynamic(..., { ssr: false })`; `dpr={[1, 1.5]}`; `gl={{ antialias: true, alpha: true }}` |
| **Aceite** | Sem erro de hidratação |

---

### 1.3 — Rota de demo

| Campo | Valor |
|-------|--------|
| **Opções** | `app/[locale]/lab/world/page.tsx` **ou** flag `NEXT_PUBLIC_WORLD_3D=1` |
| **Aceite** | Demo acessível sem quebrar site público com flag `0` |

---

### 1.4 — Cena mínima

| Campo | Valor |
|-------|--------|
| **Conteúdo** | Plano chão + 3 meshes (cores accent) em posições distintas |
| **Aceite** | 60 FPS em desktop de desenvolvimento |

---

### 1.5 — `CameraRig` + animação

| Campo | Valor |
|-------|--------|
| **Comportamento** | Clique em mesh → câmara move `position` + `lookAt` em ~1200ms |
| **Aceite** | Movimento perceptível sem nausea excessiva |

---

### 1.6 — Teste de persistência

| Campo | Valor |
|-------|--------|
| **Ação** | Se canvas no layout de teste: navegar 10× entre lab e demo |
| **Aceite** | React DevTools: mesmo canvas, sem unmount |

---

### 1.7 — FPS (dev)

| Campo | Valor |
|-------|--------|
| **Ferramenta** | `drei/Stats` ou contador |
| **Aceite** | Valores anotados no relatório |

---

### 1.8 — Matriz de dispositivos

| Dispositivo | FPS idle | FPS transição | Notas |
|-------------|----------|---------------|-------|
| Desktop | | | |
| Android | | | |
| iPhone | | | |

---

### 1.9 — Spring vs GSAP

| Campo | Valor |
|-------|--------|
| **Entregável** | Secção em `docs/3d-world/spike/REPORT.md` |
| **Critérios** | Curvas, DX, bundle KB, integração R3F |
| **Aceite** | Recomendação explícita → atualizar D1 |

---

### 1.10 — Fallback WebGL

| Campo | Valor |
|-------|--------|
| **Ficheiros** | `hooks/useWebGLAvailable.ts` + UI simples na demo |
| **Aceite** | Simular falha → mensagem + link versão 2D |

---

### 1.11 — Comparar estilos zoom vs arc (spike A/B)

| Estilo | Implementação rápida | Notas |
|--------|------------------------|-------|
| **zoom** | Animar `fov` ou aproximar `z` | Wonder |
| **arc** | Bezier em `position` | LBP |

| **Aceite** | Vídeo ou GIF de 5s de cada um anexado ao REPORT |

---

## Entregáveis

- [ ] `docs/3d-world/spike/REPORT.md`
- [ ] Demo funcional
- [ ] D1 fechada em DECISIONS.md

## Checklist de fecho

- [x] 1.1 – 1.5, 1.7, 1.10 (demo `/lab/world`)
- [ ] 1.6, 1.8, 1.9, 1.11 (relatório spike pendente)

**Próximo:** [PHASE-02-orchestrator.md](./PHASE-02-orchestrator.md)
