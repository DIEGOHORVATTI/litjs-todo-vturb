import { CONSTANTS } from '../../../shared/constants/config.js'
import type { StorageData } from '../../../types/index.js'

export default function read(): StorageData {
  const raw = window.localStorage.getItem(CONSTANTS.LOCAL_STORAGE_KEYS.STATE_KEY)

  if (!raw) {
    return {
      version: CONSTANTS.STORAGE_DEFAULTS.VERSION,
      todos: [],
      projects: [],
      theme: CONSTANTS.STORAGE_DEFAULTS.THEME,
      selectedProjectId: CONSTANTS.STORAGE_DEFAULTS.SELECTED_PROJECT_ID,
    }
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StorageData>

    return {
      version: parsed.version ?? CONSTANTS.STORAGE_DEFAULTS.VERSION,
      todos: parsed.todos ?? [],
      projects: parsed.projects ?? [],
      theme: parsed.theme ?? CONSTANTS.STORAGE_DEFAULTS.THEME,
      selectedProjectId: parsed.selectedProjectId ?? CONSTANTS.STORAGE_DEFAULTS.SELECTED_PROJECT_ID,
      ...(parsed.exportedAt ? { exportedAt: parsed.exportedAt } : {}),
    }
  } catch {
    return {
      version: CONSTANTS.STORAGE_DEFAULTS.VERSION,
      todos: [],
      projects: [],
      theme: CONSTANTS.STORAGE_DEFAULTS.THEME,
      selectedProjectId: CONSTANTS.STORAGE_DEFAULTS.SELECTED_PROJECT_ID,
    }
  }
}
