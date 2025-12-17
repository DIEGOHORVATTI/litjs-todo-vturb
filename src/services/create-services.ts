import { LocalStorageTodoRepository } from './localstorage-todo-repository.js'
import { createTodoUseCases } from './todo-usecases.js'
import type { TodoUseCases } from './todo-usecases.js'

export type Services = {
  todos: TodoUseCases
}

export function createServices(): Services {
  const repo = new LocalStorageTodoRepository()

  const ids = {
    nextId: () => String(Date.now()),
  }

  const clock = {
    nowISO: () => new Date().toISOString(),
  }

  return {
    todos: createTodoUseCases({ repo, ids, clock }),
  }
}
