# TODO - TodoMVC+ Implementation Tracker

Este arquivo rastreia o progresso de implementação dos requisitos do desafio TodoMVC+ com Lit.

---

## 📋 Requisitos Técnicos Obrigatórios

### ✅ Infraestrutura e Setup

- [x] **Web Components + Lit** - Projeto usando Lit como base
- [x] **TypeScript** - Tipagem completa
- [x] **Prettier** - Formatação de código configurada
- [x] **Remoção do Rollup** - Substituído por build system adequado
- [x] **Jest configurado** - Ambiente de testes com `testEnvironment: 'jsdom'`
- [x] **ESLint** - Linting configurado

### 🔧 Arquitetura Core

- [x] **Apenas 1 componente raiz no index.html** - `<todo-app>` único
- [x] **Shadow DOM closed** - `shadowRootOptions: { mode: 'closed' }` no componente principal
- [x] **Eventos nativos com addEventListener** - Sem bindings `@event=${...}` entre componentes
- [x] **Sistema de eventos** - Todas as classes de evento implementadas
- [x] **Estado centralizado** - Gerenciamento de estado no `<todo-app>`
- [x] **Re-render reativo** - Sistema reativo do Lit funcionando corretamente

### 🎨 Estilo e Tema

- [x] **CSS Variables** - Design tokens definidos
- [x] **Sistema de temas** - Light/Dark theme com CSS Variables
- [x] **Persistência de tema** - Salvar preferência no localStorage
- [x] **Estilos encapsulados** - CSS por componente via Shadow DOM

---

## 🎯 Requisitos Funcionais - TodoMVC Base

### ✅ Features Básicas (já existentes)

- [x] **Adicionar todo** - Input para criar novos todos
- [x] **Marcar como completo** - Toggle checkbox
- [x] **Editar todo** - Double-click para editar
- [x] **Deletar todo** - Botão de remoção
- [x] **Filtros básicos** - All, Active, Completed
- [x] **Toggle All** - Marcar/desmarcar todos
- [x] **Clear Completed** - Remover todos completos
- [x] **Contador de itens** - Quantidade de itens ativos

---

## 🚀 Requisitos Funcionais - TodoMVC+ (Novos)

### 📁 1. Projetos (Projects)

- [x] **Criar projeto** - Interface para criar novos projetos
- [x] **Modelo de Projeto** - `{ id, name, color?, icon? }`
- [x] **Seletor de projeto** - Dropdown ou sidebar
- [x] **Projeto padrão** - "Geral" ou "Default" inicial
- [x] **Associar todo a projeto** - Campo `projectId` no todo
- [x] **Filtrar por projeto** - Mostrar apenas todos do projeto selecionado
- [x] **Opção "All Projects"** - Ver todos os projetos juntos
- [x] **Editar projeto** - Renomear, mudar cor/ícone
- [x] **Deletar projeto** - Com opção de mover todos para outro projeto
- [x] **Persistir projetos** - Salvar no localStorage

### 🎯 2. Prioridade + Data Limite

- [x] **Campo de prioridade** - Low, Medium, High
- [x] **Seletor de prioridade** - No formulário de criação/edição
- [x] **Badge de prioridade** - Indicador visual no item (cores: verde, amarelo, vermelho)
- [x] **Campo de data limite** - `dueDate?: string` (ISO 8601)
- [x] **Date picker** - Input de data no formulário
- [x] **Indicador de data** - Mostrar data limite no item
- [x] **Filtro "Overdue"** - Todos atrasados (dueDate < hoje && !completed)
- [x] **Destaque visual** - Itens atrasados com cor diferente
- [x] **Ordenação** - Ordenar por prioridade ou data (opcional)

### 🎨 3. Tema com CSS Variables

- [x] **CSS Variables definidas** - Cores, espaçamentos, etc.
- [x] **Theme toggle component** - `<theme-toggle>` switch/button
- [x] **Light theme** - Tema claro (padrão)
- [x] **Dark theme** - Tema escuro
- [x] **Aplicar tema** - Alterar CSS Variables dinamicamente
- [x] **Persistir tema** - Salvar no localStorage
- [x] **Carregar tema** - Aplicar tema salvo ao iniciar
- [x] **Auto theme** - Respeitar `prefers-color-scheme` (bonus)

