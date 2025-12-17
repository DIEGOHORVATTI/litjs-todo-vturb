import type { TodoUseCases } from './todo-usecases.js'
import type { ProjectUseCases } from './project-usecases.js'

export type AppServices = {
  todos: TodoUseCases
  projects: ProjectUseCases
}
