import type { TodoStorage } from '../../services/todo-storage.js'
import type { StorageData } from '../../types/index.js'

const DEFAULT_DATA: StorageData = {
  version: 'test',
  todos: [],
  projects: [],
  theme: 'light',
  selectedProjectId: 'all',
}

export class InMemoryTodoStorage implements TodoStorage {
  #data: StorageData

  constructor(seed?: Partial<StorageData>) {
    this.#data = {
      ...DEFAULT_DATA,
      ...(seed ?? {}),
      todos: seed?.todos ? [...seed.todos] : [],
      projects: seed?.projects ? [...seed.projects] : [],
    }
  }

  read(): StorageData {
    return {
      ...this.#data,
      todos: [...this.#data.todos],
      projects: [...this.#data.projects],
    }
  }

  write(data: StorageData): void {
    this.#data = {
      ...data,
      todos: [...data.todos],
      projects: [...data.projects],
    }
  }
}
