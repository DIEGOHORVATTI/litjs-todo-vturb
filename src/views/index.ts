import { css, html, LitElement } from 'lit'
import { customElement } from 'lit/decorators/custom-element.js'
import { state } from 'lit/decorators/state.js'
import { classMap } from 'lit/directives/class-map.js'

import { todoStyles } from '../components/todo/shared/styles/todo.css.js'
import { ThemeController } from '../controllers/theme-controller.js'
import { TodoController } from '../controllers/todo-controller.js'
import { ThemeModel } from '../models/theme-model.js'
import { TodoModel } from '../models/todo-model.js'
import { createServices } from '../services/create-services.js'
import { CONSTANTS } from '../shared/constants/config.js'
import { baseStyles } from '../styles/base.css.js'
import { tokens } from '../styles/tokens.css.js'
import type { FilterMode, Todo } from '../types/index.js'

import '../components/layout/app-header/index.js'
import '../components/todo/todo-list/index.js'
import '../components/todo/todo-form/index.js'
import '../components/todo/todo-footer/index.js'
import '../components/ui/ui-toggle/index.js'

import { ThemeChangeEvent } from '../events/theme-events.js'
import {
  AddTodoEvent,
  ClearCompletedEvent,
  RemoveTodoEvent,
  ToggleAllTodoEvent,
  UpdateTodoEvent,
} from '../events/todo-events.js'
import { updateOnEvent } from '../utils/update-on-event.js'

@customElement('todo-app')
export class TodoApp extends LitElement {
  static override shadowRootOptions: ShadowRootInit = { mode: 'closed' }

  static override styles = [
    tokens,
    baseStyles,
    todoStyles,
    css`
      :host {
        display: block;
        margin: 96px auto var(--space-6) auto;
        border-radius: var(--radius-lg);
        background: var(--color-bg);
      }

      section {
        width: 600px;
        margin: 0 auto;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-2);
        overflow: hidden;
      }

      main {
        position: relative;
        z-index: 2;
        border-top: 1px solid var(--color-border);
        background: var(--color-surface);
      }

      .theme-row {
        display: flex;
        justify-content: flex-end;
        padding: var(--space-3) var(--space-4);
        border-top: 1px solid var(--color-border);
        background: var(--color-surface);
        border-bottom-left-radius: var(--radius-lg);
        border-bottom-right-radius: var(--radius-lg);
      }

      .hidden {
        display: none;
      }
    `,
  ]

  @updateOnEvent('change')
  @state()
  private todos: Todo[] = []

  @state()
  private filter: FilterMode = 'all'

  @state()
  private theme: 'light' | 'dark' = 'light'

  #services = createServices()
  #todoModel = new TodoModel()
  #themeModel = new ThemeModel()
  #todoController = new TodoController(this.#services, this.#todoModel)
  #themeController = new ThemeController(this.#themeModel)

