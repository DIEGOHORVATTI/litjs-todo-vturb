# TODO - TodoMVC+ Implementation Tracker

Este arquivo rastreia o progresso de implementação dos requisitos do desafio TodoMVC+ com Lit.

---

## 📋 Requisitos Técnicos Obrigatórios

### ✅ Infraestrutura e Setup

- [x] **Web Components + Lit** - Projeto usando Lit como base
- [x] **TypeScript** - Tipagem completa
- [x] **Prettier** - Formatação de código configurada
- [x] **Remoção do Rollup** - Substituído por build system adequado
- [ ] **Jest configurado** - Ambiente de testes com `testEnvironment: 'jsdom'`
- [ ] **ESLint** - Linting configurado

### 🔧 Arquitetura Core

- [ ] **Apenas 1 componente raiz no index.html** - `<todo-app>` único
- [ ] **Shadow DOM closed** - `shadowRootOptions: { mode: 'closed' }` no componente principal
- [ ] **Eventos nativos com addEventListener** - Sem bindings `@event=${...}` entre componentes
- [ ] **Sistema de eventos** - Todas as classes de evento implementadas
- [ ] **Estado centralizado** - Gerenciamento de estado no `<todo-app>`
- [ ] **Re-render reativo** - Sistema reativo do Lit funcionando corretamente

### 🎨 Estilo e Tema

- [ ] **CSS Variables** - Design tokens definidos
- [ ] **Sistema de temas** - Light/Dark theme com CSS Variables
- [ ] **Persistência de tema** - Salvar preferência no localStorage
- [ ] **Estilos encapsulados** - CSS por componente via Shadow DOM

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

- [ ] **Criar projeto** - Interface para criar novos projetos
- [ ] **Modelo de Projeto** - `{ id, name, color?, icon? }`
- [ ] **Seletor de projeto** - Dropdown ou sidebar
- [ ] **Projeto padrão** - "Geral" ou "Default" inicial
- [ ] **Associar todo a projeto** - Campo `projectId` no todo
- [ ] **Filtrar por projeto** - Mostrar apenas todos do projeto selecionado
- [ ] **Opção "All Projects"** - Ver todos os projetos juntos
- [ ] **Editar projeto** - Renomear, mudar cor/ícone
- [ ] **Deletar projeto** - Com opção de mover todos para outro projeto
- [ ] **Persistir projetos** - Salvar no localStorage

### 🎯 2. Prioridade + Data Limite

- [ ] **Campo de prioridade** - Low, Medium, High
- [ ] **Seletor de prioridade** - No formulário de criação/edição
- [ ] **Badge de prioridade** - Indicador visual no item (cores: verde, amarelo, vermelho)
- [ ] **Campo de data limite** - `dueDate?: string` (ISO 8601)
- [ ] **Date picker** - Input de data no formulário
- [ ] **Indicador de data** - Mostrar data limite no item
- [ ] **Filtro "Overdue"** - Todos atrasados (dueDate < hoje && !completed)
- [ ] **Destaque visual** - Itens atrasados com cor diferente
- [ ] **Ordenação** - Ordenar por prioridade ou data (opcional)

### 🎨 3. Tema com CSS Variables

- [ ] **CSS Variables definidas** - Cores, espaçamentos, etc.
- [ ] **Theme toggle component** - `<theme-toggle>` switch/button
- [ ] **Light theme** - Tema claro (padrão)
- [ ] **Dark theme** - Tema escuro
- [ ] **Aplicar tema** - Alterar CSS Variables dinamicamente
- [ ] **Persistir tema** - Salvar no localStorage
- [ ] **Carregar tema** - Aplicar tema salvo ao iniciar
- [ ] **Auto theme** - Respeitar `prefers-color-scheme` (bonus)

### 💾 4. Export / Import

