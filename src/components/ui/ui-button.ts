import { LitElement, html, css } from 'lit'
import { customElement } from 'lit/decorators/custom-element.js'
import { property } from 'lit/decorators/property.js'

@customElement('ui-button')
export class UiButton extends LitElement {
  static override styles = css`
    :host {
      display: inline-block;
    }
    button {
      margin: 0;
      padding: 0;
      border: 0;
      background: none;
      font-size: 100%;
      vertical-align: baseline;
      font-family: inherit;
      font-weight: inherit;
      color: inherit;
      appearance: none;
      -webkit-appearance: none;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      cursor: pointer;
    }
  `

  @property({ type: String }) label = ''

  override render() {
    return html`
      <button @click=${this.#onClick}>
        <slot>${this.label}</slot>
      </button>
    `
  }

  #onClick() {
    this.dispatchEvent(new CustomEvent('ui-click', { bubbles: true, composed: true }))
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-button': UiButton
  }
}
