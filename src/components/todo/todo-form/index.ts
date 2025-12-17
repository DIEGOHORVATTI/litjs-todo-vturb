import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators/custom-element.js'

import { AddTodoEvent } from '../../../events/todo-events.js'
import { todoStyles } from '../todo.css.js'
import { todoFormStyles } from './styles.css.js'

import '../../ui/ui-input/index.js'

@customElement('todo-form')
export class TodoForm extends LitElement {
  static override styles = [todoStyles, todoFormStyles]

  override render() {
    return html`
      <ui-input
        class="new-todo"
        placeholder="What needs to be done?"
        data-action="new-todo"></ui-input>
    `
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
    const target = e.target as HTMLElement | null
    if (!target) return
    if (target.tagName.toLowerCase() !== 'ui-input') return
    if (target.dataset.action !== 'new-todo') return
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

declare global {
  interface HTMLElementTagNameMap {
    'todo-form': TodoForm
  }
}
