import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators/custom-element.js'

import { appHeaderStyles } from './styles.css.js'

import '../../ui/ui-toggle/index.js'

import { ThemeChangeEvent } from '../../../events/theme-events.js'

@customElement('app-header')
export class AppHeader extends LitElement {
  static override styles = appHeaderStyles

  override firstUpdated(): void {
    const app = this.closest('todo-app') as HTMLElement | null
    const isDark = app?.dataset.theme === 'dark'
    const toggle = this.shadowRoot?.querySelector('ui-toggle[data-action="theme"]') as any
    if (toggle) toggle.checked = isDark
  }

  override connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('ui-toggle', this.#onUiToggle as EventListener)
  }

  override disconnectedCallback(): void {
    this.removeEventListener('ui-toggle', this.#onUiToggle as EventListener)
    super.disconnectedCallback()
  }

  override render() {
    return html`
      <header class="header">
        <div class="top-row">
          <ui-toggle label="Dark" data-action="theme"></ui-toggle>
        </div>

        <div class="content-row">
          <slot></slot>
        </div>
      </header>
    `
  }

  #onUiToggle(e: Event) {
    const evt = e as CustomEvent<boolean>
    const target = e.target as HTMLElement | null
    if (!target) return
    if (target.tagName.toLowerCase() !== 'ui-toggle') return
    if (target.dataset.action !== 'theme') return

    const checked = evt.detail
    this.dispatchEvent(new ThemeChangeEvent({ theme: checked ? 'dark' : 'light' }))
  }
}
