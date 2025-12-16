# Arquitetura TodoMVC+ com Lit

## Visão Geral

Esta arquitetura implementa uma aplicação TodoMVC estendida usando **Web Components com Lit**, seguindo os princípios de **componentização**, **encapsulamento via Shadow DOM fechado** e **comunicação por eventos nativos**.

### Princípios Arquiteturais

1. **Single Root Component**: Apenas `<todo-app>` é exposto no `index.html`
2. **Event-Driven Communication**: Comunicação exclusiva via `CustomEvent` + `addEventListener`
3. **Closed Shadow DOM**: Encapsulamento completo no componente principal
4. **Centralized State**: Estado gerenciado no componente raiz
5. **Unidirectional Data Flow**: Props down, events up

---

## Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────┐
│  <todo-app> (Root - Shadow DOM: closed)                     │
│  • Estado centralizado (projects, todos, theme, filter)     │
│  • Event listeners para todos os eventos custom             │
│  • Distribui dados via props para componentes filhos        │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  <todo-header>                                        │  │
│  │  • <project-selector> (dropdown de projetos)          │  │
│  │  • <theme-toggle> (light/dark)                        │  │
│  │  Eventos: project:select, theme:change                │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  <todo-form>                                          │  │
│  │  • Input para novo todo                               │  │
│  │  • Campos: title, priority, dueDate                   │  │
│  │  Evento: todo:add                                     │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  <todo-filters>                                       │  │
│  │  • Filtros: all, active, completed, overdue           │  │
│  │  • Botão "Toggle All"                                 │  │
│  │  Eventos: filter:change, todo:toggle-all              │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  <todo-list> (recebe: todos filtrados)               │  │
│  │  │                                                     │  │
│  │  │  ┌──────────────────────────────────────────────┐ │  │
│  │  │  │ <todo-item>                                  │ │  │
│  │  │  │ • Checkbox (toggle)                          │ │  │
│  │  │  │ • Badges: priority, due date                 │ │  │
│  │  │  │ • Botões: edit, delete                       │ │  │
│  │  │  │ Eventos: todo:toggle, todo:update,           │ │  │
│  │  │  │          todo:remove                          │ │  │
│  │  │  └──────────────────────────────────────────────┘ │  │
│  │  │  (repetido para cada todo)                        │  │
│  │  └─────────────────────────────────────────────────── │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  <todo-footer>                                        │  │
│  │  • Contador de itens ativos                           │  │
│  │  • Botão "Clear Completed"                            │  │
│  │  • Botões Export/Import                               │  │
│  │  Eventos: todo:clear-completed, data:export,          │  │
│  │           data:import                                 │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

                        ▼
                   index.html
              <todo-app></todo-app>
```

---

## Fluxo de Eventos

### Exemplo: Adicionar um Todo

```
1. Usuário preenche <todo-form> e pressiona Enter
   │
   └──> <todo-form> dispara CustomEvent:
        new AddTodoEvent({
          title: "Comprar leite",
          projectId: "work",
          priority: "high",
          dueDate: "2025-12-20"
        })
        { bubbles: true, composed: true }

2. Evento "atravessa" Shadow DOM (composed: true)
   │
   └──> <todo-app> captura via addEventListener('todo:add', ...)

3. <todo-app> atualiza estado interno:
   this.todos = [...this.todos, newTodo]
   │
   └──> Lit detecta mudança e re-renderiza

4. <todo-list> recebe nova prop .todos=${this.filteredTodos}
   │
   └──> <todo-list> re-renderiza com novo <todo-item>
```

### Exemplo: Mudar Tema

```
1. Usuário clica toggle em <theme-toggle>
   │
   └──> new ThemeChangeEvent({ theme: 'dark' })

2. <todo-app> recebe evento
   │
   ├──> Atualiza this.theme = 'dark'
   ├──> Salva em localStorage
   └──> Atualiza CSS Variables no :host
        this.style.setProperty('--primary-color', '#bb86fc')
```

### Exemplo: Filtrar por Projeto

```
1. Usuário seleciona "Trabalho" em <project-selector>
   │
   └──> new ProjectSelectEvent({ projectId: 'work' })

