import { html, LitElement, nothing } from 'lit'
import { customElement } from 'lit/decorators/custom-element.js'
import { property } from 'lit/decorators/property.js'
import { classMap } from 'lit/directives/class-map.js'

import { ClearCompletedEvent } from '../../../events/todo-events.js'
import type { FilterMode as TodoFilter } from '../../../types/index.js'
import { todoStyles } from '../todo.css.js'
import { todoFooterStyles } from './styles.css.js'

@customElement('todo-footer')
export class TodoFooter extends LitElement {
  static override styles = [todoStyles, todoFooterStyles]

  @property({ type: Number })
  activeCount = 0

  @property({ type: Number })
  completedCount = 0

  @property({ type: String })
  filter: TodoFilter = 'all'

  override connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('click', this.#onClick)
  }

  override disconnectedCallback(): void {
    this.removeEventListener('click', this.#onClick)
    super.disconnectedCallback()
  }

  override render() {
    if (this.activeCount === 0 && this.completedCount === 0) return nothing

    const allFilter = filterLink({ text: 'All', filter: 'all', selectedFilter: this.filter })
    const activeFilter = filterLink({
      text: 'Active',
      filter: 'active',
      selectedFilter: this.filter,
    })
    const completedFilter = filterLink({
      text: 'Completed',
      filter: 'completed',
      selectedFilter: this.filter,
    })

    return html`
      <span class="todo-count">
        <strong>${this.activeCount}</strong>
        items left
      </span>
      <ul class="filters">
        <li>${allFilter}</li>
        <li>${activeFilter}</li>
        <li>${completedFilter}</li>
      </ul>
      ${this.completedCount > 0
        ? html`<button data-action="clear-completed" class="clear-completed">
            Clear Completed
          </button>`
        : nothing}
    `
  }

  #onClick(e: Event) {
    const target = e.target as HTMLElement | null
    if (!target) return
    const btn = target.closest('button[data-action="clear-completed"]')
    if (!btn) return
    this.dispatchEvent(new ClearCompletedEvent())
  }
}

function filterLink({
  text,
  filter,
  selectedFilter,
}: {
  text: string
  filter: string
  selectedFilter: string | undefined
}) {
  return html`<a class="${classMap({ selected: filter === selectedFilter })}" href="#/${filter}"
    >${text}</a
  >`
}
