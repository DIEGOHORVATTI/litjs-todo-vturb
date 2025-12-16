import type { TodoEdit, Priority } from '../types/index.js'

export interface AddTodoPayload {
  title: string
  projectId: string
  priority: Priority
  dueDate?: string
}

export class AddTodoEvent extends Event {
  static readonly eventName = 'todo-add' as const

  readonly payload: AddTodoPayload

  constructor(payload: AddTodoPayload) {
    super(AddTodoEvent.eventName, { bubbles: true, composed: true })
    this.payload = payload
  }
}

export class DeleteTodoEvent extends Event {
  static readonly eventName = 'todo-delete' as const

  readonly id: string

  constructor(id: string) {
    super(DeleteTodoEvent.eventName, { bubbles: true, composed: true })
    this.id = id
  }
}

export class EditTodoEvent extends Event {
  static readonly eventName = 'todo-edit' as const

  readonly edit: TodoEdit

  constructor(edit: TodoEdit) {
    super(EditTodoEvent.eventName, { bubbles: true, composed: true })
    this.edit = edit
  }
}

export class ToggleAllTodoEvent extends Event {
  static readonly eventName = 'todo-toggle-all' as const

  constructor() {
    super(ToggleAllTodoEvent.eventName, { bubbles: true, composed: true })
  }
}

export class ClearCompletedEvent extends Event {
  static readonly eventName = 'clear-completed' as const

  constructor() {
    super(ClearCompletedEvent.eventName, { bubbles: true, composed: true })
  }
}

declare global {
  interface HTMLElementEventMap {
    [AddTodoEvent.eventName]: AddTodoEvent
    [DeleteTodoEvent.eventName]: DeleteTodoEvent
    [EditTodoEvent.eventName]: EditTodoEvent
    [ToggleAllTodoEvent.eventName]: ToggleAllTodoEvent
    [ClearCompletedEvent.eventName]: ClearCompletedEvent
  }
}
