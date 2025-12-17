import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators/custom-element.js'
import { property } from 'lit/decorators/property.js'

import { uiToggleStyles } from './styles.css.js'

@customElement('ui-toggle')
export class UiToggle extends LitElement {
  static override styles = uiToggleStyles

  @property({ type: Boolean, reflect: true }) checked = false

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
      <button
        type="button"
        role="switch"
        aria-checked=${this.checked ? 'true' : 'false'}
        data-action="toggle">
        <span class="thumb"></span>
      </button>
      ${this.label ? html`<span class="label">${this.label}</span>` : null}
    `
  }

  #onClick(e: Event) {
    const path = typeof e.composedPath === 'function' ? e.composedPath() : []
    const btn = path.find(
      (n): n is HTMLButtonElement => n instanceof HTMLButtonElement && n.dataset.action === 'toggle'
    )
    if (!btn) return
    this.#onToggle()
  }

  #onToggle() {
    this.checked = !this.checked
    this.dispatchEvent(
      new CustomEvent<boolean>('ui-toggle', {
        detail: this.checked,
        bubbles: true,
        composed: true,
      })
    )
  }
}
