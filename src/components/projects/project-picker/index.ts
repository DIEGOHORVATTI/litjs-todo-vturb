import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators/custom-element.js'
import { property } from 'lit/decorators/property.js'

import { SelectProjectEvent } from '../../../events/project-events.js'
import type { Project } from '../../../types/index.js'
import { inputPickerStyles } from './styles.css.js'

@customElement('project-picker')
export class ProjectPicker extends LitElement {
  static override styles = inputPickerStyles

  @property({ type: Array }) projects: Project[] = []

  @property({ type: String }) selectedProjectId: string = 'all'

  override connectedCallback(): void {
    super.connectedCallback()
    this.shadowRoot?.addEventListener('change', this.#onChange)
  }

  override disconnectedCallback(): void {
    this.shadowRoot?.removeEventListener('change', this.#onChange)
    super.disconnectedCallback()
  }

  override render() {
    return html`
      <label>
        <span>Selecione seu Projeto</span>

        <select data-action="select-project" .value=${this.selectedProjectId}>
          <option value="all">Todos</option>
          ${this.projects.map((p) => html`<option value=${p.id}>${p.name}</option>`)}
        </select>
      </label>
    `
  }

  #onChange(e: Event) {
    const select = getSelectFromEvent(e)
    if (!select) return
    if (select.dataset.action !== 'select-project') return

    const value = (select.value ?? '').trim()
    if (!value) return
    this.dispatchEvent(new SelectProjectEvent({ projectId: value }))
  }
}

function getSelectFromEvent(e: Event): HTMLSelectElement | null {
  const path = typeof e.composedPath === 'function' ? e.composedPath() : []
  for (const node of path) {
    if (node instanceof HTMLSelectElement && node.dataset.action === 'select-project') return node
  }
  return null
}

declare global {
  interface HTMLElementTagNameMap {
    'project-picker': ProjectPicker
  }
}
