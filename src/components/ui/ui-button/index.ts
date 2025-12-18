import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators/custom-element.js'
import { property } from 'lit/decorators/property.js'

import { uiButtonStyles } from './styles.css.js'

@customElement('ui-button')
export class UiButton extends LitElement {
  static override styles = uiButtonStyles

  @property({ type: String }) label = ''

  override connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('click', this.#onClick)
  }

  override disconnectedCallback(): void {
    this.removeEventListener('click', this.#onClick)
    super.disconnectedCallback()
  }

  override render() {
    return html`
      <button data-action="click">
        <slot>${this.label}</slot>
      </button>
    `
  }

  #onClick(e: Event) {
    const path = typeof e.composedPath === 'function' ? e.composedPath() : []
    const btn = path.find(
      (n): n is HTMLButtonElement => n instanceof HTMLButtonElement && n.dataset.action === 'click'
    )
    if (!btn) return

    this.dispatchEvent(new CustomEvent('ui-click', { bubbles: true, composed: true }))
  }
}
