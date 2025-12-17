import type { Todo, TodoEdit } from '../../types/index.js'
import type { TodoRepository } from '../../domain/todos/todo-repository.js'

export class InMemoryTodoRepository implements TodoRepository {
  #todos: Todo[]

  constructor(seed: Todo[] = []) {
    this.#todos = [...seed]
  }

  async list(): Promise<Todo[]> {
    return [...this.#todos]
  }

  async add(todo: Todo): Promise<void> {
    this.#todos = [...this.#todos, todo]
  }

  async update(edit: TodoEdit): Promise<void> {
    this.#todos = this.#todos.map((t) => (t.id === edit.id ? ({ ...t, ...edit } as Todo) : t))
  }

  async remove(id: string): Promise<void> {
    this.#todos = this.#todos.filter((t) => t.id !== id)
  }

  async replaceAll(todos: Todo[]): Promise<void> {
    this.#todos = [...todos]
  }
}
