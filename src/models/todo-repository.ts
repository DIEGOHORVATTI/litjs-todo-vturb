import type { Todo, TodoEdit } from '../types/index.js'

export interface TodoRepository {
  list(): Promise<Todo[]>
  add(todo: Todo): Promise<void>
  update(edit: TodoEdit): Promise<void>
  remove(id: string): Promise<void>
  replaceAll(todos: Todo[]): Promise<void>
}
