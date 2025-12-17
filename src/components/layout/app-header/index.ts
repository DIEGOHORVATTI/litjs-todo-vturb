import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators/custom-element.js'

import { appHeaderStyles } from './styles.css.js'
import '../../ui/ui-toggle/index.js'
import { ThemeChangeEvent } from '../../../events/theme-events.js'

@customElement('app-header')
export class AppHeader extends LitElement {
  static override styles = appHeaderStyles

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
        <h1>todos</h1>
        <div class="actions">
          <ui-toggle label="Dark" data-action="theme"></ui-toggle>
        </div>
        <slot></slot>
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
