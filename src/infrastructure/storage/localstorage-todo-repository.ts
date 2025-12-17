import type { TodoRepository } from '../../domain/todos/todo-repository.js'
import type { Todo, TodoEdit } from '../../types/index.js'
import read from './shared/read.js'
import write from './shared/write.js'

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
