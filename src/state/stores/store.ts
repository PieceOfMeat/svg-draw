import { produce } from 'immer'

type CBFunction<T> = (state: T) => void

class Store<T extends object> {
  state: T = {} as T

  listeners: Set<CBFunction<T>> = new Set()

  subscribe = (fn: CBFunction<T>) => {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  unsubscribe = (fn: CBFunction<T>) => {
    this.listeners.delete(fn)
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state))
  }

  action(fn: (draft: T) => void) {
    this.state = produce(this.state, fn)
    this.notify()
  }
}
export default Store
