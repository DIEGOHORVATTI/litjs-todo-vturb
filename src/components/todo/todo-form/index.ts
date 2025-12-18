import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators/custom-element.js'
import { property } from 'lit/decorators/property.js'

import { AddTodoEvent } from '../../../events/todo-events.js'
import { todoStyles } from '../shared/styles/todo.css.js'

import '../../ui/ui-input/index.js'

import type { Priority } from '../../../types/index.js'

@customElement('todo-form')
export class TodoForm extends LitElement {
  static override styles = todoStyles

  @property({ type: String }) projectId: string = 'inbox'

  @property({ type: String }) priority: Priority = 'medium'

  @property({ type: String }) dueDate: string = ''

  override render() {
    return html`
      <div
        style="display: grid; grid-template-columns: 1fr 180px 180px; gap: var(--space-3); align-items: end;">
        <ui-input placeholder="Qual a nova tarefa?" data-action="new-todo"></ui-input>

        <ui-input
          type="select"
          data-action="priority"
          .value=${this.priority}
          .options=${[
            { value: 'low', label: 'Baixa' },
            { value: 'medium', label: 'Média' },
            { value: 'high', label: 'Alta' },
          ]}></ui-input>

        <ui-input
          type="date"
          data-action="dueDate"
          .value=${this.dueDate}
          placeholder="Data limite"></ui-input>
      </div>
    `
  }

  override connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('ui-submit', this.#onUiSubmit as EventListener)
    this.addEventListener('ui-change', this.#onUiChange as EventListener)
  }

  override disconnectedCallback(): void {
    this.removeEventListener('ui-submit', this.#onUiSubmit as EventListener)
    this.removeEventListener('ui-change', this.#onUiChange as EventListener)
    super.disconnectedCallback()
  }

  #onUiSubmit(e: Event) {
    const evt = e as CustomEvent<string>
    const input = getUiInputFromEvent(e)
    if (!input) return
    if (input.dataset.action !== 'new-todo') return
    this.#onSubmit(evt)
  }

  #onUiChange(e: Event) {
    const evt = e as CustomEvent<string>
    const input = getUiInputFromEvent(e)
    if (!input) return

    if (input.dataset.action === 'priority') {
      const value = String(evt.detail ?? '') as Priority
      if (value === 'low' || value === 'medium' || value === 'high') {
        this.priority = value
      }
      return
    }

    if (input.dataset.action === 'dueDate') {
      this.dueDate = String(evt.detail ?? '')
    }
  }

  #onSubmit(e: CustomEvent<string>) {
    const value = e.detail
    if (value && value.length > 0) {
      this.dispatchEvent(
        new AddTodoEvent({
          title: value,
          projectId: this.projectId,
          priority: this.priority,
          ...(this.dueDate ? { dueDate: new Date(this.dueDate).toISOString() } : {}),
        })
      )

      const input = this.shadowRoot?.querySelector('ui-input[data-action="new-todo"]') as any
      if (input) input.value = ''
    }
  }
}

function getUiInputFromEvent(e: Event): HTMLElement | null {
  const path = typeof e.composedPath === 'function' ? e.composedPath() : []
  for (const node of path) {
    if (node instanceof HTMLElement && node.tagName.toLowerCase() === 'ui-input') {
      return node
    }
  }
  return null
}

declare global {
  interface HTMLElementTagNameMap {
    'todo-form': TodoForm
  }
}
