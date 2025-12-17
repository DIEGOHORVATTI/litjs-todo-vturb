import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators/custom-element.js'

import '../../ui/ui-input/index.js'
import '../../ui/ui-button/index.js'

import { AddProjectEvent } from '../../../events/project-events.js'

@customElement('project-form')
export class ProjectForm extends LitElement {
  override connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('ui-submit', this.#onSubmit as EventListener)
    this.addEventListener('ui-click', this.#onClick as EventListener)
  }

  override disconnectedCallback(): void {
    this.removeEventListener('ui-submit', this.#onSubmit as EventListener)
    this.removeEventListener('ui-click', this.#onClick as EventListener)
    super.disconnectedCallback()
  }

  override render() {
    return html`
      <div
        style="display: grid; grid-template-columns: 1fr auto; gap: var(--space-3); align-items: end;">
        <ui-input placeholder="Novo projeto" data-action="new-project"></ui-input>
        <ui-button data-action="add-project"></ui-button>
      </div>
    `
  }

  #onClick(e: Event) {
    const btn = getUiButtonFromEvent(e)
    if (!btn) return
    if (btn.dataset.action !== 'add-project') return
    this.#emitAddProject()
  }

  #onSubmit(e: Event) {
    const input = getUiInputFromEvent(e)
    if (!input) return
    if (input.dataset.action !== 'new-project') return
    this.#emitAddProject()
  }

  #emitAddProject() {
    const input = this.shadowRoot?.querySelector('ui-input[data-action="new-project"]') as any
    const name = String(input?.value ?? '').trim()
    if (!name) return

    this.dispatchEvent(new AddProjectEvent({ name }))

    if (input) input.value = ''
  }
}

function getUiInputFromEvent(e: Event): HTMLElement | null {
  const path = typeof e.composedPath === 'function' ? e.composedPath() : []
  for (const node of path) {
    if (node instanceof HTMLElement && node.tagName.toLowerCase() === 'ui-input') return node
  }
  return null
}

function getUiButtonFromEvent(e: Event): HTMLElement | null {
  const path = typeof e.composedPath === 'function' ? e.composedPath() : []
  for (const node of path) {
    if (node instanceof HTMLElement && node.tagName.toLowerCase() === 'ui-button') return node
  }
  return null
}

declare global {
  interface HTMLElementTagNameMap {
    'project-form': ProjectForm
  }
}