  constructor() {
    super()

    this.addEventListener(AddTodoEvent.eventName, this.#onAddTodo)
    this.addEventListener(RemoveTodoEvent.eventName, this.#onRemoveTodo)
    this.addEventListener(UpdateTodoEvent.eventName, this.#onUpdateTodo)
    this.addEventListener(ToggleAllTodoEvent.eventName, this.#onToggleAll)
    this.addEventListener(ClearCompletedEvent.eventName, this.#onClearCompleted)

    this.addEventListener('todo-filter:selected', this.#onFilterSelected as EventListener)

    this.addEventListener(ThemeChangeEvent.eventName, this.#onThemeChange)

    this.addEventListener('ui-toggle', this.#onUiThemeToggle as EventListener)
  }

  #onUiThemeToggle(e: Event) {
    const evt = e as CustomEvent<{ checked: boolean; source?: HTMLElement }>
    const path = typeof e.composedPath === 'function' ? e.composedPath() : []
    const toggle = path.find(
      (n): n is HTMLElement => n instanceof HTMLElement && n.tagName.toLowerCase() === 'ui-toggle'
    )

    const source = (toggle ?? evt.detail?.source) as HTMLElement | null

    if (!source) {
      return
    }

    if (source.dataset.action !== 'theme') {
      return
    }

    const checked = evt.detail?.checked
    if (typeof checked !== 'boolean') return
    this.dispatchEvent(new ThemeChangeEvent({ theme: checked ? 'dark' : 'light' }))
  }

  #onHashChange = () => {
    const next = parseFilterFromHash(window.location.hash)
    this.#setFilter(next, { updateHash: false })
  }

  #onFilterSelected(e: Event) {
    const evt = e as CustomEvent<{ filter: FilterMode }>
    const next = evt.detail?.filter ?? 'all'
    this.#setFilter(next, { updateHash: true })
  }

  #setFilter(next: FilterMode, opts: { updateHash: boolean }) {
    this.filter = next
    this.#todoModel.setFilter(next)

    if (opts.updateHash) {
      const desired = `#${next}`

      if (window.location.hash !== desired) {
        window.location.hash = desired
      }
    }

    this.requestUpdate()
  }

  override connectedCallback(): void {
    super.connectedCallback()

    this.#hydrateTodos()

    window.addEventListener('hashchange', this.#onHashChange)
    this.#onHashChange()

    const stored = window.localStorage.getItem(CONSTANTS.LOCAL_STORAGE_KEYS.THEME_KEY)
    if (stored === 'dark' || stored === 'light') {
      this.theme = stored
      this.#themeModel.setTheme(stored)
    }
    this.dataset.theme = this.theme
  }

  override disconnectedCallback(): void {
    window.removeEventListener('hashchange', this.#onHashChange)
    super.disconnectedCallback()
  }

  override render() {
    const filteredTodos = this.#filteredTodos()
    const activeCount = this.todos.filter((t) => !t.completed).length
    const completedCount = this.todos.length - activeCount
    const allCompleted = this.todos.length > 0 && completedCount === this.todos.length

    return html`
      <section>
        <app-header class="hidden"></app-header>

        <main class="main">
          <todo-list class="show-priority" .todos=${filteredTodos} .allCompleted=${allCompleted}>
            <todo-form slot="new-todo"></todo-form>
          </todo-list>
        </main>

        <todo-footer
          class="${classMap({
            hidden: this.todos.length === 0,
          })}"
          .activeCount=${activeCount}
          .completedCount=${completedCount}
          .filter=${this.filter}></todo-footer>

        <div
          class="${classMap({
            hidden: this.todos.length === 0,
            'theme-row': true,
          })}">
          <ui-toggle label="Dark" .checked=${this.theme === 'dark'} data-action="theme"></ui-toggle>
        </div>
      </section>
    `
  }

  #onAddTodo(e: AddTodoEvent) {
    void this.#todoController.addTodo(e.payload).then(() => {
      this.todos = [...this.#todoModel.todos]
      this.requestUpdate()
    })
  }

  #onRemoveTodo(e: RemoveTodoEvent) {
    if (e.defaultPrevented) return
    void this.#todoController.removeTodo(e.payload).then(() => {
      this.todos = [...this.#todoModel.todos]
      this.requestUpdate()
    })
  }

  #onUpdateTodo(e: UpdateTodoEvent) {
    void this.#todoController.updateTodo(e.payload).then(() => {
      this.todos = [...this.#todoModel.todos]
      this.requestUpdate()
    })
  }

  #onToggleAll(e: ToggleAllTodoEvent) {
    void this.#todoController.toggleAll(e.payload).then(() => {
      this.todos = [...this.#todoModel.todos]
      this.requestUpdate()
    })
  }

  #onClearCompleted(e: ClearCompletedEvent) {
    if (e.defaultPrevented) return
    void this.#todoController.clearCompleted().then(() => {
      this.todos = [...this.#todoModel.todos]
      this.requestUpdate()
    })
  }

  #onThemeChange(e: ThemeChangeEvent) {
    this.theme = this.#themeController.setTheme(e.payload.theme)
    this.dataset.theme = this.theme
    window.localStorage.setItem(CONSTANTS.LOCAL_STORAGE_KEYS.THEME_KEY, this.theme)
  }

  async #hydrateTodos() {
    await this.#todoController.hydrate()
    this.todos = [...this.#todoModel.todos]
    this.requestUpdate()
  }

  #filteredTodos(): Todo[] {
    this.#todoModel.setTodos(this.todos)
    this.#todoModel.setFilter(this.filter)
    return this.#todoModel.getFilteredTodos()
  }
}

function parseFilterFromHash(hash: string): FilterMode {
  const raw = (hash ?? '').replace(/^#\/?/, '').trim().toLowerCase()
  if (raw === 'active' || raw === 'completed' || raw === 'all') return raw
  return 'all'
}

declare global {
  interface HTMLElementTagNameMap {
    'todo-app': TodoApp
  }
}
