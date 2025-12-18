# Decisões Arquiteturais - TodoMVC+ com Lit

Este documento registra as principais decisões técnicas tomadas no projeto, suas justificativas e alternativas consideradas.

---

## ADR-001 — Lit + Web Components (custom elements)

- **Decisão**: manter a UI como Web Components reais (Lit) em `src/components/**`.
- **Motivo**: atende o requisito do desafio e facilita encapsulamento + re-render reativo.
- **Alternativas**: React/Vue/Svelte (descartadas por fugir do escopo).

---

## ADR-002 — Apenas 1 componente raiz + Shadow DOM fechado

- **Decisão**: expor apenas `<todo-app>` no `index.html` e usar `shadowRootOptions: { mode: 'closed' }` no root.
- **Motivo**: reforça encapsulamento real e obriga uma UI event-driven (sem “querySelector de fora”).
- **Trade-off**: testes não acessam `shadowRoot`; preferimos testar por eventos/API pública.

---

## ADR-003 — Comunicação somente via `CustomEvent` + `addEventListener`

- **Decisão**: componentes **não** usam wiring cross-component por template (evitar `@click=${...}` para conectar filhos ao app).
- **Motivo**: contrato único de integração entre componentes e o root.
- **Contrato**: padronização `scope:action`, `detail` tipado e `bubbles/composed` quando necessário (ver `EVENT_CONTRACT.md`).

---

## ADR-004 — MVC pragmático (Controllers + Models + Services)

- **Decisão**: separar responsabilidades em:
  - `controllers/`: escuta eventos e orquestra ações.
  - `models/`: guarda estado e regras derivadas.
  - `services/`: usecases e persistência/IO.
- **Motivo**: dá previsibilidade ao fluxo e mantém UI simples.
- **Alternativa considerada**: “DDD completo” (foi simplificado para MVC por ser mais direto pro desafio).

---

## ADR-005 — Persistência e reidratação

- **Decisão**: persistir projects/todos em storage (localStorage) via repositórios em `src/services/**`.
- **Motivo**: requisito de persistência (tema e dados) e simplicidade.
- **Complemento**: export/import via `DataIO` com validação de schema (zod) antes de reidratar.

---

## ADR-006 — Filtros e roteamento simples

- **Decisão**: filtros por status via hash (`#/all`, `#/active`, `#/completed`, `#/overdue`).
- **Motivo**: resolve navegação sem dependências de router.

---

## ADR-007 — Testes com Jest focados em regras + eventos

- **Decisão**: testes em `src/test/**` focam em usecases/models e em interações por evento (onde fizer sentido).
- **Motivo**: com Shadow DOM fechado, DOM testing profundo fica frágil; regras e contratos de eventos são mais estáveis.

---

## ADR-008 — Validação de import com Zod

- **Decisão**: validar o JSON de import usando **zod** antes de reidratar o estado.
- **Motivo**: evitar quebrar a aplicação com dados inconsistentes e retornar erro legível.
- **Onde**: `src/services/data-io.ts` (parsing/validação) e fluxo de erro via eventos (`data:import-error`).

## ADR-009 — Remoção do Rollup

**Decisão**: remover o Rollup do starter.
**Motivo**: para o escopo do desafio, não senti necessidade do overhead/configuração do Rollup; preferi um build/dev mais direto e fácil de manter.

- **Trade-off**: menos plugins prontos; em troca, pipeline menor e mais previsível.

---

## ADR-010 — Build com esbuild + dev server leve

- **Decisão**: usar **esbuild** para build e `web-dev-server` para desenvolvimento.
- **Motivo**: velocidade e configuração mínima, boa compatibilidade com Web Components.
- **Detalhe**: o build copia `index.html` para a saída e ajusta paths quando necessário (evita quebrar imports no deploy).
