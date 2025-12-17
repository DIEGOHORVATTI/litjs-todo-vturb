import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators/custom-element.js'
import { property } from 'lit/decorators/property.js'
import { state } from 'lit/decorators/state.js'
import { classMap } from 'lit/directives/class-map.js'

import { todoStyles } from '../todo.css.js'
import { todoItemStyles } from './styles.css.js'
import { RemoveTodoEvent, UpdateTodoEvent } from '../../../events/todo-events.js'
import type { Todo } from '../../../types/index.js'

@customElement('todo-item')
export class TodoItem extends LitElement {
  static override styles = [todoStyles, todoItemStyles]

  @property({ type: Object })
  todo!: Todo

  @state()
  isEditing: boolean = false

  override connectedCallback(): void {
    super.connectedCallback()

    this.addEventListener('change', this.#onChange)
    this.addEventListener('dblclick', this.#onDblClick)
    this.addEventListener('click', this.#onClick)
    this.addEventListener('keyup', this.#onKeyup)
    this.addEventListener('blur', this.#onBlur, true)
  }

  override disconnectedCallback(): void {
    this.removeEventListener('change', this.#onChange)
    this.removeEventListener('dblclick', this.#onDblClick)
    this.removeEventListener('click', this.#onClick)
    this.removeEventListener('keyup', this.#onKeyup)
    this.removeEventListener('blur', this.#onBlur, true)
    super.disconnectedCallback()
  }

  override render() {
    const itemClassList = {
      todo: true,
      completed: this.todo.completed,
      editing: this.isEditing,
    }

    return html`
      <li class="${classMap(itemClassList)}">
        <div class="view">
          <input
            class="toggle"
            type="checkbox"
            .checked=${this.todo.completed}
            data-action="toggle" />
          <label data-action="begin-edit"> ${this.todo.title} </label>
          <button data-action="delete" class="destroy"></button>
        </div>
        <input class="edit" type="text" data-action="edit" .value=${this.todo.title} />
      </li>
    `
  }

  #onChange(e: Event) {
    const target = e.target as HTMLElement | null
    if (!target) return
    if (target instanceof HTMLInputElement && target.dataset.action === 'toggle') {
      this.#toggleTodo()
      return
    }

    if (target instanceof HTMLInputElement && target.dataset.action === 'edit') {
      this.#finishEdit(e)
    }
  }

  #onDblClick(e: Event) {
    const target = e.target as HTMLElement | null
    if (!target) return
    if (target.dataset.action === 'begin-edit') {
      this.#beginEdit()
    }
  }

  #onClick(e: Event) {
    const target = e.target as HTMLElement | null
    if (!target) return
    if (target.dataset.action === 'delete') {
      this.#deleteTodo()
    }
  }

  #onKeyup(e: KeyboardEvent) {
    const target = e.target as HTMLElement | null
    if (!target) return
    if (target.dataset.action === 'edit') {
      this.#captureEscape(e)
    }
  }

  #onBlur(e: FocusEvent) {
    const target = e.target as HTMLElement | null
    if (!target) return
    if (target.dataset.action === 'edit') {
      this.#abortEdit(e)
    }
  }

  #toggleTodo() {
    this.dispatchEvent(
      new UpdateTodoEvent({
        id: this.todo.id,
        changes: { completed: !this.todo.completed },
      })
    )
  }

  #deleteTodo() {
    this.dispatchEvent(new RemoveTodoEvent({ id: this.todo.id }))
  }

  #beginEdit() {
    this.isEditing = true
    const input = this.shadowRoot!.querySelector('.edit') as HTMLInputElement
    setTimeout(() => input.focus(), 0)
  }

  #finishEdit(e: Event) {
    const el = e.target as HTMLInputElement
    const title = el.value
    this.dispatchEvent(new UpdateTodoEvent({ id: this.todo.id, changes: { title } }))
    this.isEditing = false
  }

  #captureEscape(e: KeyboardEvent) {
    if (e.key === 'escape') this.#abortEdit(e)
  }

  #abortEdit(e: Event) {
    const input = e.target as HTMLInputElement
    input.value = this.todo.title
    this.isEditing = false
  }
}
