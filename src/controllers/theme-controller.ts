import type { ThemeMode } from '../events/theme-events.js'
import type { ThemeModel } from '../models/theme-model.js'

export class ThemeController {
  constructor(private readonly model: ThemeModel) {}

  setTheme(theme: ThemeMode): ThemeMode {
    this.model.setTheme(theme)
    return this.model.theme
  }
}