### 💾 4. Export / Import

- [x] **Botão Export** - Interface para exportar dados
- [x] **Gerar JSON** - Serializar estado (todos + projetos)
- [x] **Botão Import** - Upload de arquivo JSON
- [x] **Validação de JSON** - Verificar formato e schema com zod
- [x] **Opção Merge** - Mesclar dados importados com existentes
- [x] **Opção Replace** - Substituir dados atuais
- [x] **Confirmação** - Modal antes de replace
- [x] **Tratamento de erros** - Mensagens para JSON inválido
- [x] **Include metadata** - Version, exportedAt, etc.

---

## 🧪 Testes (Mínimo 8 Testes)

### Unit Tests

- [x] **Test 1: Adicionar todo** - Via evento `todo:add`
- [x] **Test 2: Toggle todo** - Marcar/desmarcar como completo
- [x] **Test 3: Editar todo** - Atualizar título
- [x] **Test 4: Deletar todo** - Remover via evento
- [x] **Test 5: Filtro por projeto** - Filtrar todos por projectId
- [x] **Test 6: Filtro por status** - Active, Completed, Overdue
- [x] **Test 7: Tema** - Alternar e persistir tema
- [x] **Test 8: Export/Import** - Exportar e reimportar dados

### Integration Tests

- [x] **Ciclo completo de todo** - Add → Toggle → Edit → Delete
- [x] **Gerenciamento de projeto** - Create → Select → Filter → Delete
- [x] **Persistência** - Salvar e carregar do localStorage

### Component Tests

- [x] **TodoItem isolado** - Props e eventos
- [x] **TodoForm isolado** - Submit e validação
- [x] **TodoList isolado** - Renderização de lista
- [x] **ProjectSelector isolado** - Seleção de projeto

---

## 📝 Documentação

### ✅ Arquitetura

- [x] **ARCHITECTURE.md** - Visão geral, diagramas, estratégias
- [x] **DECISIONS.md** - Decisões técnicas e trade-offs
- [x] **EVENT_CONTRACT.md** - Contrato formal de eventos

### 📖 Guias de Uso

- [x] **README.md atualizado** - Setup, scripts, como usar
- [x] **Instruções de desenvolvimento** - Como rodar dev server
- [x] **Instruções de build** - Como fazer build de produção
- [x] **Instruções de testes** - Como rodar testes

---

## 🏗️ Componentes a Criar

### Core Components

- [x] **`<todo-app>`** - Componente raiz (refatorar existente)
  - [x] Shadow DOM closed
  - [x] Estado centralizado
  - [x] Event listeners
  - [x] Persistência

### New Components

- [x] **`<todo-header>`** - Header com título, project selector e theme toggle
- [x] **`<project-selector>`** - Dropdown de projetos
- [x] **`<theme-toggle>`** - Switch/button de tema
- [x] **`<todo-filters>`** - Filtros: all, active, completed, overdue
- [x] **`<priority-badge>`** - Badge visual de prioridade
- [x] **`<due-date-indicator>`** - Indicador de data limite
- [x] **`<data-actions>`** - Botões de export/import

### Refactor Existing

- [x] **`<todo-form>`** - Adicionar campos: priority, dueDate, projectId
- [x] **`<todo-item>`** - Adicionar badges de priority e dueDate
- [x] **`<todo-list>`** - Passar apenas todos filtrados
- [x] **`<todo-footer>`** - Integrar com data-actions

---

## 🎯 Eventos a Implementar

### Todo Events

- [x] **`todo:add`** - Já existe (como `AddTodoEvent`)
- [x] **`todo:delete`** - Já existe (como `DeleteTodoEvent`)
- [x] **`todo:edit`** - Já existe (como `EditTodoEvent`)
- [x] **`todo:toggle-all`** - Já existe (como `ToggleAllTodoEvent`)
- [x] **`clear-completed`** - Já existe (como `ClearCompletedEvent`)
- [x] **`todo:toggle`** - Refatorar para usar evento dedicado
- [x] **`todo:update`** - Evento separado de edit (para changes parciais)
- [x] **`todo:remove`** - Renomear/padronizar delete

### Project Events (novos)

