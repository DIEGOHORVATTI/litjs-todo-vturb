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
    // Listen at the host to avoid Lit template bindings, but only react when the real
    // <input> is the event target.
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
    // When listening on the host, the actual <input> will still be the event target.
    const evt = e as KeyboardEvent
    const input = getInputFromEvent(e)
    if (!input) return

    // Sync value eagerly so Enter always submits the latest content even if an
    // 'input' event hasn't fired in the expected order.
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
