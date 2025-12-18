import type { ProjectUseCases } from './project-usecases.js'
import type { TodoUseCases } from './todo-usecases.js'

export type AppServices = {
  todos: TodoUseCases
  projects: ProjectUseCases
}