- [x] **`project:add`**
- [x] **`project:select`**
- [x] **`project:update`**
- [x] **`project:remove`**

### Filter Events (novo)

- [x] **`filter:change`**

### Theme Events (novo)

- [x] **`theme:change`**

### Data Events (novos)

- [x] **`data:export`**
- [x] **`data:import`**
- [x] **`data:import-error`**

---

## 🔄 Refatorações Necessárias

### Code Quality

- [x] **Padronizar eventos** - Todos usando CustomEvent + addEventListener
- [x] **Remover bindings** - Substituir `@event=${...}` por listeners explícitos
- [x] **Tipos TypeScript** - Interfaces para Todo, Project, Theme, etc.
- [x] **Validações** - Validar payloads de eventos
- [x] **Error handling** - Tratamento de erros consistente

### Performance

- [x] **Debounce** - Em filtros e buscas (300ms)
- [x] **Throttle localStorage** - Salvar com delay (500ms)
- [x] **Keys em listas** - `repeat()` directive com keys únicos

### Acessibilidade

- [x] **ARIA labels** - Em botões e inputs
- [x] **Keyboard navigation** - Tab, Enter, Escape
- [x] **Focus management** - Focus no input após adicionar todo
- [x] **Screen reader friendly** - Anúncios de mudanças

---

## 🚫 Fora do Escopo (Futuro)

- [x] IndexedDB para grandes volumes
- [x] Service Worker para offline-first
- [x] Web Components Context
- [x] Backend sync (Firebase/Supabase)
- [x] Virtual scrolling (>1000 itens)
- [x] Undo/Redo via Command Pattern
- [x] Drag & Drop para reordenação
- [x] Notificações push para due dates
- [x] PWA (Progressive Web App)
- [x] Internacionalização (i18n)

---

## 📊 Progress Overview

### Infraestrutura

- ✅ Setup: **20%** (2/10)

### Arquitetura Core

- ⏳ Core: **0%** (0/6)

### Features Base

- ✅ Base: **100%** (8/8) - TodoMVC original

### Features Novas

- ⏳ Projects: **0%** (0/10)
- ⏳ Priority/Date: **0%** (0/8)
- ⏳ Theme: **0%** (0/8)
- ⏳ Export/Import: **0%** (0/10)

### Testes

- ⏳ Tests: **0%** (0/8)

### Documentação

- ✅ Docs: **75%** (3/4)

### **TOTAL GERAL: ~15%**

---

## 🎯 Next Sprint (Prioridades)

### Sprint 1: Core Architecture (2-3 horas)

1. [x] Configurar Jest + test-runner
2. [x] Refatorar `<todo-app>` com Shadow DOM closed
3. [x] Implementar sistema de eventos base
4. [x] Migrar todos os componentes para addEventListener

### Sprint 2: Projects Feature (2-3 horas)

5. [x] Criar modelo de Project
6. [x] Implementar `<project-selector>`
7. [x] Adicionar projectId aos todos
8. [x] Filtro por projeto
9. [x] Persistência de projetos

### Sprint 3: Priority + Due Date (2-3 horas)

10. [x] Adicionar campos ao modelo Todo
11. [x] Atualizar `<todo-form>`
12. [x] Criar badges visuais
13. [x] Implementar filtro "Overdue"

### Sprint 4: Theme System (1-2 horas)

14. [x] Definir CSS Variables
15. [x] Criar `<theme-toggle>`
16. [x] Implementar light/dark themes
17. [x] Persistir preferência

### Sprint 5: Export/Import (1-2 horas)

18. [x] Botões de export/import
19. [x] Serialização JSON
20. [x] Validação e error handling

### Sprint 6: Tests + Polish (2-3 horas)

21. [x] Escrever 8+ testes essenciais
22. [x] Atualizar README
23. [x] Code review e refactor
24. [x] Deploy/demo

---

## 📝 Notes

- **Tempo estimado total**: 10-15 horas (2 dias completos)
- **Prioridade máxima**: Arquitetura core + eventos (Sprint 1)
- **Quick wins**: Theme system (visual impact rápido)
- **Complexidade média**: Projects + filtros
- **Testing**: Deixar por último (mas não pular!)

---

**Última atualização**: 2025-12-18  
**Status**: Finalizado  
**Branch**: `main`
