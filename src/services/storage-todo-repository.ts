import type { TodoRepository } from '../models/todo-repository.js'
import type { Todo, TodoEdit } from '../types/index.js'
import type { TodoStorage } from './todo-storage.js'

export class StorageTodoRepository implements TodoRepository {
  constructor(private readonly storage: TodoStorage) {}

  async list(): Promise<Todo[]> {
    return this.storage.read().todos
  }

  async add(todo: Todo): Promise<void> {
    const data = this.storage.read()
    this.storage.write({ ...data, todos: [...data.todos, todo] })
  }

  async update(edit: TodoEdit): Promise<void> {
    const data = this.storage.read()
    const todos = data.todos.map((t: Todo) => (t.id === edit.id ? ({ ...t, ...edit } as Todo) : t))
    this.storage.write({ ...data, todos })
  }

  async remove(id: string): Promise<void> {
    const data = this.storage.read()
    this.storage.write({ ...data, todos: data.todos.filter((t: Todo) => t.id !== id) })
  }

  async replaceAll(todos: Todo[]): Promise<void> {
    const data = this.storage.read()
    this.storage.write({ ...data, todos })
  }
}
