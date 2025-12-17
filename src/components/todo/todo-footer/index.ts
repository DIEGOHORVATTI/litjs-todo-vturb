import { html, LitElement, nothing } from 'lit'
import { customElement } from 'lit/decorators/custom-element.js'
import { property } from 'lit/decorators/property.js'
import { classMap } from 'lit/directives/class-map.js'

import { ClearCompletedEvent } from '../../../events/todo-events.js'
import type { FilterMode as TodoFilter } from '../../../types/index.js'
import { todoStyles } from '../shared/styles/todo.css.js'
import { todoFooterStyles } from './styles.css.js'

export type TodoFilterSelectedDetail = {
  filter: TodoFilter
}

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

    const allFilter = filterLink({ text: 'Todos', filter: 'all', selectedFilter: this.filter })
    const activeFilter = filterLink({
      text: 'Ativas',
      filter: 'active',
      selectedFilter: this.filter,
    })
    const completedFilter = filterLink({
      text: 'Concluídas',
      filter: 'completed',
      selectedFilter: this.filter,
    })
    const overdueFilter = filterLink({
      text: 'Atrasados',
      filter: 'overdue',
      selectedFilter: this.filter,
    })

    return html`
      <span class="todo-count">
        <strong>${this.activeCount}</strong>
        ${this.activeCount === 1 ? 'pendente' : 'pendentes'}
      </span>

      <div class="filters">
        ${this.completedCount
          ? html`<a data-action="clear-completed" class="clear-completed">Limpar concluídas</a>`
          : nothing}
        ${allFilter} ${activeFilter} ${completedFilter} ${overdueFilter}
      </div>
    `
  }

  #onClick(e: Event) {
    const target = e.target as HTMLElement | null
    if (!target) return

    const link = getAnchorFromEvent(e)

    if (link) {
      e.preventDefault()
      const filter = (link.dataset.filter ?? 'all') as TodoFilter

      this.dispatchEvent(
        new CustomEvent<TodoFilterSelectedDetail>('todo-filter:selected', {
          detail: { filter },
          bubbles: true,
          composed: true,
        })
      )
      return
    }

    const clear = getClearCompletedFromEvent(e)
    if (!clear) return
    this.dispatchEvent(new ClearCompletedEvent())
  }
}

function getClearCompletedFromEvent(e: Event): HTMLAnchorElement | null {
  const path = typeof e.composedPath === 'function' ? e.composedPath() : []

  for (const node of path) {
    if (!(node instanceof HTMLElement)) continue

    if (node instanceof HTMLAnchorElement && node.dataset.action === 'clear-completed') {
      return node
    }

    const a = node.closest?.('a[data-action="clear-completed"]')
    if (a instanceof HTMLAnchorElement) return a
  }

  return null
}

function getAnchorFromEvent(e: Event): HTMLAnchorElement | null {
  const path = typeof e.composedPath === 'function' ? e.composedPath() : []

  for (const node of path) {
    if (!(node instanceof HTMLElement)) continue

    if (node instanceof HTMLAnchorElement && node.dataset.action === 'set-filter') {
      return node
    }

    const a = node.closest?.('a[data-action="set-filter"]')
    if (a instanceof HTMLAnchorElement) return a
  }

  return null
}

type TodoFooterProps = {
  text: string
  filter: TodoFilter
  selectedFilter: TodoFilter | undefined
}

function filterLink({ text, filter, selectedFilter }: TodoFooterProps) {
  return html`<a
    class="${classMap({ selected: filter === selectedFilter })}"
    href="#${filter}"
    data-action="set-filter"
    data-filter="${filter}"
    >${text}</a
  >`
}
