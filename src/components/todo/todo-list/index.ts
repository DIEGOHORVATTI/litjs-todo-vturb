import { html, LitElement, nothing } from 'lit'
import { customElement } from 'lit/decorators/custom-element.js'
import { property } from 'lit/decorators/property.js'
import { repeat } from 'lit/directives/repeat.js'

import type { Todo } from '../../../types/index.js'
import { todoStyles } from '../todo.css.js'
import { todoListStyles } from './styles.css.js'

import '../todo-item/index.js'

import { ToggleAllTodoEvent } from '../../../events/todo-events.js'

@customElement('todo-list')
export class TodoList extends LitElement {
  static override styles = [todoStyles, todoListStyles]

  @property({ type: Array })
  todos: Todo[] = []

  @property({ type: Boolean })
  allCompleted = false

  override connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('change', this.#onChange)
  }

  override disconnectedCallback(): void {
    this.removeEventListener('change', this.#onChange)
    super.disconnectedCallback()
  }

  override render() {
    return html`
      ${this.todos.length > 0
        ? html`
            <input
              id="toggle-all"
              type="checkbox"
              class="toggle-all"
              .checked=${this.allCompleted}
              data-action="toggle-all" />
            <label for="toggle-all"> Mark all as complete </label>
          `
        : nothing}

      <ul class="todo-list">
        ${repeat(
          this.todos,
          (todo) => todo.id,
          (todo) => html`<todo-item .todo=${todo}></todo-item>`
        )}
      </ul>
    `
  }

  #onChange(e: Event) {
    const target = e.target as HTMLElement | null
    if (!target) return
    if (target instanceof HTMLInputElement && target.dataset.action === 'toggle-all') {
      this.dispatchEvent(new ToggleAllTodoEvent())
    }
  }
}
