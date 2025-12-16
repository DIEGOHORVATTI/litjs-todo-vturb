# Contrato de Eventos - TodoMVC+ com Lit

Este documento define **formalmente todos os eventos customizados** usados na aplicação, seus payloads, propriedades de propagação e contratos de uso.

---

## Índice

1. [Eventos de Todo](#eventos-de-todo)
2. [Eventos de Projeto](#eventos-de-projeto)
3. [Eventos de Filtro](#eventos-de-filtro)
4. [Eventos de Tema](#eventos-de-tema)
5. [Eventos de Dados](#eventos-de-dados)
6. [Convenções](#convenções)
7. [Implementação de Referência](#implementação-de-referência)

---

## Eventos de Todo

### `todo:add`

**Descrição**: Solicitação para adicionar um novo todo.

**Emissor**: `<todo-form>`

**Receptor**: `<todo-app>`

**Payload**:

```typescript
interface AddTodoPayload {
  title: string
  projectId: string
  priority: 'low' | 'medium' | 'high'
  dueDate?: string // ISO 8601 date string (YYYY-MM-DD)
}
```

**Propriedades**:

- `bubbles`: `true`
- `composed`: `true`
- `cancelable`: `false`

**Validações**:

- `title` não pode ser vazio
- `projectId` deve existir na lista de projetos
- `dueDate`, se fornecido, deve ser uma data válida

**Exemplo**:

```typescript
this.dispatchEvent(
  new AddTodoEvent({
    title: 'Implementar feature X',
    projectId: 'work',
    priority: 'high',
    dueDate: '2025-12-25',
  })
)
```

---

### `todo:toggle`

**Descrição**: Alternar estado de conclusão de um todo.

**Emissor**: `<todo-item>`

**Receptor**: `<todo-app>`

**Payload**:

```typescript
interface ToggleTodoPayload {
  id: string
}
```

**Propriedades**:

- `bubbles`: `true`
- `composed`: `true`
- `cancelable`: `false`

**Validações**:

- `id` deve corresponder a um todo existente

**Exemplo**:

```typescript
this.dispatchEvent(
  new ToggleTodoEvent({
    id: 'todo-123',
  })
)
```

---

### `todo:update`

**Descrição**: Atualizar propriedades de um todo existente.

**Emissor**: `<todo-item>`

**Receptor**: `<todo-app>`

**Payload**:

```typescript
interface UpdateTodoPayload {
  id: string
  changes: {
    title?: string
    priority?: 'low' | 'medium' | 'high'
    dueDate?: string
    projectId?: string
  }
}
```

**Propriedades**:

- `bubbles`: `true`
- `composed`: `true`
- `cancelable`: `false`

**Validações**:

- `id` deve existir
- `changes` deve conter pelo menos uma propriedade
- `title`, se fornecido, não pode ser vazio

**Exemplo**:

```typescript
this.dispatchEvent(
  new UpdateTodoEvent({
    id: 'todo-123',
    changes: {
      title: 'Novo título',
      priority: 'low',
    },
  })
)
```

---

### `todo:remove`

**Descrição**: Remover um todo.

**Emissor**: `<todo-item>`

**Receptor**: `<todo-app>`

**Payload**:

```typescript
interface RemoveTodoPayload {
  id: string
}
```

**Propriedades**:

- `bubbles`: `true`
- `composed`: `true`
- `cancelable`: `true` ⚠️

**Validações**:

- `id` deve corresponder a um todo existente

**Comportamento especial**:

- Evento pode ser cancelado (ex.: modal de confirmação)
- Se `event.defaultPrevented === true`, não executar remoção

**Exemplo**:

```typescript
this.dispatchEvent(
  new RemoveTodoEvent({
    id: 'todo-123',
  })
)
```

---

### `todo:toggle-all`

**Descrição**: Alternar conclusão de todos os todos visíveis.

**Emissor**: `<todo-filters>` ou `<todo-list>`

**Receptor**: `<todo-app>`

**Payload**:

```typescript
interface ToggleAllTodoPayload {
  completed?: boolean // Se omitido, inverte estado atual
}
```

**Propriedades**:

- `bubbles`: `true`
- `composed`: `true`
- `cancelable`: `false`

**Comportamento**:

- Se `completed` não fornecido: inverte baseado no estado atual
- Se todos ativos: marca todos como completos
- Se todos completos: marca todos como ativos

**Exemplo**:

```typescript
this.dispatchEvent(
  new ToggleAllTodoEvent({
    completed: true, // Marcar todos como completos
  })
)
```

---

### `todo:clear-completed`

**Descrição**: Remover todos os todos marcados como completos.

**Emissor**: `<todo-footer>`

**Receptor**: `<todo-app>`

**Payload**: _Nenhum_

**Propriedades**:

- `bubbles`: `true`
- `composed`: `true`
- `cancelable`: `true` ⚠️

**Comportamento especial**:

- Pode ser cancelado (ex.: confirmação)

**Exemplo**:

```typescript
this.dispatchEvent(new ClearCompletedEvent())
```

---

## Eventos de Projeto

### `project:add`

**Descrição**: Criar um novo projeto.

**Emissor**: `<project-form>` ou `<project-selector>`

**Receptor**: `<todo-app>`

**Payload**:

```typescript
interface AddProjectPayload {
  name: string
  color?: string // Hex color (ex.: '#3b82f6')
  icon?: string // Emoji ou nome de ícone
}
```

**Propriedades**:

- `bubbles`: `true`
- `composed`: `true`
- `cancelable`: `false`

**Validações**:

- `name` não pode ser vazio
- `name` deve ser único
- `color`, se fornecido, deve ser um hex válido

**Exemplo**:

```typescript
this.dispatchEvent(
  new AddProjectEvent({
    name: 'Trabalho',
    color: '#ef4444',
    icon: '💼',
  })
)
```

---

### `project:select`

**Descrição**: Selecionar um projeto para filtrar todos.

**Emissor**: `<project-selector>`

**Receptor**: `<todo-app>`

**Payload**:

```typescript
interface SelectProjectPayload {
  projectId: string // 'all' para exibir todos os projetos
}
```

**Propriedades**:

- `bubbles`: `true`
- `composed`: `true`
- `cancelable`: `false`

**Validações**:

- `projectId` deve ser 'all' ou corresponder a um projeto existente

**Exemplo**:

```typescript
this.dispatchEvent(
  new SelectProjectEvent({
    projectId: 'work',
  })
)
```

---

### `project:update`

**Descrição**: Atualizar propriedades de um projeto.

**Emissor**: `<project-settings>` ou `<project-selector>`

**Receptor**: `<todo-app>`

**Payload**:

```typescript
interface UpdateProjectPayload {
  id: string
  changes: {
    name?: string
    color?: string
    icon?: string
  }
}
```

**Propriedades**:

- `bubbles`: `true`
- `composed`: `true`
- `cancelable`: `false`

**Validações**:

- `id` deve existir
- `name`, se fornecido, deve ser único

**Exemplo**:

```typescript
this.dispatchEvent(
  new UpdateProjectEvent({
    id: 'work',
    changes: {
      name: 'Trabalho Remoto',
      color: '#10b981',
    },
  })
)
```

---

### `project:remove`

**Descrição**: Remover um projeto.

**Emissor**: `<project-settings>`

**Receptor**: `<todo-app>`

**Payload**:

```typescript
interface RemoveProjectPayload {
  id: string
  moveTodosTo?: string // ID do projeto para mover os todos
}
```

**Propriedades**:

- `bubbles`: `true`
- `composed`: `true`
- `cancelable`: `true` ⚠️

**Comportamento especial**:

- Se projeto tem todos: requer `moveTodosTo` ou confirmação de exclusão
- Não pode remover projeto 'default'

**Exemplo**:

```typescript
this.dispatchEvent(
  new RemoveProjectEvent({
    id: 'old-project',
    moveTodosTo: 'default',
  })
)
```

---

## Eventos de Filtro

### `filter:change`

**Descrição**: Alterar modo de filtro de todos.

**Emissor**: `<todo-filters>`

**Receptor**: `<todo-app>`

**Payload**:

```typescript
interface ChangeFilterPayload {
  mode: 'all' | 'active' | 'completed' | 'overdue'
}
```

**Propriedades**:

- `bubbles`: `true`
- `composed`: `true`
- `cancelable`: `false`

**Comportamento**:

- Atualiza URL hash: `#/active`, `#/completed`, etc.
- Persiste no localStorage

**Exemplo**:

```typescript
this.dispatchEvent(
  new ChangeFilterEvent({
    mode: 'overdue',
  })
)
```

---

## Eventos de Tema

### `theme:change`

**Descrição**: Alternar tema da aplicação.

**Emissor**: `<theme-toggle>`

**Receptor**: `<todo-app>`

**Payload**:

```typescript
interface ChangeThemePayload {
  theme: 'light' | 'dark' | 'auto'
}
```

**Propriedades**:

- `bubbles`: `true`
- `composed`: `true`
- `cancelable`: `false`

**Comportamento**:

- Atualiza CSS variables no root
- Persiste no localStorage
- Se 'auto': respeita `prefers-color-scheme`

**Exemplo**:

```typescript
this.dispatchEvent(
  new ChangeThemeEvent({
    theme: 'dark',
  })
)
```

---

## Eventos de Dados

### `data:export`

**Descrição**: Solicitar exportação de dados.

**Emissor**: `<todo-footer>` ou `<data-actions>`

**Receptor**: `<todo-app>`

**Payload**:

```typescript
interface ExportDataPayload {
  format: 'json' | 'csv' // Extensível para outros formatos
  includeCompleted?: boolean // Default: true
}
```

**Propriedades**:

- `bubbles`: `true`
- `composed`: `true`
- `cancelable`: `false`

**Comportamento**:

- Gera arquivo de download
- Inclui timestamp no nome do arquivo

**Exemplo**:

```typescript
this.dispatchEvent(
  new ExportDataEvent({
    format: 'json',
    includeCompleted: false,
  })
)
```

---

### `data:import`

**Descrição**: Importar dados de arquivo.

**Emissor**: `<data-actions>`

**Receptor**: `<todo-app>`

**Payload**:

```typescript
interface ImportDataPayload {
  data: string // JSON string
  merge: boolean // true = merge, false = replace
}
```

**Propriedades**:

- `bubbles`: `true`
- `composed`: `true`
- `cancelable`: `true` ⚠️

**Validações**:

- `data` deve ser JSON válido
- Schema deve ser compatível com versão atual

**Comportamento especial**:

- Se `merge === false`: solicita confirmação antes de substituir
- Se erro de validação: dispara `data:import-error`

**Exemplo**:

```typescript
this.dispatchEvent(
  new ImportDataEvent({
    data: '{"version":"1.0","todos":[...]}',
    merge: true,
  })
)
```

---

### `data:import-error`

**Descrição**: Erro durante importação de dados.

**Emissor**: `<todo-app>`

**Receptor**: `<data-actions>` ou qualquer listener

**Payload**:

```typescript
interface ImportDataErrorPayload {
  error: string // Mensagem de erro
  details?: unknown // Dados adicionais para debugging
}
```

**Propriedades**:

- `bubbles`: `true`
- `composed`: `true`
- `cancelable`: `false`

**Exemplo**:

```typescript
this.dispatchEvent(
  new ImportDataErrorEvent({
    error: 'Invalid JSON format',
    details: { line: 42, column: 15 },
  })
)
```

---

## Convenções

### Nomenclatura

1. **Event names**: Usar namespaces com `:` (ex.: `todo:add`, `project:select`)
2. **Event classes**: PascalCase + `Event` suffix (ex.: `AddTodoEvent`)
3. **Event constants**: `static readonly eventName`

### Propagação

| Propriedade  | Valor Padrão | Quando alterar                              |
| ------------ | ------------ | ------------------------------------------- |
| `bubbles`    | `true`       | Sempre `true` para atravessar árvore        |
| `composed`   | `true`       | Sempre `true` para atravessar Shadow DOM    |
| `cancelable` | `false`      | `true` apenas se handler pode prevenir ação |

### Payload vs Detail

- **Payload**: Interface TypeScript (type-safe)
- **Detail**: Propriedade do `CustomEvent` (runtime)

```typescript
class AddTodoEvent extends CustomEvent<AddTodoPayload> {
  constructor(payload: AddTodoPayload) {
    super('todo:add', {
      detail: payload,
      bubbles: true,
      composed: true,
    })
  }
}
```

### Tratamento de Erros

Eventos **não devem lançar exceções**. Em caso de erro:

1. Validar payload antes de disparar
2. Ou disparar evento de erro separado (ex.: `todo:add-error`)

---

## Implementação de Referência

### Classe Base de Evento

```typescript
// src/lib/events/base.ts
export abstract class AppEvent<T = unknown> extends CustomEvent<T> {
  constructor(
    type: string,
    detail: T,
    options?: {
      bubbles?: boolean
      composed?: boolean
      cancelable?: boolean
    }
  ) {
    super(type, {
      detail,
      bubbles: options?.bubbles ?? true,
      composed: options?.composed ?? true,
      cancelable: options?.cancelable ?? false,
    })
  }
}
```

### Exemplo de Evento Concreto

```typescript
// src/lib/events/todo-events.ts
import { AppEvent } from './base.js'

export interface AddTodoPayload {
  title: string
  projectId: string
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
}

export class AddTodoEvent extends AppEvent<AddTodoPayload> {
  static readonly eventName = 'todo:add' as const

  constructor(payload: AddTodoPayload) {
    super(AddTodoEvent.eventName, payload)
  }

  // Getter conveniente para acessar payload
  get payload(): AddTodoPayload {
    return this.detail
  }
}

// Type augmentation para autocompletar
declare global {
  interface HTMLElementEventMap {
    'todo:add': AddTodoEvent
  }
}
```

### Registro de Listener (Root Component)

```typescript
// src/lib/todo-app.ts
import { AddTodoEvent, RemoveTodoEvent, UpdateTodoEvent } from './events/todo-events.js'

@customElement('todo-app')
export class TodoApp extends LitElement {
  connectedCallback() {
    super.connectedCallback()
    this.setupEventListeners()
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListeners()
  }

  private setupEventListeners() {
    // Type-safe listeners
    this.addEventListener(AddTodoEvent.eventName, this.#handleAddTodo)
    this.addEventListener(RemoveTodoEvent.eventName, this.#handleRemoveTodo)
    this.addEventListener(UpdateTodoEvent.eventName, this.#handleUpdateTodo)
  }

  private removeEventListeners() {
    this.removeEventListener(AddTodoEvent.eventName, this.#handleAddTodo)
    this.removeEventListener(RemoveTodoEvent.eventName, this.#handleRemoveTodo)
    this.removeEventListener(UpdateTodoEvent.eventName, this.#handleUpdateTodo)
  }

  #handleAddTodo = (event: AddTodoEvent) => {
    const { title, projectId, priority, dueDate } = event.payload

    // Validação
    if (!title.trim()) {
      console.warn('Cannot add todo with empty title')
      return
    }

    // Lógica
    const newTodo: Todo = {
      id: nanoid(),
      title,
      projectId,
      priority,
      dueDate,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    this.todos = [...this.todos, newTodo]
    this.saveToStorage()
  }

  #handleRemoveTodo = (event: RemoveTodoEvent) => {
    // Evento cancelável: pode pedir confirmação
    if (!event.cancelable || confirm('Delete this todo?')) {
      this.todos = this.todos.filter((t) => t.id !== event.payload.id)
      this.saveToStorage()
    }
  }

  #handleUpdateTodo = (event: UpdateTodoEvent) => {
    const { id, changes } = event.payload
    const index = this.todos.findIndex((t) => t.id === id)

    if (index === -1) return

    this.todos[index] = {
      ...this.todos[index],
      ...changes,
      updatedAt: new Date().toISOString(),
    }

    // Trigger re-render
    this.todos = [...this.todos]
    this.saveToStorage()
  }
}
```

### Emissão de Evento (Child Component)

```typescript
// src/lib/components/todo-form.ts
import { AddTodoEvent } from '../events/todo-events.js'

@customElement('todo-form')
export class TodoForm extends LitElement {
  @property() currentProjectId = 'default'
  @property() defaultPriority: 'low' | 'medium' | 'high' = 'medium'

  #handleSubmit(e: Event) {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const title = formData.get('title') as string
    const priority = formData.get('priority') as 'low' | 'medium' | 'high'
    const dueDate = formData.get('dueDate') as string

    // Validação local
    if (!title.trim()) {
      this.showError('Title is required')
      return
    }

    // Disparar evento
    this.dispatchEvent(
      new AddTodoEvent({
        title: title.trim(),
        projectId: this.currentProjectId,
        priority: priority || this.defaultPriority,
        dueDate: dueDate || undefined,
      })
    )

    // Reset form
    form.reset()
  }

  render() {
    return html`
      <form @submit=${this.#handleSubmit}>
        <input name="title" placeholder="What needs to be done?" required />
        <select name="priority">
          <option value="low">Low</option>
          <option value="medium" selected>Medium</option>
          <option value="high">High</option>
        </select>
        <input name="dueDate" type="date" />
        <button type="submit">Add</button>
      </form>
    `
  }
}
```

---

## Testing Event Contracts

```typescript
// tests/events/todo-events.test.ts
import { AddTodoEvent } from '../../src/lib/events/todo-events.js'

describe('AddTodoEvent', () => {
  it('should have correct event name', () => {
    const event = new AddTodoEvent({
      title: 'Test',
      projectId: 'default',
      priority: 'medium',
    })

    expect(event.type).toBe('todo:add')
  })

  it('should have correct payload', () => {
    const payload = {
      title: 'Buy milk',
      projectId: 'personal',
      priority: 'high' as const,
      dueDate: '2025-12-25',
    }

    const event = new AddTodoEvent(payload)

    expect(event.payload).toEqual(payload)
    expect(event.detail).toEqual(payload)
  })

  it('should bubble and be composed', () => {
    const event = new AddTodoEvent({
      title: 'Test',
      projectId: 'default',
      priority: 'medium',
    })

    expect(event.bubbles).toBe(true)
    expect(event.composed).toBe(true)
  })

  it('should not be cancelable by default', () => {
    const event = new AddTodoEvent({
      title: 'Test',
      projectId: 'default',
      priority: 'medium',
    })

    expect(event.cancelable).toBe(false)
  })
})
```

---

## Diagrama de Fluxo de Eventos

```
┌─────────────────────────────────────────────────────────────┐
│                         User Action                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Child Component (ex: <todo-form>)              │
│  • Valida input                                              │
│  • Cria evento: new AddTodoEvent(payload)                   │
│  • Dispara: this.dispatchEvent(event)                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ bubbles: true, composed: true
                         │ (Atravessa Shadow DOM)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              <todo-app> (Root Component)                    │
│  • Captura: addEventListener('todo:add', handler)           │
│  • Valida payload                                            │
│  • Atualiza estado: this.todos = [...]                      │
│  • Persiste: localStorage.setItem(...)                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Lit Reactive Update
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Re-render (Unidirectional Flow)                │
│  • Recalcula: filteredTodos                                  │
│  • Passa props: <todo-list .todos=${filteredTodos}>         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                     UI Updates                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Resumo de Todos os Eventos

| Evento                 | Emissor              | Receptor         | Cancelável |
| ---------------------- | -------------------- | ---------------- | ---------- |
| `todo:add`             | `<todo-form>`        | `<todo-app>`     | ❌         |
| `todo:toggle`          | `<todo-item>`        | `<todo-app>`     | ❌         |
| `todo:update`          | `<todo-item>`        | `<todo-app>`     | ❌         |
| `todo:remove`          | `<todo-item>`        | `<todo-app>`     | ✅         |
| `todo:toggle-all`      | `<todo-filters>`     | `<todo-app>`     | ❌         |
| `todo:clear-completed` | `<todo-footer>`      | `<todo-app>`     | ✅         |
| `project:add`          | `<project-selector>` | `<todo-app>`     | ❌         |
| `project:select`       | `<project-selector>` | `<todo-app>`     | ❌         |
| `project:update`       | `<project-settings>` | `<todo-app>`     | ❌         |
| `project:remove`       | `<project-settings>` | `<todo-app>`     | ✅         |
| `filter:change`        | `<todo-filters>`     | `<todo-app>`     | ❌         |
| `theme:change`         | `<theme-toggle>`     | `<todo-app>`     | ❌         |
| `data:export`          | `<data-actions>`     | `<todo-app>`     | ❌         |
| `data:import`          | `<data-actions>`     | `<todo-app>`     | ✅         |
| `data:import-error`    | `<todo-app>`         | `<data-actions>` | ❌         |

---

## Versionamento do Contrato

**Versão atual**: `1.0.0`

### Breaking Changes

Mudanças que quebram o contrato:

- Renomear evento
- Remover propriedade obrigatória do payload
- Mudar tipo de propriedade

### Non-Breaking Changes

Mudanças compatíveis:

- Adicionar novo evento
- Adicionar propriedade opcional ao payload
- Adicionar evento de erro relacionado

### Compatibilidade

- Eventos devem ser **backward compatible** por pelo menos 1 major version
- Deprecations devem ser anunciadas via console.warn()
- Payload deve incluir `version` field para versionamento explícito

```typescript
interface AddTodoPayload {
  version: '1.0' // Para tracking e migrations
  title: string
  projectId: string
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
}
```
