import { CONSTANTS } from '../../shared/constants/config.js'
import type { StorageData } from '../../types/index.js'

export default function write(data: StorageData) {
  window.localStorage.setItem(CONSTANTS.LOCAL_STORAGE_KEYS.STATE_KEY, JSON.stringify(data))
}
