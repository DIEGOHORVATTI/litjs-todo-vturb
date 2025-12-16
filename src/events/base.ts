/**
 * Base class for all custom events in the application.
 *
 * All events are configured to:
 * - bubble: true (propagate up the DOM tree)
 * - composed: true (cross Shadow DOM boundaries)
 * - cancelable: false by default (can be overridden)
 */
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

  /**
   * Convenient getter to access the event payload
   */
  get payload(): T {
    return this.detail
  }
}
