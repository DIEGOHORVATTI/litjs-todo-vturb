import { CONSTANTS } from '../shared/constants/config.js'
import type { StorageData } from '../types/index.js'
import type { TodoStorage } from './todo-storage.js'

function defaults(): StorageData {
  return {
    version: CONSTANTS.STORAGE_DEFAULTS.VERSION,
    todos: [],
    projects: [],
    theme: CONSTANTS.STORAGE_DEFAULTS.THEME,
    selectedProjectId: CONSTANTS.STORAGE_DEFAULTS.SELECTED_PROJECT_ID,
  }
}

export class LocalStorageTodoStorage implements TodoStorage {
  read(): StorageData {
    const raw = window.localStorage.getItem(CONSTANTS.LOCAL_STORAGE_KEYS.STATE_KEY)

    if (!raw) return defaults()

    try {
      const parsed = JSON.parse(raw) as Partial<StorageData>

      return {
        version: parsed.version ?? CONSTANTS.STORAGE_DEFAULTS.VERSION,
        todos: parsed.todos ?? [],
        projects: parsed.projects ?? [],
        theme: parsed.theme ?? CONSTANTS.STORAGE_DEFAULTS.THEME,
        selectedProjectId:
          parsed.selectedProjectId ?? CONSTANTS.STORAGE_DEFAULTS.SELECTED_PROJECT_ID,
        ...(parsed.exportedAt ? { exportedAt: parsed.exportedAt } : {}),
      }
    } catch {
      return defaults()
    }
  }

  write(data: StorageData): void {
    window.localStorage.setItem(CONSTANTS.LOCAL_STORAGE_KEYS.STATE_KEY, JSON.stringify(data))
  }
}
