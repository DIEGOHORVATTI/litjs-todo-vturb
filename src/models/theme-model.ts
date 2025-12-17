import type { ThemeMode } from '../events/theme-events.js'

export class ThemeModel {
  #theme: ThemeMode = 'light'

  get theme(): ThemeMode {
    return this.#theme
  }

  setTheme(theme: ThemeMode): void {
    this.#theme = theme
  }
}
