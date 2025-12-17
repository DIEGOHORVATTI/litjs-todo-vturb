import { AppEvent } from './base.js'

export class DataExportEvent extends AppEvent<void> {
  static readonly eventName = 'data:export' as const

  constructor() {
    super(DataExportEvent.eventName, undefined)
  }
}

export interface DataImportPayload {
  json: string
}

export class DataImportEvent extends AppEvent<DataImportPayload> {
  static readonly eventName = 'data:import' as const

  constructor(payload: DataImportPayload) {
    super(DataImportEvent.eventName, payload)
  }
}

declare global {
  interface HTMLElementEventMap {
    [DataExportEvent.eventName]: DataExportEvent
    [DataImportEvent.eventName]: DataImportEvent
  }
}
