import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators/custom-element.js'

import { AddTodoEvent } from '../../../events/todo-events.js'
import { todoStyles } from '../shared/styles/todo.css.js'

import '../../ui/ui-input/index.js'

@customElement('todo-form')
export class TodoForm extends LitElement {
  static override styles = todoStyles

  override render() {
    return html` <ui-input placeholder="Qual a nova tarefa?" data-action="new-todo"></ui-input> `
  }

  override connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('ui-submit', this.#onUiSubmit as EventListener)
  }

  override disconnectedCallback(): void {
    this.removeEventListener('ui-submit', this.#onUiSubmit as EventListener)
    super.disconnectedCallback()
  }

  #onUiSubmit(e: Event) {
    const evt = e as CustomEvent<string>
    const input = getUiInputFromEvent(e)
    if (!input) return
    if (input.dataset.action !== 'new-todo') return
    this.#onSubmit(evt)
  }

  #onSubmit(e: CustomEvent<string>) {
    const value = e.detail
    if (value && value.length > 0) {
      this.dispatchEvent(
        new AddTodoEvent({
          title: value,
          projectId: 'inbox',
          priority: 'medium',
        })
      )

      // Clear input
      const input = this.shadowRoot?.querySelector('ui-input') as any
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