- [ ] **Botão Export** - Interface para exportar dados
- [ ] **Gerar JSON** - Serializar estado (todos + projetos)
- [ ] **Download JSON** - Salvar arquivo com timestamp
- [ ] **Botão Import** - Upload de arquivo JSON
- [ ] **Validação de JSON** - Verificar formato e schema
- [ ] **Opção Merge** - Mesclar dados importados com existentes
- [ ] **Opção Replace** - Substituir dados atuais
- [ ] **Confirmação** - Modal antes de replace
- [ ] **Tratamento de erros** - Mensagens para JSON inválido
- [ ] **Include metadata** - Version, exportedAt, etc.

---

## 🧪 Testes (Mínimo 8 Testes)

### Unit Tests

- [ ] **Test 1: Adicionar todo** - Via evento `todo:add`
- [ ] **Test 2: Toggle todo** - Marcar/desmarcar como completo
- [ ] **Test 3: Editar todo** - Atualizar título
- [ ] **Test 4: Deletar todo** - Remover via evento
- [ ] **Test 5: Filtro por projeto** - Filtrar todos por projectId
- [ ] **Test 6: Filtro por status** - Active, Completed, Overdue
- [ ] **Test 7: Tema** - Alternar e persistir tema
- [ ] **Test 8: Export/Import** - Exportar e reimportar dados

### Integration Tests

- [ ] **Ciclo completo de todo** - Add → Toggle → Edit → Delete
- [ ] **Gerenciamento de projeto** - Create → Select → Filter → Delete
- [ ] **Persistência** - Salvar e carregar do localStorage

### Component Tests

- [ ] **TodoItem isolado** - Props e eventos
- [ ] **TodoForm isolado** - Submit e validação
- [ ] **TodoList isolado** - Renderização de lista
- [ ] **ProjectSelector isolado** - Seleção de projeto

---

## 📝 Documentação

### ✅ Arquitetura

- [x] **ARCHITECTURE.md** - Visão geral, diagramas, estratégias
- [x] **DECISIONS.md** - Decisões técnicas e trade-offs
- [x] **EVENT_CONTRACT.md** - Contrato formal de eventos

### 📖 Guias de Uso

- [ ] **README.md atualizado** - Setup, scripts, como usar
- [ ] **Instruções de desenvolvimento** - Como rodar dev server
- [ ] **Instruções de build** - Como fazer build de produção
- [ ] **Instruções de testes** - Como rodar testes

---

## 🏗️ Componentes a Criar

### Core Components

- [ ] **`<todo-app>`** - Componente raiz (refatorar existente)
  - [ ] Shadow DOM closed
  - [ ] Estado centralizado
  - [ ] Event listeners
  - [ ] Persistência

### New Components

- [ ] **`<todo-header>`** - Header com título, project selector e theme toggle
- [ ] **`<project-selector>`** - Dropdown de projetos
- [ ] **`<theme-toggle>`** - Switch/button de tema
- [ ] **`<todo-filters>`** - Filtros: all, active, completed, overdue
- [ ] **`<priority-badge>`** - Badge visual de prioridade
- [ ] **`<due-date-indicator>`** - Indicador de data limite
- [ ] **`<data-actions>`** - Botões de export/import

### Refactor Existing

- [ ] **`<todo-form>`** - Adicionar campos: priority, dueDate, projectId
- [ ] **`<todo-item>`** - Adicionar badges de priority e dueDate
- [ ] **`<todo-list>`** - Passar apenas todos filtrados
- [ ] **`<todo-footer>`** - Integrar com data-actions

---

## 🎯 Eventos a Implementar

### Todo Events

- [x] **`todo:add`** - Já existe (como `AddTodoEvent`)
- [x] **`todo:delete`** - Já existe (como `DeleteTodoEvent`)
- [x] **`todo:edit`** - Já existe (como `EditTodoEvent`)
- [x] **`todo:toggle-all`** - Já existe (como `ToggleAllTodoEvent`)
- [x] **`clear-completed`** - Já existe (como `ClearCompletedEvent`)
- [ ] **`todo:toggle`** - Refatorar para usar evento dedicado
- [ ] **`todo:update`** - Evento separado de edit (para changes parciais)
- [ ] **`todo:remove`** - Renomear/padronizar delete

