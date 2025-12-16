# Decisões Arquiteturais - TodoMVC+ com Lit

Este documento registra as principais decisões técnicas tomadas no projeto, suas justificativas e alternativas consideradas.

---

## 1. Por que Lit?

### Decisão

Utilizamos **Lit** como framework base para implementar Web Components.

### Justificativa

1. **Web Standards First**

   - Lit é um wrapper fino sobre Web Components nativos
   - Produz custom elements reais, sem abstração pesada
   - Interoperabilidade: componentes podem ser usados em qualquer framework ou vanilla JS

2. **Developer Experience**

   - Sistema reativo eficiente e simples
   - Templates declarativos com `html` tagged templates
   - TypeScript first-class support
   - Decorators reduzem boilerplate (@customElement, @property, @state)

3. **Performance**

   - Biblioteca pequena (~5KB gzipped)
   - Atualizações granulares via fine-grained reactivity
   - Não re-renderiza todo o componente, apenas partes que mudaram
   - Shadow DOM nativo (encapsulamento de CSS sem custo de runtime)

4. **Manutenibilidade**
   - Código simples e próximo do padrão web
   - Menos "mágica" comparado a frameworks opinativos
   - Facilita onboarding de desenvolvedores que conhecem HTML/CSS/JS

### Alternativas Consideradas

| Alternativa                | Por que rejeitamos                                                                                                   |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Vanilla Web Components** | Muito boilerplate; falta de sistema reativo out-of-the-box; complexidade em gerenciar updates                        |
| **Stencil**                | Mais opinativo; build step obrigatório; menos adoção que Lit                                                         |
| **React**                  | Não produz custom elements reais; Shadow DOM não é primeira classe; bundle maior                                     |
| **Vue**                    | Suporte a Web Components via `@vue/web-component-wrapper` adiciona complexidade; não é o caso de uso primário do Vue |

### Trade-offs Aceitos

- **JSX vs Tagged Templates**: Preferimos `html` templates (mais próximos do padrão), mas sacrificamos type-safety completa dos templates
- **Decorators**: Dependemos de decorators (stage 3 proposal), mas TypeScript tem suporte estável

---

## 2. Por que CustomEvent ao invés de Bindings?

### Decisão

Comunicação entre componentes **exclusivamente via `CustomEvent` + `addEventListener`**, sem usar event bindings do Lit (`@event=${handler}`).

### Justificativa

1. **Separação de Responsabilidades**

   - Componentes filhos não conhecem os handlers do pai
   - Componentes são completamente desacoplados
   - Facilita reuso: componente pode ser usado em contextos diferentes

2. **Testabilidade**

   - Podemos testar componentes isoladamente
   - Mock de eventos é trivial: `dispatchEvent(new CustomEvent(...))`
   - Não precisamos instanciar componentes pais para testar filhos

3. **Alinhamento com Web Standards**

   - `CustomEvent` é API nativa do browser
   - Funciona independente de framework
   - Padrão de comunicação universal (event bubbling, capture, etc.)

4. **Composição Flexível**
   - Múltiplos listeners podem responder ao mesmo evento
   - Eventos podem ser interceptados em qualquer nível da árvore
   - Facilita features como logging, analytics, undo/redo

### Exemplo: Binding vs CustomEvent

**❌ Com Binding (acoplado)**

```typescript
// todo-form.ts
render() {
  return html`
    <input @change=${this.onAddTodo} />
  `
}

onAddTodo() {
  // Precisa conhecer o pai? Como notificar?
  // Acesso direto ao estado do pai? Quebra encapsulamento
}
```

**✅ Com CustomEvent (desacoplado)**

