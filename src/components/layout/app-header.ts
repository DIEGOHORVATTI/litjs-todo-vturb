import { LitElement, html, css } from 'lit'
import { customElement } from 'lit/decorators/custom-element.js'

@customElement('app-header')
export class AppHeader extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }
    h1 {
      position: absolute;
      top: -140px;
      width: 100%;
      font-size: 80px;
      font-weight: 200;
      text-align: center;
      color: #b83f45;
      -webkit-text-rendering: optimizeLegibility;
      -moz-text-rendering: optimizeLegibility;
      text-rendering: optimizeLegibility;
      margin: 0;
    }
    .header {
      position: relative;
    }
  `

  override render() {
    return html`
      <header class="header">
        <h1>todos</h1>
        <slot></slot>
      </header>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-header': AppHeader
  }
}
