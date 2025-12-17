import type { TodoRepository } from '../../domain/todos/todo-repository.js'
import type { Priority, Todo, TodoEdit } from '../../types/index.js'

interface Clock {
  nowISO(): string
}

interface IdGenerator {
  nextId(): string
}

type AddTodoInput = {
  title: string
  projectId: string
  priority: Priority
  dueDate?: string
}

type UpdateTodoInput = {
  id: string
  changes: Omit<TodoEdit, 'id'>
}

type ToggleAllInput = {
  completed?: boolean
}

type TodoUseCases = {
  loadTodos(): Promise<Todo[]>
  addTodo(input: AddTodoInput): Promise<Todo>
  updateTodo(input: UpdateTodoInput): Promise<void>
  removeTodo(id: string): Promise<void>
  toggleAll(input: ToggleAllInput): Promise<Todo[]>
  clearCompleted(): Promise<Todo[]>
}

type Props = {
  repo: TodoRepository
  ids: IdGenerator
  clock: Clock
}

export function createTodoUseCases({ repo, ids, clock }: Props): TodoUseCases {
  return {
    async loadTodos() {
      return repo.list()
    },

    async addTodo(input) {
      const title = input.title.trim()
      if (!title) throw new Error('title_required')

      const now = clock.nowISO()
      const todo: Todo = {
        id: ids.nextId(),
        title,
        completed: false,
        projectId: input.projectId,
        priority: input.priority,
        ...(input.dueDate ? { dueDate: input.dueDate } : {}),
        createdAt: now,
        updatedAt: now,
      }

      await repo.add(todo)

      return todo
    },

    async updateTodo(input) {
      if (!input.id) throw new Error('id_required')

      await repo.update({ id: input.id, ...input.changes, updatedAt: clock.nowISO() })
    },

    async removeTodo(id) {
      if (!id) throw new Error('id_required')

      await repo.remove(id)
    },

    async toggleAll(input) {
      const todos = await repo.list()
      const allCompleted = todos.length > 0 && todos.every((t) => t.completed)
      const shouldComplete = input.completed ?? !allCompleted
      const updated = todos.map((t) => ({
        ...t,
        completed: shouldComplete,
        updatedAt: clock.nowISO(),
      }))
      await repo.replaceAll(updated)

      return updated
    },

    async clearCompleted() {
      const todos = await repo.list()
      const updated = todos.filter((t) => !t.completed)
      await repo.replaceAll(updated)

      return updated
    },
  }
}
