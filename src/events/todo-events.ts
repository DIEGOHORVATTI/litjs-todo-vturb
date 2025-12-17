import type { Priority, TodoEdit } from '../types/index.js'
import { AppEvent } from './base.js'

export interface AddTodoPayload {
  title: string
  projectId: string
  priority: Priority
  dueDate?: string
}

export class AddTodoEvent extends AppEvent<AddTodoPayload> {
  static readonly eventName = 'todo:add' as const

  constructor(payload: AddTodoPayload) {
    super(AddTodoEvent.eventName, payload)
  }
}

export interface RemoveTodoPayload {
  id: string
}

export class RemoveTodoEvent extends AppEvent<RemoveTodoPayload> {
  static readonly eventName = 'todo:remove' as const

  constructor(payload: RemoveTodoPayload) {
    super(RemoveTodoEvent.eventName, payload, { cancelable: true })
  }
}

export interface UpdateTodoPayload {
  id: string
  changes: Omit<TodoEdit, 'id'>
}

export class UpdateTodoEvent extends AppEvent<UpdateTodoPayload> {
  static readonly eventName = 'todo:update' as const

  constructor(payload: UpdateTodoPayload) {
    super(UpdateTodoEvent.eventName, payload)
  }
}

export interface ToggleAllTodoPayload {
  completed?: boolean
}

export class ToggleAllTodoEvent extends AppEvent<ToggleAllTodoPayload> {
  static readonly eventName = 'todo:toggle-all' as const

  constructor(payload: ToggleAllTodoPayload = {}) {
    super(ToggleAllTodoEvent.eventName, payload)
  }
}

export class ClearCompletedEvent extends AppEvent<void> {
  static readonly eventName = 'todo:clear-completed' as const

  constructor() {
    super(ClearCompletedEvent.eventName, undefined, { cancelable: true })
  }
}

declare global {
  interface HTMLElementEventMap {
    [AddTodoEvent.eventName]: AddTodoEvent
    [RemoveTodoEvent.eventName]: RemoveTodoEvent
    [UpdateTodoEvent.eventName]: UpdateTodoEvent
    [ToggleAllTodoEvent.eventName]: ToggleAllTodoEvent
    [ClearCompletedEvent.eventName]: ClearCompletedEvent
  }
}
