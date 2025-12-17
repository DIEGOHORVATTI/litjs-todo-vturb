import { LitElement, html, css } from 'lit'
import { customElement } from 'lit/decorators/custom-element.js'
import { property } from 'lit/decorators/property.js'

/**
 * A simple accessible toggle/switch.
 *
 * Emits: 'ui-toggle' (detail: boolean)
 */
@customElement('ui-toggle')
export class UiToggle extends LitElement {
  static override styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      user-select: none;
    }

    button {
      all: unset;
      box-sizing: border-box;
      width: 44px;
      height: 26px;
      border-radius: 999px;
      background: var(--toggle-track, rgba(100, 116, 139, 0.35));
      border: 1px solid var(--color-border);
      display: inline-flex;
      align-items: center;
      padding: 2px;
      cursor: pointer;
      transition: background 160ms ease, border-color 160ms ease;
    }

    button[aria-checked='true'] {
      background: var(--color-accent);
      border-color: rgba(0, 0, 0, 0);
    }

    .thumb {
      width: 20px;
      height: 20px;
      border-radius: 999px;
      background: var(--color-surface);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.18);
      transform: translateX(0);
      transition: transform 160ms ease;
    }

    button[aria-checked='true'] .thumb {
      transform: translateX(18px);
    }

    .label {
      font-size: var(--text-sm);
      color: var(--color-muted);
      line-height: 1;
      white-space: nowrap;
    }
  `

  @property({ type: Boolean, reflect: true }) checked = false

  @property({ type: String }) label = ''

  override render() {
    return html`
      <button
        type="button"
        role="switch"
        aria-checked=${this.checked ? 'true' : 'false'}
        @click=${this.#onToggle}
      >
        <span class="thumb"></span>
      </button>
      ${this.label ? html`<span class="label">${this.label}</span>` : null}
    `
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

declare global {
  interface HTMLElementTagNameMap {
    'ui-toggle': UiToggle
  }
}
