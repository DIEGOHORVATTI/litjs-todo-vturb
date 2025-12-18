import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators/custom-element.js'
import { property } from 'lit/decorators/property.js'

import { uiInputStyles } from './styles.css.js'

@customElement('ui-input')
export class UiInput extends LitElement {
  static override styles = uiInputStyles

  @property({ type: String }) type: 'text' | 'date' | 'select' = 'text'

  @property({ type: String }) placeholder = ''
  @property({ type: String }) value = ''

  /**
   * Only used when type === 'select'.
   * Each option is rendered as <option value="value">label</option>.
   */
  @property({ type: Array }) options: Array<{ value: string; label: string }> = []

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
    if (this.type === 'select') {
      return html`
        <select data-action="select" .value=${this.value}>
          ${this.options.map((o) => html`<option value=${o.value}>${o.label}</option>`)}
        </select>
      `
    }

    return html`
      <input
        type=${this.type}
        .value=${this.value}
        .placeholder=${this.placeholder}
        data-action="input" />
    `
  }

  #onInput(e: Event) {
    const value = getValueFromEvent(e)
    if (value === null) return

    this.value = value
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
    const input = getInputTextFromEvent(e)
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

function getInputTextFromEvent(e: Event): HTMLInputElement | null {
  return getInputFromEvent(e)
}

function getSelectFromEvent(e: Event): HTMLSelectElement | null {
  const path = typeof e.composedPath === 'function' ? e.composedPath() : []
  for (const node of path) {
    if (node instanceof HTMLSelectElement && node.dataset.action === 'select') {
      return node
    }
  }
  return null
}

function getValueFromEvent(e: Event): string | null {
  const input = getInputFromEvent(e)
  if (input) return input.value
  const select = getSelectFromEvent(e)
  if (select) return select.value
  return null
}
