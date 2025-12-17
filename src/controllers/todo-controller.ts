import type {
  AddTodoPayload,
  RemoveTodoPayload,
  ToggleAllTodoPayload,
  UpdateTodoPayload,
} from '../events/todo-events.js'
import type { TodoModel } from '../models/todo-model.js'
import type { AppServices } from '../services/app-services.js'
import type { Todo } from '../types/index.js'

export class TodoController {
  constructor(
    private readonly services: AppServices,
    private readonly model: TodoModel
  ) {}

  async hydrate(): Promise<ReadonlyArray<Todo>> {
    const todos = await this.services.todos.loadTodos()
    this.model.setTodos(todos)
    return this.model.todos
  }

  async addTodo(payload: AddTodoPayload): Promise<ReadonlyArray<Todo>> {
    const todo = await this.services.todos.addTodo(payload)
    this.model.addTodo(todo)
    return this.model.todos
  }

  async removeTodo(payload: RemoveTodoPayload): Promise<ReadonlyArray<Todo>> {
    await this.services.todos.removeTodo(payload.id)
    this.model.removeTodo(payload.id)
    return this.model.todos
  }

  async updateTodo(payload: UpdateTodoPayload): Promise<ReadonlyArray<Todo>> {
    await this.services.todos.updateTodo(payload)
    this.model.updateTodo(payload.id, payload.changes as Partial<Todo>)
    return this.model.todos
  }

  async toggleAll(payload: ToggleAllTodoPayload): Promise<ReadonlyArray<Todo>> {
    const input = payload.completed === undefined ? {} : { completed: payload.completed }
    const updated = await this.services.todos.toggleAll(input)
    this.model.replaceAll(updated)
    return this.model.todos
  }

  async clearCompleted(): Promise<ReadonlyArray<Todo>> {
    const updated = await this.services.todos.clearCompleted()
    this.model.replaceAll(updated)
    return this.model.todos
  }
}