```typescript
// todo-form.ts
render() {
  return html`
    <input @change=${this.#handleChange} />
  `
}

#handleChange(e: Event) {
  const input = e.target as HTMLInputElement
  this.dispatchEvent(new AddTodoEvent({
    title: input.value,
    projectId: this.currentProjectId,
    priority: this.selectedPriority
  }))
}

// todo-app.ts
connectedCallback() {
  super.connectedCallback()
  this.addEventListener('todo:add', this.#onAddTodo)
}

#onAddTodo = (e: AddTodoEvent) => {
  // Handler centralizado
  this.todos = [...this.todos, this.createTodo(e.detail)]
}
```

### Alternativas Consideradas

| Alternativa                   | Por que rejeitamos                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------------------- |
| **Event bindings do Lit**     | Acopla filho ao pai; dificulta reuso; menos explícito                                             |
| **Props com callbacks**       | Não é idiomático em Web Components; quebra encapsulamento; dificulta debugging (call stack opaco) |
| **Store global (Redux-like)** | Overkill para escopo do projeto; adiciona complexidade desnecessária; dificulta testabilidade     |
| **Observables (RxJS)**        | Dependency pesada; curva de aprendizado; não é padrão web                                         |

### Trade-offs Aceitos

- **Verbosidade**: Mais código para definir classes de evento e registrar listeners
- **Type Safety**: Perdemos inferência automática de tipos entre pai/filho (compensado com tipagem explícita de eventos)

---

## 3. Trade-offs do Shadow DOM Fechado

### Decisão

Utilizar **`shadowRootOptions: { mode: 'closed' }`** no componente principal (`<todo-app>`).

### Justificativa

1. **Encapsulamento Real**

   - `shadowRoot` não é exposto em `element.shadowRoot`
   - Força componentes a se comunicarem por API pública (props/methods/events)
   - Previne acesso direto a internals via JavaScript externo

2. **Manutenibilidade**

   - Contrato claro: API pública é explícita
   - Refatorações internas não quebram consumidores
   - Menos superfície de API = menos breaking changes

3. **Segurança**
   - Dificulta manipulação maliciosa de internals
   - Relevante em contextos de terceiros (embeds, plugins)

### Trade-offs Aceitos

#### ❌ **Desvantagens**

1. **Testabilidade Reduzida**

   - Não podemos usar `shadowRoot.querySelector()` nos testes
   - **Solução**: Testar via API pública, eventos e data attributes

   ```typescript
   // ❌ Não funciona com closed
   element.shadowRoot.querySelector('.todo-item')

   // ✅ Alternativas
   element.getTodos() // método público
   element.getAttribute('data-todos-count')
   element.dispatchEvent(new CustomEvent(...))
   ```

2. **DevTools Limitados**

   - Inspeção do Shadow DOM é mais difícil
   - **Solução**: Usar `mode: 'open'` em desenvolvimento, `closed` em produção (via build flag)

   ```typescript
   static shadowRootOptions = {
     mode: (import.meta.env.DEV ? 'open' : 'closed') as 'closed'
   }
   ```

3. **Sem Acesso a Internals**
   - Impossível fazer "quick fixes" ou integrações via DOM externo
   - **Solução**: Expor APIs públicas suficientes desde o início

### Por que NÃO usar closed em todos os componentes?

Usamos `closed` **apenas no root** (`<todo-app>`):

- **Componentes internos** (`<todo-item>`, `<todo-form>`, etc.) usam `open`:
  - Facilita testes unitários
  - Permite composição mais flexível
  - Ainda estão encapsulados dentro do Shadow DOM do root

### Alternativas Consideradas

| Alternativa          | Por que rejeitamos (para o root)                                                                     |
| -------------------- | ---------------------------------------------------------------------------------------------------- |
| **Shadow DOM open**  | Perde encapsulamento; permite acesso externo fácil; não demonstra capacidade de trabalhar com closed |
| **Sem Shadow DOM**   | Sem encapsulamento de CSS; colisão de estilos global; não é objetivo do desafio                      |
| **Conditional mode** | Complexidade desnecessária para MVP; pode ser adicionado depois                                      |

---

## 4. Estado Centralizado no Root

### Decisão

Todo o estado da aplicação vive no componente raiz (`<todo-app>`). Componentes filhos são **stateless** (exceto UI state local, como "isEditing").

### Justificativa

1. **Single Source of Truth**

   - Estado não fica espalhado por múltiplos componentes
   - Facilita debugging: um único lugar para inspecionar
   - Evita sincronização entre componentes

2. **Previsibilidade**

   - Fluxo unidirecional: props down, events up
   - Mudanças de estado são explícitas (via event handlers)
   - Facilita reasoning sobre o comportamento da app

3. **Persistência Simplificada**

   - Um único ponto para salvar/carregar estado do localStorage
   - Não precisamos sincronizar múltiplos stores

4. **Testabilidade**
   - Estado pode ser mockado facilmente
   - Componentes filhos são pure functions (dado props, render consistente)

### Estrutura de Estado

```typescript
interface AppState {
  // Dados
  todos: Todo[]
  projects: Project[]

  // Filtros
  selectedProjectId: string
  filterMode: FilterMode

  // UI
  theme: Theme

  // Computados (getters)
  filteredTodos: Todo[]
  activeTodosCount: number
  completedTodosCount: number
  overdueTodosCount: number
}
```

### Alternativas Consideradas

| Alternativa                         | Por que rejeitamos                                                 |
| ----------------------------------- | ------------------------------------------------------------------ |
| **Estado distribuído**              | Dificulta sincronização; complexidade desnecessária para o escopo  |
| **Redux/MobX**                      | Overkill; adiciona dependencies; Lit já tem reatividade suficiente |
| **Context API (Lit)**               | Não estável (ainda em development); adiciona complexidade          |
| **Web Components Context Protocol** | Spec não finalizada; pouca adoção; overkill para escopo            |

### Trade-offs Aceitos

- **Prop drilling**: Precisamos passar props por múltiplos níveis
  - **Aceitável**: Hierarquia não é profunda (max 3 níveis)
  - **Alternativa futura**: Considerar Context se hierarquia crescer

---

## 5. LocalStorage para Persistência

### Decisão

Usar **`localStorage`** para persistir `todos`, `projects`, `theme` e `selectedProjectId`.

### Justificativa

1. **Simplicidade**

   - API síncrona e simples
   - Não requer setup de backend
   - Suficiente para MVP

2. **Disponibilidade**

   - Suportado em todos os browsers modernos
   - ~5-10MB de capacidade (suficiente para centenas de todos)

3. **Protótipo Rápido**
   - Permite testar features sem infraestrutura
   - Pode ser substituído por backend depois

### Implementação

```typescript
// Salvar (com throttle)
private saveStateDebounced = debounce(() => {
  localStorage.setItem('todos', JSON.stringify(this.todos))
  localStorage.setItem('projects', JSON.stringify(this.projects))
}, 500)

// Carregar
private loadStateFromStorage() {
  try {
    const todosJson = localStorage.getItem('todos')
    this.todos = todosJson ? JSON.parse(todosJson) : []

    const projectsJson = localStorage.getItem('projects')
    this.projects = projectsJson ? JSON.parse(projectsJson) : this.getDefaultProjects()

    this.theme = (localStorage.getItem('theme') as Theme) ?? 'light'
    this.selectedProjectId = localStorage.getItem('selectedProjectId') ?? 'default'
  } catch (error) {
    console.error('Failed to load state:', error)
    // Fallback to defaults
  }
}
```

### Alternativas Consideradas

| Alternativa                     | Por que rejeitamos                                        |
| ------------------------------- | --------------------------------------------------------- |
| **IndexedDB**                   | API assíncrona mais complexa; overkill para dados simples |
| **SessionStorage**              | Perde dados ao fechar aba; UX ruim                        |
| **Backend (Firebase/Supabase)** | Fora do escopo; requer autenticação; adiciona latência    |
| **File System API**             | Suporte limitado; requer permissões; UX complexa          |

### Trade-offs Aceitos

- **Sem sincronização entre abas**: Mudanças em uma aba não refletem em outras
  - **Solução futura**: Usar `storage` event listener
- **Sem versionamento**: Mudanças de schema podem quebrar dados antigos
  - **Solução**: Validação + migração no `loadStateFromStorage`

---

## 6. Export/Import via JSON

### Decisão

Implementar export/import do estado completo via **JSON download/upload**.

### Justificativa

1. **Portabilidade**

   - Usuário pode fazer backup manual
   - Transferir dados entre dispositivos
   - Compartilhar listas com outros

2. **Simplicidade**

   - JSON é formato universal
   - Não requer servidor
   - Fácil de implementar e testar

3. **Transparência**
   - Usuário pode inspecionar/editar JSON manualmente
   - Debugging facilitado

### Implementação

```typescript
exportData() {
  const state = {
    version: '1.0',
    todos: this.todos,
    projects: this.projects,
    exportedAt: new Date().toISOString()
  }

  const json = JSON.stringify(state, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `todos-${Date.now()}.json`
  a.click()

  URL.revokeObjectURL(url)
}

importData(json: string) {
  try {
    const state = JSON.parse(json)

    // Validação básica
    if (!state.version || !Array.isArray(state.todos)) {
      throw new Error('Invalid format')
    }

    // Merge ou replace?
    if (confirm('Replace current data?')) {
      this.todos = state.todos
      this.projects = state.projects ?? this.projects
      this.saveStateDebounced()
    }
  } catch (error) {
    alert('Invalid JSON file')
  }
}
```

### Alternativas Consideradas

| Alternativa                   | Por que rejeitamos                                           |
| ----------------------------- | ------------------------------------------------------------ |
| **CSV**                       | Perde estrutura hierárquica (projetos, metadata); menos rico |
| **Cloud sync (Google Drive)** | Requer autenticação; fora do escopo; complexidade            |
| **Copy to clipboard**         | OK como feature adicional, mas não substitui download        |

---

## 7. Filtros: All, Active, Completed, Overdue

### Decisão

Implementar **4 filtros principais** com lógica no root component.

### Justificativa

1. **Overdue é Feature Nova**

   - Diferencial do TodoMVC+
   - Demonstra capacidade de estender lógica
   - Use case real: gerenciamento de prazos

2. **Lógica Centralizada**
   - Filtros são computados no `<todo-app>`
   - `<todo-list>` recebe apenas lista filtrada
   - Facilita adicionar novos filtros

### Implementação

```typescript
get filteredTodos(): Todo[] {
  let result = this.todos

  // Filtrar por projeto
  if (this.selectedProjectId !== 'all') {
    result = result.filter(t => t.projectId === this.selectedProjectId)
  }

  // Aplicar filtro de status
  switch (this.filterMode) {
    case 'active':
      result = result.filter(t => !t.completed)
      break
    case 'completed':
      result = result.filter(t => t.completed)
      break
    case 'overdue':
      result = result.filter(t =>
        !t.completed &&
        t.dueDate &&
        new Date(t.dueDate) < new Date()
      )
      break
  }

  return result
}
```

---

## 8. Prioridade e Due Date

### Decisão

Adicionar **`priority: 'low' | 'medium' | 'high'`** e **`dueDate?: string`** ao modelo de Todo.

### Justificativa

1. **Features Solicitadas**

   - Parte explícita dos requisitos
   - Diferencia de TodoMVC vanilla

2. **UX Value**

   - Prioridade: visual feedback (badges coloridos)
   - Due date: gerenciamento de prazos real

3. **Extensibilidade**
   - Facilita adicionar ordenação (sort by priority/date)
   - Base para notificações futuras

### Modelo

```typescript
interface Todo {
  id: string
  title: string
  completed: boolean
  projectId: string
  priority: 'low' | 'medium' | 'high'
  dueDate?: string // ISO 8601 date string
  createdAt: string
  updatedAt: string
}
```

---

## 9. CSS Variables para Tema

### Decisão

Usar **CSS Custom Properties** para todo o design system.

### Justificativa

1. **Requisito Explícito**

   - Demonstra conhecimento de CSS moderno
   - Permite theme switching dinâmico

2. **Performance**

   - Mudança de tema via CSS é instantânea (sem re-render)
   - Browser otimiza repaint

3. **Manutenibilidade**
   - Valores centralizados
   - Facilita consistência visual
   - Fácil adicionar novos temas

### Implementação

```css
:host {
  /* Design tokens */
  --color-primary: #3b82f6;
  --color-bg: #ffffff;
  --color-text: #1f2937;

  --priority-low: #10b981;
  --priority-medium: #f59e0b;
  --priority-high: #ef4444;

  --spacing-unit: 0.25rem;
}

:host([theme='dark']) {
  --color-primary: #bb86fc;
  --color-bg: #1f2937;
  --color-text: #f3f4f6;
}

/* Uso */
.todo-item {
  background: var(--color-bg);
  color: var(--color-text);
  padding: calc(var(--spacing-unit) * 4);
}
```

---

## 10. Testes com Jest

### Decisão

Usar **Jest** com **`@web/test-runner`** para ambiente de testes.

### Justificativa

1. **Jest = Padrão da Indústria**

   - Familiaridade
   - Ecossistema maduro
   - Boas mensagens de erro

2. **@web/test-runner**
   - Testa em browser real (chromium)
   - Suporte nativo a Web Components
   - ESM support

### Configuração

```javascript
// jest.config.js
export default {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/test-setup.ts'],
}
```

### Alternativas Consideradas

| Alternativa                      | Por que rejeitamos                                  |
| -------------------------------- | --------------------------------------------------- |
| **Vitest**                       | Menos maduro que Jest; menos recursos da comunidade |
| **Web Test Runner only**         | Sintaxe diferente (Chai); menos familiar            |
| **Playwright Component Testing** | Overkill para unit tests; melhor para E2E           |

---

## Resumo de Trade-offs

| Decisão             | Vantagem               | Desvantagem               | Aceitamos porque                                            |
| ------------------- | ---------------------- | ------------------------- | ----------------------------------------------------------- |
| Lit                 | Leve, web standards    | Menos ecosystem que React | Objetivo é Web Components puros                             |
| CustomEvent only    | Desacoplamento total   | Mais verboso              | Testabilidade e reuso compensam                             |
| Shadow DOM closed   | Encapsulamento real    | Testes mais difíceis      | Demonstra expertise; testes via API pública são suficientes |
| Estado centralizado | Single source of truth | Prop drilling             | Hierarquia é rasa                                           |
| localStorage        | Simples, sem backend   | Sem sync entre abas       | Suficiente para MVP                                         |
