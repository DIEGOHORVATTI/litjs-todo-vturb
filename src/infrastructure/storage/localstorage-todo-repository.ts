import type { StorageData, Todo, TodoEdit } from '../../types/index.js'
import type { TodoRepository } from '../../domain/todos/todo-repository.js'

const STORAGE_KEY = 'todomvc-plus'

function read(): StorageData {
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return {
      version: '1',
      todos: [],
      projects: [],
      theme: 'auto',
      selectedProjectId: 'inbox',
    }
  }
  try {
    const parsed = JSON.parse(raw) as Partial<StorageData>
    return {
      version: parsed.version ?? '1',
      todos: parsed.todos ?? [],
      projects: parsed.projects ?? [],
      theme: parsed.theme ?? 'auto',
      selectedProjectId: parsed.selectedProjectId ?? 'inbox',
      ...(parsed.exportedAt ? { exportedAt: parsed.exportedAt } : {}),
    }
  } catch {
    return {
      version: '1',
      todos: [],
      projects: [],
      theme: 'auto',
      selectedProjectId: 'inbox',
    }
  }
}

function write(data: StorageData) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export class LocalStorageTodoRepository implements TodoRepository {
  async list(): Promise<Todo[]> {
    return read().todos
  }

  async add(todo: Todo): Promise<void> {
    const data = read()
    write({ ...data, todos: [...data.todos, todo] })
  }

  async update(edit: TodoEdit): Promise<void> {
    const data = read()
    const todos = data.todos.map((t) => (t.id === edit.id ? ({ ...t, ...edit } as Todo) : t))
    write({ ...data, todos })
  }

  async remove(id: string): Promise<void> {
    const data = read()
    write({ ...data, todos: data.todos.filter((t) => t.id !== id) })
  }

  async replaceAll(todos: Todo[]): Promise<void> {
    const data = read()
    write({ ...data, todos })
  }
}
