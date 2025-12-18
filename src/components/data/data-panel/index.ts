import { html, LitElement } from 'lit'
import { property, state } from 'lit/decorators.js'
import { customElement } from 'lit/decorators/custom-element.js'

import { DataExportEvent, DataImportEvent } from '../../../events/data-events.js'
import { dataPanelStyles } from './styles.css.js'

import '../../ui/ui-button/index.js'

@customElement('data-panel')
export class DataPanel extends LitElement {
  static override styles = dataPanelStyles

  /**
   * Current JSON text.
   * Note: this is intentionally *not* reactive to parent changes; parent may set it directly.
   */
  @property({ type: String }) value = ''

  @state() private error = ''
  @state() private mode: 'closed' | 'export' | 'import' = 'closed'

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

        ${this.mode === 'closed'
          ? null
          : html`
              <textarea
                data-action="json"
                spellcheck="false"
                placeholder=${this.mode === 'import'
                  ? 'Cole aqui o JSON exportado e clique em "Importar"'
                  : 'JSON exportado (você pode copiar)'}>
${this.value}</textarea
              >
            `}
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
    const btn = e.target as HTMLElement | null
    if (!btn || btn.tagName.toLowerCase() !== 'ui-button') return

    const action = btn.dataset.action
    if (action === 'export') {
      this.mode = 'export'
      this.error = ''

      void this.updateComplete.then(() => {
        this.dispatchEvent(new DataExportEvent())
      })
      return
    }

    if (action === 'import') {
      this.mode = 'import'
      this.error = ''

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
