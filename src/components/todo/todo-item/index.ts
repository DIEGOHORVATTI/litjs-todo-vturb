import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators/custom-element.js'
import { property } from 'lit/decorators/property.js'
import { state } from 'lit/decorators/state.js'
import { classMap } from 'lit/directives/class-map.js'

import { RemoveTodoEvent, UpdateTodoEvent } from '../../../events/todo-events.js'
import type { Todo } from '../../../types/index.js'
import { todoStyles } from '../shared/styles/todo.css.js'
import { todoItemStyles } from './styles.css.js'

@customElement('todo-item')
export class TodoItem extends LitElement {
  static override styles = [todoStyles, todoItemStyles]

  @property({ type: Object })
  todo!: Todo

  @state()
  isEditing: boolean = false

  override connectedCallback(): void {
    super.connectedCallback()

    this.addEventListener('dblclick', this.#onDblClick)
    this.addEventListener('click', this.#onClick)
    this.addEventListener('keyup', this.#onKeyup)
    this.addEventListener('blur', this.#onBlur, true)
  }

  override disconnectedCallback(): void {
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

          <label>
            <span data-action="begin-edit"> ${this.todo.title} </span>
          </label>

          <button data-action="delete" class="destroy"></button>
        </div>
        <input class="edit" type="text" data-action="edit" .value=${this.todo.title} />
      </li>
    `
  }

  #onDblClick(e: Event) {
    const target = e.target as HTMLElement | null
    if (!target) return
    if (target.dataset.action === 'begin-edit') {
      this.#beginEdit()
    }
  }

  #onClick(e: Event) {
    const action = this.#getActionFromEvent(e)
    if (!action) return

    switch (action) {
      case 'delete':
        this.#handleDeleteClick()
        return
      case 'toggle':
        this.#handleToggleClick()
        return
    }
  }

  #handleToggleClick() {
    this.#toggleTodo()
  }

  #handleDeleteClick() {
    this.#deleteTodo()
  }

  #onKeyup(e: KeyboardEvent) {
    const target = e.target as HTMLElement | null
    if (!target) return
    if (target.dataset.action === 'edit') {
      this.#captureEscape(e)

      if (e.key === 'Enter') {
        this.#finishEditWithInput(target as HTMLInputElement)
      }
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

  #finishEditWithInput(el: HTMLInputElement) {
    const title = el.value
    this.dispatchEvent(new UpdateTodoEvent({ id: this.todo.id, changes: { title } }))
    this.isEditing = false
  }

  #captureEscape(e: KeyboardEvent) {
    if (e.key === 'Escape') this.#abortEdit(e)
  }

  #abortEdit(e: Event) {
    const input = e.target as HTMLInputElement
    input.value = this.todo.title
    this.isEditing = false
  }

  #getActionFromEvent(e: Event): string | null {
    const path = typeof e.composedPath === 'function' ? e.composedPath() : []
    const actionable = path.find(
      (n): n is HTMLElement => n instanceof HTMLElement && !!n.dataset.action
    )
    const action = actionable?.dataset.action ?? null
    if (action === 'delete' || action === 'toggle') return action
    return null
  }
}
