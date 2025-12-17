import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators/custom-element.js'
import { property } from 'lit/decorators/property.js'

import { uiInputStyles } from './styles.css.js'

@customElement('ui-input')
export class UiInput extends LitElement {
  static override styles = uiInputStyles

  @property({ type: String }) placeholder = ''
  @property({ type: String }) value = ''

  override connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('input', this.#onInput)
    this.addEventListener('keydown', this.#onKeydown)
  }

  override disconnectedCallback(): void {
    this.removeEventListener('input', this.#onInput)
    this.removeEventListener('keydown', this.#onKeydown)
    super.disconnectedCallback()
  }

  override render() {
    return html`
      <input type="text" .value=${this.value} placeholder=${this.placeholder} data-action="input" />
    `
  }

  #onInput(e: Event) {
    const target = e.target as HTMLElement | null
    if (!target) return
    if (!(target instanceof HTMLInputElement)) return
    if (target.dataset.action !== 'input') return

    this.value = target.value
    this.dispatchEvent(new CustomEvent('ui-change', { detail: this.value }))
  }

  #onKeydown(e: KeyboardEvent) {
    const target = e.target as HTMLElement | null
    if (!target) return
    if (!(target instanceof HTMLInputElement)) return
    if (target.dataset.action !== 'input') return

    if (e.key === 'Enter') {
      this.dispatchEvent(new CustomEvent('ui-submit', { detail: this.value }))
    }
  }
}
