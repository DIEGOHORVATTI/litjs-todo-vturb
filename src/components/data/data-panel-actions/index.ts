import { css, html, LitElement } from 'lit'
import { customElement } from 'lit/decorators/custom-element.js'

import '../../ui/ui-button/index.js'

@customElement('data-panel-actions')
export class DataPanelActions extends LitElement {
  static override styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
    }
  `

  override connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('ui-click', this.#onUiClick as EventListener)
  }

  override disconnectedCallback(): void {
    this.removeEventListener('ui-click', this.#onUiClick as EventListener)
    super.disconnectedCallback()
  }

  override render() {
    return html`
      <ui-button data-action="export">Exportar</ui-button>
      <ui-button data-action="import">Importar</ui-button>
    `
  }

  #onUiClick(e: Event) {
    const directTarget = e.target
    const directSource =
      directTarget instanceof HTMLElement && directTarget.tagName.toLowerCase() === 'ui-button'
        ? directTarget
        : null

    const path = typeof e.composedPath === 'function' ? (e.composedPath() as unknown[]) : []

    const source =
      directSource ??
      path.find(
        (n): n is HTMLElement => n instanceof HTMLElement && n.tagName.toLowerCase() === 'ui-button'
      )

    if (!source) return

    const action = source.dataset.action
    if (action === 'export') {
      this.dispatchEvent(
        new CustomEvent('data-panel:toggle-export', { bubbles: true, composed: true })
      )
    }

    if (action === 'import') {
      this.dispatchEvent(
        new CustomEvent('data-panel:toggle-import', { bubbles: true, composed: true })
      )
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'data-panel-actions': DataPanelActions
  }
}
