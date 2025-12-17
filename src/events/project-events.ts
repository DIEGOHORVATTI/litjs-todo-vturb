import { AppEvent } from './base.js'

export interface AddProjectPayload {
  name: string
}

export class AddProjectEvent extends AppEvent<AddProjectPayload> {
  static readonly eventName = 'project:add' as const

  constructor(payload: AddProjectPayload) {
    super(AddProjectEvent.eventName, payload)
  }
}

export interface SelectProjectPayload {
  projectId: string
}

export class SelectProjectEvent extends AppEvent<SelectProjectPayload> {
  static readonly eventName = 'project:select' as const

  constructor(payload: SelectProjectPayload) {
    super(SelectProjectEvent.eventName, payload)
  }
}

declare global {
  interface HTMLElementEventMap {
    [AddProjectEvent.eventName]: AddProjectEvent
    [SelectProjectEvent.eventName]: SelectProjectEvent
  }
}