2. <todo-app> atualiza this.selectedProjectId = 'work'
   │
   └──> Recalcula getter filteredTodos:
        - Filtra por projeto
        - Aplica filtro all/active/completed/overdue

3. Re-passa para <todo-list> .todos=${this.filteredTodos}
```

---

## Estratégia de Estado

### Estado Centralizado em `<todo-app>`

```typescript
@customElement('todo-app')
export class TodoApp extends LitElement {
  // Estado de projetos
  @state() private projects: Project[] = [{ id: 'default', name: 'Geral', color: '#3b82f6' }]
  @state() private selectedProjectId: string = 'default'

  // Estado de todos
  @state() private todos: Todo[] = []

  // Estado de filtros
  @state() private filterMode: FilterMode = 'all'

  // Estado de tema
  @state() private theme: Theme = 'light'

  // Getters computados
  get filteredTodos(): Todo[] {
    return this.todos
      .filter(
        (todo) => this.selectedProjectId === 'all' || todo.projectId === this.selectedProjectId
      )
      .filter((todo) => this.applyFilterMode(todo, this.filterMode))
  }

  get activeTodosCount(): number {
    return this.todos.filter((t) => !t.completed).length
  }

  get completedTodosCount(): number {
    return this.todos.filter((t) => t.completed).length
  }

  get overdueTodosCount(): number {
    return this.todos.filter((t) => this.isOverdue(t)).length
  }
}
```

### Persistência

- **LocalStorage** para:

  - `todos` (auto-save em cada mutação)
  - `projects`
  - `theme`
  - `selectedProjectId`

- **Hidratação** no `connectedCallback()`:

```typescript
connectedCallback() {
  super.connectedCallback()
  this.loadStateFromStorage()
  this.setupEventListeners()
}
```

---

## Estratégia de Testes com Shadow DOM Fechado

### Desafios

1. `shadowRoot` não é acessível quando `mode: 'closed'`
2. Não podemos usar `querySelector` direto nos elementos internos
3. Precisamos testar **comportamento público**, não implementação

### Abordagens de Teste

#### 1. **Testar via API Pública**

```typescript
describe('TodoApp - Public API', () => {
  it('should add todo via method', () => {
    const app = document.createElement('todo-app') as TodoApp

    // Método público exposto
    app.addTodo({
      title: 'Test todo',
      projectId: 'default',
      priority: 'medium',
    })

    expect(app.getTodos()).toHaveLength(1)
  })
})
```

#### 2. **Testar via Eventos**

```typescript
describe('TodoApp - Event Handling', () => {
  it('should handle todo:add event', async () => {
    const app = document.createElement('todo-app') as TodoApp
    document.body.appendChild(app)
    await app.updateComplete

    const event = new AddTodoEvent({
      title: 'Test',
      projectId: 'default',
      priority: 'high',
    })

    app.dispatchEvent(event)
    await app.updateComplete

    expect(app.getTodos()).toHaveLength(1)
  })
})
```

#### 3. **Testar via Data Attributes**

```typescript
// No componente
render() {
  return html`
    <div data-todos-count="${this.todos.length}">
      <!-- conteúdo -->
    </div>
  `
}

