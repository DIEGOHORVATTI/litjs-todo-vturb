import { LocalStorageTodoRepository } from './localstorage-todo-repository.js'
import { LocalStorageTodoStorage } from './localstorage-todo-storage.js'
import { createProjectUseCases } from './project-usecases.js'
import type { ProjectUseCases } from './project-usecases.js'
import { StorageProjectRepository } from './storage-project-repository.js'
import { createTodoUseCases } from './todo-usecases.js'
import type { TodoUseCases } from './todo-usecases.js'

export type Services = {
  todos: TodoUseCases
  projects: ProjectUseCases
}

export function createServices(): Services {
  const storage = new LocalStorageTodoStorage()
  const repo = new LocalStorageTodoRepository()
  const projectRepo = new StorageProjectRepository(storage)

  const ids = {
    nextId: () => String(Date.now()),
  }

  const clock = {
    nowISO: () => new Date().toISOString(),
  }

  return {
    todos: createTodoUseCases({ repo, ids, clock }),
    projects: createProjectUseCases({ repo: projectRepo, ids }),
  }
}
