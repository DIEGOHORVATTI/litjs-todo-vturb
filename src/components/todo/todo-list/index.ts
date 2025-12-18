import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators/custom-element.js'
import { property } from 'lit/decorators/property.js'
import { repeat } from 'lit/directives/repeat.js'

import type { Todo } from '../../../types/index.js'
import { todoStyles } from '../shared/styles/todo.css.js'
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

  @property({ type: Array })
  projects: Array<{ id: string; name: string }> = []

  override connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('click', this.#onClick)
  }

  override disconnectedCallback(): void {
    this.removeEventListener('click', this.#onClick)
    super.disconnectedCallback()
  }

  override render() {
    const projectNameById = new Map(this.projects.map((p) => [p.id, p.name]))

    return html`
      <div class="new-todo-row">
        <input
          id="toggle-all"
          type="checkbox"
          class="toggle toggle-all"
          .checked=${this.allCompleted}
          data-action="toggle-all" />
        <label for="toggle-all">Toggle all</label>

        <slot name="new-todo"></slot>
      </div>

      <ul class="todo-list">
        ${repeat(
          this.todos,
          (todo) => todo.id,
          (todo) =>
            html`<todo-item
              .todo=${todo}
              .projectName=${projectNameById.get(todo.projectId) ?? null}></todo-item>`
        )}
      </ul>
    `
  }

  #onClick(e: Event) {
    const path = typeof e.composedPath === 'function' ? e.composedPath() : []
    const input = path.find(
      (n): n is HTMLInputElement =>
        n instanceof HTMLInputElement && n.dataset.action === 'toggle-all'
    )
    if (!input) return

    this.dispatchEvent(new ToggleAllTodoEvent({ completed: input.checked }))
  }
}
