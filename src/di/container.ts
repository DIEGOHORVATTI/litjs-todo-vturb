import { createTodoUseCases, type TodoUseCases } from '../application/todos/todo-usecases.js'
import { LocalStorageTodoRepository } from '../infrastructure/storage/localstorage-todo-repository.js'

export function createContainer(): TodoUseCases {
  const repo = new LocalStorageTodoRepository()

  const ids = {
    nextId: () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
  }

  const clock = {
    nowISO: () => new Date().toISOString(),
  }

  const todos = createTodoUseCases({ repo, ids, clock })

  return todos
}
