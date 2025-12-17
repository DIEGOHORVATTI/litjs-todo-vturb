import { AppEvent } from './base.js'

export type ThemeMode = 'light' | 'dark'

export interface ThemeChangePayload {
  theme: ThemeMode
}

export class ThemeChangeEvent extends AppEvent<ThemeChangePayload> {
  static readonly eventName = 'theme:change' as const

  constructor(payload: ThemeChangePayload) {
    super(ThemeChangeEvent.eventName, payload)
  }
}

declare global {
  interface HTMLElementEventMap {
    [ThemeChangeEvent.eventName]: ThemeChangeEvent
  }
}
