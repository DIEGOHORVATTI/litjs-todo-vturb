import type { StorageData } from '../types/index.js'

export interface TodoStorage {
  read(): StorageData
  write(data: StorageData): void
}