### Project Events (novos)

- [ ] **`project:add`**
- [ ] **`project:select`**
- [ ] **`project:update`**
- [ ] **`project:remove`**

### Filter Events (novo)

- [ ] **`filter:change`**

### Theme Events (novo)

- [ ] **`theme:change`**

### Data Events (novos)

- [ ] **`data:export`**
- [ ] **`data:import`**
- [ ] **`data:import-error`**

---

## 🔄 Refatorações Necessárias

### Code Quality

- [ ] **Padronizar eventos** - Todos usando CustomEvent + addEventListener
- [ ] **Remover bindings** - Substituir `@event=${...}` por listeners explícitos
- [ ] **Tipos TypeScript** - Interfaces para Todo, Project, Theme, etc.
- [ ] **Validações** - Validar payloads de eventos
- [ ] **Error handling** - Tratamento de erros consistente

### Performance

- [ ] **Debounce** - Em filtros e buscas (300ms)
- [ ] **Throttle localStorage** - Salvar com delay (500ms)
- [ ] **Keys em listas** - `repeat()` directive com keys únicos

### Acessibilidade

- [ ] **ARIA labels** - Em botões e inputs
- [ ] **Keyboard navigation** - Tab, Enter, Escape
- [ ] **Focus management** - Focus no input após adicionar todo
- [ ] **Screen reader friendly** - Anúncios de mudanças

---

## 🚫 Fora do Escopo (Futuro)

- [ ] IndexedDB para grandes volumes
- [ ] Service Worker para offline-first
- [ ] Web Components Context
- [ ] Backend sync (Firebase/Supabase)
- [ ] Virtual scrolling (>1000 itens)
- [ ] Undo/Redo via Command Pattern
- [ ] Drag & Drop para reordenação
- [ ] Notificações push para due dates
- [ ] PWA (Progressive Web App)
- [ ] Internacionalização (i18n)

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

1. [ ] Configurar Jest + test-runner
2. [ ] Refatorar `<todo-app>` com Shadow DOM closed
3. [ ] Implementar sistema de eventos base
4. [ ] Migrar todos os componentes para addEventListener

### Sprint 2: Projects Feature (2-3 horas)

5. [ ] Criar modelo de Project
6. [ ] Implementar `<project-selector>`
7. [ ] Adicionar projectId aos todos
8. [ ] Filtro por projeto
9. [ ] Persistência de projetos

### Sprint 3: Priority + Due Date (2-3 horas)

10. [ ] Adicionar campos ao modelo Todo
11. [ ] Atualizar `<todo-form>`
12. [ ] Criar badges visuais
13. [ ] Implementar filtro "Overdue"

### Sprint 4: Theme System (1-2 horas)

14. [ ] Definir CSS Variables
15. [ ] Criar `<theme-toggle>`
16. [ ] Implementar light/dark themes
17. [ ] Persistir preferência

### Sprint 5: Export/Import (1-2 horas)

18. [ ] Botões de export/import
19. [ ] Serialização JSON
20. [ ] Validação e error handling

### Sprint 6: Tests + Polish (2-3 horas)

21. [ ] Escrever 8 testes essenciais
22. [ ] Atualizar README
23. [ ] Code review e refactor
24. [ ] Deploy/demo

---

## 📝 Notes

- **Tempo estimado total**: 10-15 horas (2 dias completos)
- **Prioridade máxima**: Arquitetura core + eventos (Sprint 1)
- **Quick wins**: Theme system (visual impact rápido)
- **Complexidade média**: Projects + filtros
- **Testing**: Deixar por último (mas não pular!)

---

**Última atualização**: 2025-12-16  
**Status**: 🟡 Em desenvolvimento  
**Branch**: `architectural-alchemy`
