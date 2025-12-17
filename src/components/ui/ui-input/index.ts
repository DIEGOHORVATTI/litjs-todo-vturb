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
    this.addEventListener('keydown', this.#onKeydown as EventListener)
  }

  override disconnectedCallback(): void {
    this.removeEventListener('input', this.#onInput)
    this.removeEventListener('keydown', this.#onKeydown)
    super.disconnectedCallback()
  }

  override render() {
    return html`
      <input
        type="text"
        .value=${this.value}
        .placeholder=${this.placeholder}
        data-action="input" />
    `
  }

  #onInput(e: Event) {
    const input = getInputFromEvent(e)
    if (!input) return

    this.value = input.value
    this.dispatchEvent(
      new CustomEvent('ui-change', {
        detail: this.value,
        bubbles: true,
        composed: true,
      })
    )
  }

  #onKeydown(e: Event) {
    const evt = e as KeyboardEvent
    const input = getInputFromEvent(e)
    if (!input) return

    this.value = input.value

    if (evt.key === 'Enter') {
      this.dispatchEvent(
        new CustomEvent('ui-submit', {
          detail: this.value,
          bubbles: true,
          composed: true,
        })
      )
    }
  }
}

function getInputFromEvent(e: Event): HTMLInputElement | null {
  const path = typeof e.composedPath === 'function' ? e.composedPath() : []
  for (const node of path) {
    if (node instanceof HTMLInputElement && node.dataset.action === 'input') {
      return node
    }
  }
  return null
}
