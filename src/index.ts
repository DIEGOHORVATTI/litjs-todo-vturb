import { LitElement, html, css } from 'lit'
import { classMap } from 'lit/directives/class-map.js'
import { customElement } from 'lit/decorators/custom-element.js'
import { state } from 'lit/decorators/state.js'

import { todoStyles } from './components/todo/todo.css.js'
import { Todos } from './todos.js'

import './components/layout/app-header.js'
import './components/todo/todo-list.js'
import './components/todo/todo-form.js'
import './components/todo/todo-footer.js'

import {
  AddTodoEvent,
  DeleteTodoEvent,
  ToggleAllTodoEvent,
  EditTodoEvent,
  ClearCompletedEvent,
} from './events/todo-events.js'

import { updateOnEvent } from './utils/update-on-event.js'

@customElement('todo-app')
export class TodoApp extends LitElement {
  static override styles = [
    todoStyles,
    css`
      :host {
        display: block;
        background: #fff;
        margin: 130px 0 40px 0;
        position: relative;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);
      }
      main {
        position: relative;
        z-index: 2;
        border-top: 1px solid #e6e6e6;
      }
      .hidden {
        display: none;
      }
      :focus {
        box-shadow: none !important;
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
    this.addEventListener(DeleteTodoEvent.eventName, this.#onDeleteTodo)
    this.addEventListener(EditTodoEvent.eventName, this.#onEditTodo)
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
          .filter=${this.todoList.filter}
        ></todo-footer>
      </section>
    `
  }

  #onAddTodo(e: AddTodoEvent) {
    this.todoList.add(e.payload)
  }

  #onDeleteTodo(e: DeleteTodoEvent) {
    this.todoList.remove(e.id)
  }

  #onEditTodo(e: EditTodoEvent) {
    this.todoList.update(e.edit)
  }

  #onToggleAll() {
    this.todoList.toggleAll()
  }

  #onClearCompleted() {
    this.todoList.clearCompleted()
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'todo-app': TodoApp
  }
}
