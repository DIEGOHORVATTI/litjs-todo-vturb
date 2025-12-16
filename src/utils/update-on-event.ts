import type { ReactiveElement } from 'lit'

interface ListenerCarryingElement extends ReactiveElement {
  __updateOnEventListener?: () => void
}

export const updateOnEvent =
  (eventName: string) => (target: ListenerCarryingElement, propertyKey: string) => {
    const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey)!

    const newDescriptor = {
      ...descriptor,
      set(this: ListenerCarryingElement, v: EventTarget) {
        const listener = (this.__updateOnEventListener ??= () => this.requestUpdate())
        const oldValue = descriptor.get!.call(this)
        oldValue?.removeEventListener?.(eventName, listener)
        v?.addEventListener?.(eventName, listener)

        return descriptor.set!.call(this, v)
      },
    }

    Object.defineProperty(target, propertyKey, newDescriptor)
  }
