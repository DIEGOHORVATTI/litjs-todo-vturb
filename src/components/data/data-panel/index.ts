import { html, LitElement } from 'lit'
import { property, state } from 'lit/decorators.js'
import { customElement } from 'lit/decorators/custom-element.js'

import { DataImportEvent } from '../../../events/data-events.js'
import { dataPanelStyles } from './styles.css.js'

import '../../ui/ui-button/index.js'

@customElement('data-panel')
export class DataPanel extends LitElement {
  static override styles = dataPanelStyles

  @property({ type: String }) value = ''

  @state() private error = ''
  @state() private mode: 'closed' | 'export' | 'import' = 'closed'

  override connectedCallback(): void {
    super.connectedCallback()

    this.addEventListener('input', this.#onInput)
    this.addEventListener('data-panel:open-import', this.#onOpenImport as EventListener)
  }

  override disconnectedCallback(): void {
    this.removeEventListener('input', this.#onInput)
    this.removeEventListener('data-panel:open-import', this.#onOpenImport as EventListener)
    super.disconnectedCallback()
  }

  override render() {
    return html`
      <div class="wrap">
        ${this.mode === 'closed'
          ? null
          : html`
              <textarea
                data-action="json"
                spellcheck="false"
                .value=${this.value}
                placeholder=${this.mode === 'import'
                  ? 'Cole aqui o JSON exportado e clique em "Importar"'
                  : 'JSON exportado (você pode copiar)'}></textarea>

              ${this.mode === 'import'
                ? html`<div class="row"><ui-button data-action="import">Importar</ui-button></div>`
                : null}
            `}
        ${this.error ? html`<div class="hint">${this.error}</div>` : null}
      </div>
    `
  }

  setJson(json: string) {
    console.log('[data-panel] setJson', { len: json?.length ?? 0 })
    this.openExport()
    this.value = json
    this.error = ''
  }

  openExport() {
    console.log('[data-panel] openExport')
    this.mode = 'export'
    this.error = ''
    this.addEventListener('ui-click', this.#onUiClick as EventListener)
  }

  openImport() {
    console.log('[data-panel] openImport')
    this.mode = 'import'
    this.error = ''
    this.addEventListener('ui-click', this.#onUiClick as EventListener)
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
    console.log('[data-panel] ui-click', { targetTag: (e.target as any)?.tagName })
    const path = typeof e.composedPath === 'function' ? (e.composedPath() as unknown[]) : []
    const directTarget = e.target
    const directSource =
      directTarget instanceof HTMLElement && directTarget.tagName.toLowerCase() === 'ui-button'
        ? directTarget
        : null

    const source =
      directSource ??
      path.find(
        (n): n is HTMLElement => n instanceof HTMLElement && n.tagName.toLowerCase() === 'ui-button'
      )
    if (!source) return

    const action = source.dataset.action
    if (action === 'import') {
      console.log('[data-panel] dispatch data:import', { len: (this.value ?? '').length })
      const json = (this.value ?? '').trim()
      if (!json) {
        this.error = 'Cole um JSON antes de importar.'
        return
      }

      this.error = ''
      this.dispatchEvent(new DataImportEvent({ json }))
    }
  }

  #onOpenImport() {
    console.log('[data-panel] received data-panel:open-import')
    this.openImport()
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'data-panel': DataPanel
  }
}
