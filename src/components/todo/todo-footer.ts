import { LitElement, html, css, nothing } from 'lit'
import { customElement } from 'lit/decorators/custom-element.js'
import { property } from 'lit/decorators/property.js'
import { classMap } from 'lit/directives/class-map.js'

import { todoStyles } from './todo.css.js'
import type { FilterMode as TodoFilter } from '../../types/index.js'
import { ClearCompletedEvent } from '../../events/todo-events.js'

@customElement('todo-footer')
export class TodoFooter extends LitElement {
  static override styles = [
    todoStyles,
    css`
      :host {
        display: block;
        padding: var(--space-3) var(--space-4);
        min-height: 44px;
        text-align: center;
        font-size: var(--text-sm);
        border-top: 1px solid var(--color-border);
        background: var(--color-surface);
        color: var(--color-muted);
      }
      :host:before {
        content: '';
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        height: 50px;
        overflow: hidden;
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.12);
        opacity: 0.25;
      }

      .todo-count {
        float: left;
        text-align: left;
      }
      .todo-count strong {
        font-weight: 600;
        color: var(--color-text);
      }

      .filters {
        margin: 0;
        padding: 0;
        list-style: none;
        position: absolute;
        right: 0;
        left: 0;
      }

      li {
        display: inline;
      }
      li a {
        color: inherit;
        margin: 3px;
        padding: 6px 10px;
        text-decoration: none;
        border: 1px solid transparent;
        border-radius: var(--radius-sm);
      }

      a:hover {
        border-color: color-mix(in oklab, var(--color-accent), transparent 65%);
      }

      a.selected {
        color: var(--color-text);
        background: color-mix(in oklab, var(--color-accent), transparent 88%);
        border-color: color-mix(in oklab, var(--color-accent), transparent 45%);
      }
      .clear-completed,
      :host .clear-completed:active {
        float: right;
        position: relative;
        line-height: 19px;
        text-decoration: none;
        cursor: pointer;
        padding: 6px 10px;
        border-radius: var(--radius-sm);
        border: 1px solid var(--color-border);
        background: var(--color-surface-2);
        color: var(--color-text);
      }

      .clear-completed:hover {
        filter: brightness(0.98);
      }
    `,
  ]

  @property({ type: Number })
  activeCount = 0

  @property({ type: Number })
  completedCount = 0

  @property({ type: String })
  filter: TodoFilter = 'all'

  override render() {
    if (this.activeCount === 0 && this.completedCount === 0) return nothing

    const allFilter = filterLink({
      text: 'All',
      filter: 'all',
      selectedFilter: this.filter,
    })
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
        ? html`<button @click=${this.#onClearCompletedClick} class="clear-completed">
            Clear Completed
          </button>`
        : nothing}
    `
  }

  #onClearCompletedClick() {
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

declare global {
  interface HTMLElementTagNameMap {
    'todo-footer': TodoFooter
  }
}
