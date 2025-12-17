import type { TodoRepository } from '../models/todo-repository.js'
import type { Todo, TodoEdit } from '../types/index.js'
import { LocalStorageTodoStorage } from './localstorage-todo-storage.js'
import { StorageTodoRepository } from './storage-todo-repository.js'

/**
 * Wrapper de compatibilidade: mantém o nome/export atual,
 * mas delega para a implementação única baseada em storage.
 */
export class LocalStorageTodoRepository implements TodoRepository {
  readonly #repo: StorageTodoRepository

  constructor() {
    this.#repo = new StorageTodoRepository(new LocalStorageTodoStorage())
  }

  async list(): Promise<Todo[]> {
    return this.#repo.list()
  }

  async add(todo: Todo): Promise<void> {
    return this.#repo.add(todo)
  }

  async update(edit: TodoEdit): Promise<void> {
    return this.#repo.update(edit)
  }

  async remove(id: string): Promise<void> {
    return this.#repo.remove(id)
  }

  async replaceAll(todos: Todo[]): Promise<void> {
    return this.#repo.replaceAll(todos)
  }
}
