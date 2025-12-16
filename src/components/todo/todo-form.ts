import { LitElement, html, css } from 'lit'
import { customElement } from 'lit/decorators/custom-element.js'

import { todoStyles } from './todo.css.js'
import { AddTodoEvent } from '../../events/todo-events.js'
import '../ui/ui-input.js'

@customElement('todo-form')
export class TodoForm extends LitElement {
  static override styles = [
    todoStyles,
    css`
      :host {
        display: block;
      }
    `,
  ]

  override render() {
    return html`
      <ui-input
        class="new-todo"
        placeholder="What needs to be done?"
        @ui-submit=${this.#onSubmit}
      ></ui-input>
    `
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
