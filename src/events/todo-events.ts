import { AppEvent } from './base.js'
import type { Priority } from '../types/index.js'

// ==================== TODO EVENTS ====================

/**
 * Event: todo:add
 * Emitted when user wants to add a new todo
 */
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

/**
 * Event: todo:toggle
 * Emitted when user toggles completion state of a todo
 */
export interface ToggleTodoPayload {
  id: string
}

export class ToggleTodoEvent extends AppEvent<ToggleTodoPayload> {
  static readonly eventName = 'todo:toggle' as const

  constructor(payload: ToggleTodoPayload) {
    super(ToggleTodoEvent.eventName, payload)
  }
}

/**
 * Event: todo:update
 * Emitted when user updates properties of a todo
 */
export interface UpdateTodoPayload {
  id: string
  changes: {
    title?: string
    priority?: Priority
    dueDate?: string
    projectId?: string
  }
}

export class UpdateTodoEvent extends AppEvent<UpdateTodoPayload> {
  static readonly eventName = 'todo:update' as const

  constructor(payload: UpdateTodoPayload) {
    super(UpdateTodoEvent.eventName, payload)
  }
}

/**
 * Event: todo:remove
 * Emitted when user wants to delete a todo
 */
export interface RemoveTodoPayload {
  id: string
}

export class RemoveTodoEvent extends AppEvent<RemoveTodoPayload> {
  static readonly eventName = 'todo:remove' as const

  constructor(payload: RemoveTodoPayload) {
    super(RemoveTodoEvent.eventName, payload, { cancelable: true })
  }
}

/**
 * Event: todo:toggle-all
 * Emitted when user wants to toggle all todos
 */
export interface ToggleAllTodoPayload {
  completed?: boolean
}

export class ToggleAllTodoEvent extends AppEvent<ToggleAllTodoPayload> {
  static readonly eventName = 'todo:toggle-all' as const

  constructor(payload: ToggleAllTodoPayload = {}) {
    super(ToggleAllTodoEvent.eventName, payload)
  }
}

/**
 * Event: todo:clear-completed
 * Emitted when user wants to clear all completed todos
 */
export class ClearCompletedEvent extends AppEvent<void> {
  static readonly eventName = 'todo:clear-completed' as const

  constructor() {
    super(ClearCompletedEvent.eventName, undefined, { cancelable: true })
  }
}

// ==================== TYPE AUGMENTATION ====================

declare global {
  interface HTMLElementEventMap {
    [AddTodoEvent.eventName]: AddTodoEvent
    [ToggleTodoEvent.eventName]: ToggleTodoEvent
    [UpdateTodoEvent.eventName]: UpdateTodoEvent
    [RemoveTodoEvent.eventName]: RemoveTodoEvent
    [ToggleAllTodoEvent.eventName]: ToggleAllTodoEvent
    [ClearCompletedEvent.eventName]: ClearCompletedEvent
  }
}
