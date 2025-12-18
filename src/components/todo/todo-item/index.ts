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

  @property({ type: String })
  projectName: string | null = null

  @state()
  isEditing: boolean = false

  // When Enter commits, a blur event can follow immediately; this flag prevents
  // the blur handler from cancelling the just-committed edit.
  #ignoreNextBlur = false

  override connectedCallback(): void {
    super.connectedCallback()

    this.addEventListener('dblclick', this.#onDblClick)
    this.addEventListener('click', this.#onClick)
    this.addEventListener('keydown', this.#onKeydown)
    this.addEventListener('blur', this.#onBlur, true)
  }

  override disconnectedCallback(): void {
    this.removeEventListener('dblclick', this.#onDblClick)
    this.removeEventListener('click', this.#onClick)
    this.removeEventListener('keydown', this.#onKeydown)
    this.removeEventListener('blur', this.#onBlur, true)
    super.disconnectedCallback()
  }

  override render() {
    const itemClassList = {
      todo: true,
      completed: this.todo.completed,
      editing: this.isEditing,
    }

    const due = this.todo.dueDate ? new Date(this.todo.dueDate) : null
    const dueValid = !!due && !Number.isNaN(due.getTime())
    const isOverdue =
      !this.todo.completed && dueValid && (due as Date).getTime() < new Date().getTime()

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
            <span class="meta" aria-hidden="true">
              ${this.projectName
                ? html`<span class="badge" data-project="true">${this.projectName}</span>`
                : null}
              <span class="badge" data-priority=${this.todo.priority}> ${this.todo.priority} </span>
              ${due
                ? html`<span class="badge" data-due=${isOverdue ? 'overdue' : 'ok'}>
                    ${formatDueDate(due as Date)}
                  </span>`
                : null}
            </span>
          </label>

          <button data-action="delete" class="destroy"></button>
        </div>
        <input class="edit" type="text" data-action="edit" .value=${this.todo.title} />
      </li>
    `
  }

  #onDblClick(e: Event) {
    const path = typeof e.composedPath === 'function' ? e.composedPath() : []
    const label = path.find((n): n is HTMLLabelElement => n instanceof HTMLLabelElement)
    if (!label) return
    console.log('[todo-item] dblclick -> beginEdit', { id: this.todo?.id })
    this.#beginEdit()
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

  #onKeydown(e: KeyboardEvent) {
    const target = e.target as HTMLElement | null
    if (!target) return
    if (target.dataset.action === 'edit') {
      const input = target as HTMLInputElement

      console.log('[todo-item] keydown', {
        id: this.todo?.id,
        key: e.key,
        value: input.value,
        isEditing: this.isEditing,
      })

      if (e.key === 'Escape') {
        e.preventDefault()
        console.log('[todo-item] escape -> abort')
        this.#abortEdit(e)
        return
      }

      if (e.key === 'Enter') {
        e.preventDefault()
        this.#ignoreNextBlur = true
        console.log('[todo-item] enter -> finish', { ignoreNextBlur: this.#ignoreNextBlur })
        this.#finishEditWithInput(input)

        // If the browser blurs the input after Enter, we want to ignore that.
        queueMicrotask(() => {
          this.#ignoreNextBlur = false
          console.log('[todo-item] ignoreNextBlur reset')
        })
      }
    }
  }

  #onBlur(e: FocusEvent) {
    const target = e.target as HTMLElement | null
    if (!target) return
    if (target.dataset.action === 'edit') {
      console.log('[todo-item] blur', {
        id: this.todo?.id,
        ignoreNextBlur: this.#ignoreNextBlur,
        value: (target as HTMLInputElement).value,
      })
      if (this.#ignoreNextBlur) return

      // Requested UX: clicking outside cancels edit.
      console.log('[todo-item] blur -> abort')
      this.#abortEdit(e)
    }
  }

  #toggleTodo() {
    console.log('[todo-item] dispatch todo:update completed', { id: this.todo?.id })
    this.dispatchEvent(
      new UpdateTodoEvent({
        id: this.todo.id,
        changes: { completed: !this.todo.completed },
      })
    )
  }

  #deleteTodo() {
    console.log('[todo-item] dispatch todo:remove', { id: this.todo?.id })
    this.dispatchEvent(new RemoveTodoEvent({ id: this.todo.id }))
  }

  #beginEdit() {
    this.isEditing = true
    const input = this.shadowRoot!.querySelector('.edit') as HTMLInputElement
    setTimeout(() => {
      input.focus()
      input.select()
    }, 0)
  }

  #finishEditWithInput(el: HTMLInputElement) {
    const title = el.value.trim()

    console.log('[todo-item] finishEdit', { id: this.todo?.id, title })

    if (!title) {
      this.#deleteTodo()
      this.isEditing = false
      return
    }

    if (title === this.todo.title) {
      console.log('[todo-item] finishEdit no-op (same title)')
      this.isEditing = false
      return
    }

    console.log('[todo-item] dispatch todo:update title', { id: this.todo?.id })
    this.dispatchEvent(new UpdateTodoEvent({ id: this.todo.id, changes: { title } }))
    this.isEditing = false
  }

  #abortEdit(e: Event) {
    const input = e.target as HTMLInputElement
    console.log('[todo-item] abortEdit', { id: this.todo?.id })
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

function formatDueDate(d: Date): string {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}
