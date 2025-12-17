export abstract class AppEvent<T = unknown> extends CustomEvent<T> {
  constructor(
    type: string,
    detail: T,
    options?: {
      bubbles?: boolean
      composed?: boolean
      cancelable?: boolean
    }
  ) {
    super(type, {
      detail,
      bubbles: options?.bubbles ?? true,
      composed: options?.composed ?? true,
      cancelable: options?.cancelable ?? false,
    })
  }

  get payload(): T {
    return this.detail
  }
}
