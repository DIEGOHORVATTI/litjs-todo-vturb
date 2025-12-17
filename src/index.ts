import { LitElement, html, css } from 'lit'
import { classMap } from 'lit/directives/class-map.js'
import { customElement } from 'lit/decorators/custom-element.js'
import { state } from 'lit/decorators/state.js'

import { todoStyles } from './components/todo/todo.css.js'
import { tokens } from './styles/tokens.css.js'
import { baseStyles } from './styles/base.css.js'
import { Todos } from './todos.js'

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
  readonly todoList = new Todos()

  constructor() {
    super()

    // event handlers for the app
    this.addEventListener(AddTodoEvent.eventName, this.#onAddTodo)
    this.addEventListener(RemoveTodoEvent.eventName, this.#onRemoveTodo)
    this.addEventListener(UpdateTodoEvent.eventName, this.#onUpdateTodo)
    this.addEventListener(ToggleAllTodoEvent.eventName, this.#onToggleAll)
    this.addEventListener(ClearCompletedEvent.eventName, this.#onClearCompleted)
  }

  override connectedCallback(): void {
    super.connectedCallback()
    this.todoList.connect()
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback()
    this.todoList.disconnect()
  }

  override render() {
    return html`
      <section>
        <app-header>
          <todo-form></todo-form>
        </app-header>
        <main class="main">
          <todo-list
            class="show-priority"
            .todos=${this.todoList.filtered()}
            .allCompleted=${this.todoList.allCompleted}
          ></todo-list>
        </main>
        <todo-footer
          class="${classMap({
            hidden: this.todoList.all.length === 0,
          })}"
          .activeCount=${this.todoList.active.length}
          .completedCount=${this.todoList.completed.length}
          .filter=${this.todoList.filter ?? 'all'}
        ></todo-footer>
      </section>
    `
  }

  #onAddTodo(e: AddTodoEvent) {
    this.todoList.add(e.payload)
  }

  #onRemoveTodo(e: RemoveTodoEvent) {
    if (e.defaultPrevented) return
    this.todoList.remove(e.payload.id)
  }

  #onUpdateTodo(e: UpdateTodoEvent) {
    this.todoList.update({ id: e.payload.id, ...e.payload.changes })
  }

  #onToggleAll(e: ToggleAllTodoEvent) {
    this.todoList.toggleAll(e.payload.completed)
  }

  #onClearCompleted(e: ClearCompletedEvent) {
    if (e.defaultPrevented) return
    this.todoList.clearCompleted()
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'todo-app': TodoApp
  }
}
