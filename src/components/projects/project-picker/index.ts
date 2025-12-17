import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators/custom-element.js'
import { property } from 'lit/decorators/property.js'

import type { Project } from '../../../types/index.js'
import { SelectProjectEvent } from '../../../events/project-events.js'

@customElement('project-picker')
export class ProjectPicker extends LitElement {
  @property({ type: Array }) projects: Project[] = []

  @property({ type: String }) selectedProjectId: string = 'all'

  override connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('change', this.#onChange)
    this.addEventListener('input', this.#onInput)
  }

  override disconnectedCallback(): void {
    this.removeEventListener('change', this.#onChange)
    this.removeEventListener('input', this.#onInput)
    super.disconnectedCallback()
  }

  override render() {
    const suggestions = [
      { id: 'all', name: 'All' },
      { id: 'inbox', name: 'Inbox' },
      ...this.projects.map((p) => ({ id: p.id, name: p.name })),
    ]

    const selectedName =
      suggestions.find((s) => s.id === this.selectedProjectId)?.name ?? this.selectedProjectId

    return html`
      <label>
        <span>Projeto</span>
        <input
          type="text"
          list="project-options"
          data-action="select-project"
          .value=${selectedName}
          placeholder="All / Inbox / projeto" />
        <datalist id="project-options">
          ${suggestions.map((s) => html`<option value=${s.name}></option>`)}
        </datalist>
      </label>
    `
  }

  #onChange(e: Event) {
    const input = getInputFromEvent(e)
    if (!input) return
    if (input.dataset.action !== 'select-project') return
    this.#emitSelectionFromInput(input.value)
  }

  #onInput(e: Event) {
    const input = getInputFromEvent(e)
    if (!input) return
    if (input.dataset.action !== 'select-project') return

    // Only emit selection when it matches a known option.
    this.#emitSelectionFromInput(input.value, { strict: true })
  }

  #emitSelectionFromInput(raw: string, opts: { strict?: boolean } = {}) {
    const value = (raw ?? '').trim()
    if (!value) return

    const lowers = value.toLowerCase()
    if (lowers === 'all') {
      this.dispatchEvent(new SelectProjectEvent({ projectId: 'all' }))
      return
    }
    if (lowers === 'inbox') {
      this.dispatchEvent(new SelectProjectEvent({ projectId: 'inbox' }))
      return
    }

    const match = this.projects.find((p) => p.name.toLowerCase() === lowers)
    if (!match) {
      if (opts.strict) return
      // If user typed a raw id, allow it.
      this.dispatchEvent(new SelectProjectEvent({ projectId: value }))
      return
    }

    this.dispatchEvent(new SelectProjectEvent({ projectId: match.id }))
  }
}

function getInputFromEvent(e: Event): HTMLInputElement | null {
  const path = typeof e.composedPath === 'function' ? e.composedPath() : []
  for (const node of path) {
    if (node instanceof HTMLInputElement && node.dataset.action === 'select-project') return node
  }
  return null
}

declare global {
  interface HTMLElementTagNameMap {
    'project-picker': ProjectPicker
  }
}
