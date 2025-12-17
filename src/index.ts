import { LitElement, html, css } from 'lit'
import { classMap } from 'lit/directives/class-map.js'
import { customElement } from 'lit/decorators/custom-element.js'
import { state } from 'lit/decorators/state.js'

import { todoStyles } from './components/todo/todo.css.js'
import { tokens } from './styles/tokens.css.js'
import { baseStyles } from './styles/base.css.js'
import type { Todo, FilterMode } from './types/index.js'
import { createContainer } from './di/container.js'

import './components/layout/app-header.js'
import './components/todo/todo-list.js'
import './components/todo/todo-form.js'
import './components/todo/todo-footer.js'

import {
  AddTodoEvent,
  RemoveTodoEvent,
  ToggleAllTodoEvent,
  UpdateTodoEvent,
  ClearCompletedEvent,
} from './events/todo-events.js'

import { ThemeChangeEvent } from './events/theme-events.js'

import { updateOnEvent } from './utils/update-on-event.js'

@customElement('todo-app')
export class TodoApp extends LitElement {
  static override styles = [
    tokens,
    baseStyles,
    todoStyles,
    css`
      :host {
        display: block;
        max-width: var(--todo-max-width);
        margin: 96px auto var(--space-6) auto;
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
      .hidden {
        display: none;
      }
      :focus {
        box-shadow: none !important;
      }

      /* Provide a nice page background even when the body is outside our shadow DOM */
      :host {
        background-color: var(--color-surface);
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

  #container = createContainer()

  constructor() {
    super()

    // event handlers for the app
    this.addEventListener(AddTodoEvent.eventName, this.#onAddTodo)
    this.addEventListener(RemoveTodoEvent.eventName, this.#onRemoveTodo)
    this.addEventListener(UpdateTodoEvent.eventName, this.#onUpdateTodo)
    this.addEventListener(ToggleAllTodoEvent.eventName, this.#onToggleAll)
    this.addEventListener(ClearCompletedEvent.eventName, this.#onClearCompleted)

    this.addEventListener(ThemeChangeEvent.eventName, this.#onThemeChange)
  }

  override connectedCallback(): void {
    super.connectedCallback()

    this.#hydrateTodos()

    // Theme bootstrap (temporary: localStorage; will move to infra repo later)
    const stored = window.localStorage.getItem('theme')
    if (stored === 'dark' || stored === 'light') {
      this.theme = stored
    }
    this.dataset.theme = this.theme
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback()
  }

  override render() {
    const filteredTodos = this.#filteredTodos()
    const activeCount = this.todos.filter((t) => !t.completed).length
    const completedCount = this.todos.length - activeCount
    const allCompleted = this.todos.length > 0 && completedCount === this.todos.length

    return html`
      <section>
        <app-header>
          <todo-form></todo-form>
        </app-header>

        <main class="main">
          <todo-list
            class="show-priority"
            .todos=${filteredTodos}
            .allCompleted=${allCompleted}></todo-list>
        </main>

        <todo-footer
          class="${classMap({
            hidden: this.todos.length === 0,
          })}"
          .activeCount=${activeCount}
          .completedCount=${completedCount}
          .filter=${this.filter}></todo-footer>
      </section>
    `
  }

  #onAddTodo(e: AddTodoEvent) {
    void this.#container.todos.addTodo(e.payload).then((todo) => {
      this.todos = [...this.todos, todo]
      this.requestUpdate()
    })
  }

  #onRemoveTodo(e: RemoveTodoEvent) {
    if (e.defaultPrevented) return
    void this.#container.todos.removeTodo(e.payload.id).then(() => {
      this.todos = this.todos.filter((t) => t.id !== e.payload.id)
      this.requestUpdate()
    })
  }

  #onUpdateTodo(e: UpdateTodoEvent) {
    void this.#container.todos.updateTodo(e.payload).then(() => {
      this.todos = this.todos.map((t) =>
        t.id === e.payload.id ? ({ ...t, ...e.payload.changes } as Todo) : t
      )
      this.requestUpdate()
    })
  }

  #onToggleAll(e: ToggleAllTodoEvent) {
    const input = e.payload.completed === undefined ? {} : { completed: e.payload.completed }
    void this.#container.todos.toggleAll(input).then((updated) => {
      this.todos = updated
      this.requestUpdate()
    })
  }

  #onClearCompleted(e: ClearCompletedEvent) {
    if (e.defaultPrevented) return
    void this.#container.todos.clearCompleted().then((updated) => {
      this.todos = updated
      this.requestUpdate()
    })
  }

  #onThemeChange(e: ThemeChangeEvent) {
    this.theme = e.payload.theme
    this.dataset.theme = this.theme
    window.localStorage.setItem('theme', this.theme)
  }

  async #hydrateTodos() {
    const todos = await this.#container.todos.loadTodos()
    this.todos = todos
    this.requestUpdate()
  }

  #filteredTodos(): Todo[] {
    switch (this.filter) {
      case 'active':
        return this.todos.filter((t) => !t.completed)
      case 'completed':
        return this.todos.filter((t) => t.completed)
      default:
        return this.todos
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'todo-app': TodoApp
  }
}