// No teste
it('should update data attribute on todo add', async () => {
  const app = document.createElement('todo-app') as TodoApp
  document.body.appendChild(app)

  app.addTodo({ title: 'Test' })
  await app.updateComplete

  expect(app.getAttribute('data-todos-count')).toBe('1')
})
```

#### 4. **Testar Componentes Isolados (sem Shadow Closed)**

```typescript
describe('TodoItem - Isolated', () => {
  it('should emit todo:toggle event', async () => {
    const item = document.createElement('todo-item') as TodoItem
    item.todoId = '123'
    item.completed = false

    const spy = jest.fn()
    item.addEventListener('todo:toggle', spy)

    // Simular interação (método público ou propriedade)
    item.toggle()

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { id: '123' },
      })
    )
  })
})
```

#### 5. **Integration Tests via User Simulation**

```typescript
describe('TodoApp - Integration', () => {
  it('should complete full todo lifecycle', async () => {
    const app = document.createElement('todo-app') as TodoApp
    document.body.appendChild(app)
    await app.updateComplete

    // Adicionar
    app.dispatchEvent(new AddTodoEvent({ title: 'Test' }))
    await app.updateComplete
    expect(app.getActiveTodosCount()).toBe(1)

    // Toggle
    const todoId = app.getTodos()[0].id
    app.dispatchEvent(new ToggleTodoEvent({ id: todoId }))
    await app.updateComplete
    expect(app.getActiveTodosCount()).toBe(0)

    // Deletar
    app.dispatchEvent(new DeleteTodoEvent({ id: todoId }))
    await app.updateComplete
    expect(app.getTodos()).toHaveLength(0)
  })
})
```

### Estrutura de Testes

```
tests/
├── unit/
│   ├── components/
│   │   ├── todo-item.test.ts
│   │   ├── todo-form.test.ts
│   │   └── project-selector.test.ts
│   └── utils/
│       ├── date-utils.test.ts
│       └── storage.test.ts
├── integration/
│   ├── todo-lifecycle.test.ts
│   ├── project-management.test.ts
│   └── theme-switching.test.ts
└── e2e/ (opcional, com Playwright/Puppeteer)
    └── full-flow.test.ts
```

### Mínimo de 8 Testes Essenciais

1. ✅ Adicionar todo
2. ✅ Marcar todo como completo
3. ✅ Editar todo
4. ✅ Deletar todo
5. ✅ Filtrar por projeto
6. ✅ Filtrar por status (active/completed/overdue)
7. ✅ Alternar tema e persistir
8. ✅ Exportar/importar dados

---

## Fluxo de Dados (Unidirecional)

```
┌─────────────────────────────────────────────┐
│           <todo-app> (State)                │
│  { todos, projects, theme, filters }        │
└─────────────────┬───────────────────────────┘
                  │ Props ⬇
    ┌─────────────┼─────────────┐
    │             │             │
┌───▼────┐  ┌────▼─────┐  ┌───▼────┐
│ Header │  │   List   │  │ Footer │
│        │  │          │  │        │
│  Props │  │  Props   │  │ Props  │
└───┬────┘  └────┬─────┘  └───┬────┘
    │            │            │
    │ Events ⬆   │ Events ⬆   │ Events ⬆
    └────────────┼────────────┘
                 │
    ┌────────────▼─────────────────┐
    │  addEventListener no root    │
    └──────────────────────────────┘
```

**Props Down**: Estado flui do root para os filhos via propriedades  
**Events Up**: Ações fluem dos filhos para o root via eventos customizados

---

## CSS Variables e Tema

### Definição no Root

```css
:host {
  /* Light theme (default) */
  --primary-color: #3b82f6;
  --bg-color: #ffffff;
  --text-color: #1f2937;
  --border-color: #e5e7eb;

  /* Priority colors */
  --priority-low: #10b981;
  --priority-medium: #f59e0b;
  --priority-high: #ef4444;

  /* Spacing */
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
}

:host([theme='dark']) {
  --primary-color: #bb86fc;
  --bg-color: #1f2937;
  --text-color: #f3f4f6;
  --border-color: #374151;
}
```

### Aplicação Dinâmica

```typescript
@state() private theme: Theme = 'light'

updated(changedProps: PropertyValues) {
  if (changedProps.has('theme')) {
    this.setAttribute('theme', this.theme)
    localStorage.setItem('theme', this.theme)
  }
}
```

---

## Considerações de Performance

1. **Lazy Rendering**: Usar `repeat()` directive com keys para listas
2. **Debounce**: Em filtros e buscas (300ms)
3. **LocalStorage Throttle**: Salvar estado com throttle de 500ms
4. **Virtual Scrolling**: Considerar se lista > 500 itens (fora do escopo MVP)

---

## Extensibilidade

### Novos Componentes

Para adicionar novos componentes:

1. Criar componente isolado em `src/components/`
2. Definir eventos no `EVENT_CONTRACT.md`
3. Registrar listener em `<todo-app>`
4. Passar props necessárias
5. Adicionar testes

### Novos Eventos

1. Criar classe em `src/lib/events.ts`
2. Documentar em `EVENT_CONTRACT.md`
3. Implementar handler no root
4. Testar fluxo completo
