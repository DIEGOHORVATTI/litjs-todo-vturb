import { css, html, LitElement } from 'lit'
import { property, state } from 'lit/decorators.js'
import { customElement } from 'lit/decorators/custom-element.js'

import { DataExportEvent, DataImportEvent } from '../../../events/data-events.js'

import '../../ui/ui-button/index.js'

@customElement('data-panel')
export class DataPanel extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }

    .wrap {
      display: grid;
      gap: var(--space-2);
    }

    .row {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: var(--space-2);
    }

    textarea {
      width: 100%;
      min-height: 120px;
      resize: vertical;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      padding: 10px;
      font-family:
        ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
        monospace;
      font-size: 12px;
      color: var(--color-text);
      background: var(--color-surface-2);
      box-sizing: border-box;
    }

    .hint {
      font-size: var(--text-sm);
      color: var(--color-muted);
    }
  `

  /**
   * Current JSON text.
   * Note: this is intentionally *not* reactive to parent changes; parent may set it directly.
   */
  @property({ type: String }) value = ''

  @state() private error = ''

  override connectedCallback(): void {
    super.connectedCallback()

    this.addEventListener('input', this.#onInput)
    this.addEventListener('ui-click', this.#onUiClick as EventListener)
  }

  override disconnectedCallback(): void {
    this.removeEventListener('input', this.#onInput)
    this.removeEventListener('ui-click', this.#onUiClick as EventListener)
    super.disconnectedCallback()
  }

  override render() {
    return html`
      <div class="wrap">
        <div class="row">
          <ui-button data-action="export">Exportar</ui-button>
          <ui-button data-action="import">Importar</ui-button>
        </div>

        <textarea
          data-action="json"
          spellcheck="false"
          placeholder='Cole aqui o JSON exportado (ou clique em "Exportar")'>
${this.value}</textarea
        >

        ${this.error ? html`<div class="hint">${this.error}</div>` : null}
      </div>
    `
  }

  #onInput = (e: Event) => {
    const path = typeof e.composedPath === 'function' ? e.composedPath() : []
    const textarea = path.find(
      (n): n is HTMLTextAreaElement =>
        n instanceof HTMLTextAreaElement && n.dataset.action === 'json'
    )
    if (!textarea) return
    this.value = textarea.value
    this.error = ''
  }

  #onUiClick(e: Event) {
    const target = e.target as HTMLElement | null
    if (!target) return

    const btn = target.closest('ui-button') as HTMLElement | null
    if (!btn) return

    const action = btn.dataset.action
    if (action === 'export') {
      this.error = ''
      this.dispatchEvent(new DataExportEvent())
      return
    }

    if (action === 'import') {
      const json = (this.value ?? '').trim()
      if (!json) {
        this.error = 'Cole um JSON antes de importar.'
        return
      }

      this.error = ''
      this.dispatchEvent(new DataImportEvent({ json }))
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'data-panel': DataPanel
  }
}
