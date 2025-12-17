import { css, html, LitElement } from 'lit'
import { customElement } from 'lit/decorators/custom-element.js'
import { property } from 'lit/decorators/property.js'
import { state } from 'lit/decorators/state.js'

import '../../ui/ui-button/index.js'
import '../../ui/ui-input/index.js'

import { DataExportEvent, DataImportEvent } from '../../../events/data-events.js'

@customElement('data-panel')
export class DataPanel extends LitElement {
  static override styles = css`
    :host {
      display: block;
      padding: var(--space-3) var(--space-4);
      border-top: 1px solid var(--color-border);
      background: var(--color-surface);
    }

    .row {
      display: grid;
      grid-template-columns: 1fr auto auto;
      gap: var(--space-3);
      align-items: center;
    }

    textarea {
      width: 100%;
      min-height: 96px;
      resize: vertical;
      padding: 10px 12px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--color-border);
      background: var(--color-surface-2);
      color: var(--color-text);
      font: inherit;
    }

    textarea:focus {
      outline: 0;
      box-shadow: var(--focus-ring);
      border-color: color-mix(in oklab, var(--color-accent), transparent 55%);
    }

    .hint {
      margin-top: var(--space-2);
      font-size: var(--text-sm);
      color: var(--color-muted);
    }

    @media (max-width: 860px) {
      .row {
        grid-template-columns: 1fr;
        align-items: stretch;
      }
    }
  `

  @property({ type: Boolean }) open = false

  @state() private value = ''

  override connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('click', this.#onClick)
    this.addEventListener('input', this.#onInput)
  }

  override disconnectedCallback(): void {
    this.removeEventListener('click', this.#onClick)
    this.removeEventListener('input', this.#onInput)
    super.disconnectedCallback()
  }

  override render() {
    return html`
      <div class="row">
        <ui-button
          label=${this.open ? 'Fechar' : 'Export / Import'}
          data-action="toggle"></ui-button>
        <ui-button label="Exportar" data-action="export"></ui-button>
        <ui-button label="Importar" data-action="import"></ui-button>
      </div>

      ${this.open
        ? html`
            <div style="margin-top: var(--space-3);">
              <textarea
                data-action="json"
                placeholder="Cole aqui o JSON para importar, ou clique em Exportar para gerar."
                .value=${this.value}></textarea>
              <div class="hint">
                Exporta e importa o estado completo (projects + todos). Import faz validação mínima
                do formato.
              </div>
            </div>
          `
        : null}
    `
  }

  #onInput(e: Event) {
    const ta = getTextareaFromEvent(e)
    if (!ta) return
    if (ta.dataset.action !== 'json') return
    this.value = ta.value
  }

  #onClick(e: Event) {
    const btn = getButtonFromEvent(e)
    if (!btn) return
    const action = btn.dataset.action

    if (action === 'toggle') {
      this.open = !this.open
      return
    }

    if (action === 'export') {
      this.dispatchEvent(new DataExportEvent())
      return
    }

    if (action === 'import') {
      this.dispatchEvent(new DataImportEvent({ json: this.value }))
    }
  }
}

function getTextareaFromEvent(e: Event): HTMLTextAreaElement | null {
  const path = typeof e.composedPath === 'function' ? e.composedPath() : []
  for (const node of path) {
    if (node instanceof HTMLTextAreaElement && node.dataset.action === 'json') return node
  }
  return null
}

function getButtonFromEvent(e: Event): HTMLElement | null {
  const path = typeof e.composedPath === 'function' ? e.composedPath() : []
  for (const node of path) {
    if (node instanceof HTMLElement && node.dataset.action) return node
  }
  return null
}

declare global {
  interface HTMLElementTagNameMap {
    'data-panel': DataPanel
  }
}
