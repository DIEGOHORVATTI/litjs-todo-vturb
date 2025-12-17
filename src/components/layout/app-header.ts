import { LitElement, html, css } from 'lit'
import { customElement } from 'lit/decorators/custom-element.js'

import '../ui/ui-toggle.js'
import { ThemeChangeEvent } from '../../events/theme-events.js'

@customElement('app-header')
export class AppHeader extends LitElement {
  static override styles = css`
    :host {
      display: block;
      position: relative;
    }
    h1 {
      position: absolute;
      top: -92px;
      width: 100%;
      font-size: 64px;
      font-weight: 250;
      letter-spacing: -0.03em;
      text-align: center;
      color: color-mix(in oklab, var(--color-text), var(--color-accent) 35%);
      -webkit-text-rendering: optimizeLegibility;
      -moz-text-rendering: optimizeLegibility;
      text-rendering: optimizeLegibility;
      margin: 0;
    }
    .header {
      position: relative;
      padding: var(--space-4);
      background: var(--color-surface);
    }

    .actions {
      position: absolute;
      top: var(--space-4);
      right: var(--space-4);
    }
  `

  override render() {
    return html`
      <header class="header">
        <h1>todos</h1>
        <div class="actions">
          <ui-toggle label="Dark" @ui-toggle=${this.#onThemeToggle}></ui-toggle>
        </div>
        <slot></slot>
      </header>
    `
  }

  #onThemeToggle(e: CustomEvent<boolean>) {
    const checked = e.detail
    this.dispatchEvent(new ThemeChangeEvent({ theme: checked ? 'dark' : 'light' }))
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-header': AppHeader
  }
}
