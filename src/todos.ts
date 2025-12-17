import type { Todo, FilterMode as TodoFilter, TodoEdit } from './types/index.js'
import type { AddTodoPayload } from './events/todo-events.js'

let urlAlphabet = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'
function nanoid(size = 21) {
  let id = ''
  let i = size
  while (i--) {
    id += urlAlphabet[(Math.random() * 64) | 0]
  }
  return id
}

const todoFilters = ['all', 'active', 'completed'] as const
function isTodoFilter(value: string | undefined): value is TodoFilter {
  return todoFilters.includes(value as any)
}

export class Todos extends EventTarget {
  #todos: Array<Todo> = []
  #filter: TodoFilter = this.#filterFromUrl()

  get all(): ReadonlyArray<Todo> {
    return this.#todos
  }

  get active(): ReadonlyArray<Todo> {
    return this.#todos.filter((todo) => !todo.completed)
  }

  get completed(): ReadonlyArray<Todo> {
    return this.#todos.filter((todo) => todo.completed)
  }

  get allCompleted(): boolean {
    return this.#todos.length > 0 && this.#todos.every((todo) => todo.completed)
  }

  connect() {
    window.addEventListener('hashchange', this.#onHashChange)
  }

  disconnect() {
    window.removeEventListener('hashchange', this.#onHashChange)
  }

  filtered() {
    switch (this.#filter) {
      case 'active':
        return this.active
      case 'completed':
        return this.completed
    }
    return this.all
  }

  #notifyChange() {
    this.dispatchEvent(new Event('change'))
  }

  add(payload: AddTodoPayload) {
    const now = new Date().toISOString()
    const newTodo: Todo = {
      id: nanoid(),
      title: payload.title,
      completed: false,
      projectId: payload.projectId,
      priority: payload.priority,
      createdAt: now,
      updatedAt: now,
      ...(payload.dueDate ? { dueDate: payload.dueDate } : {}),
    }
    this.#todos.push(newTodo)
    this.#notifyChange()
  }

  remove(id: string) {
    const index = this.#todos.findIndex((todo) => todo.id === id)
    if (index !== -1) {
      this.#todos.splice(index, 1)
      this.#notifyChange()
    }
  }

  update(edit: TodoEdit) {
    const todo = this.#todos.find((todo) => todo.id === edit.id)

    if (todo === undefined) return

    const { id, ...changes } = edit
    Object.assign(todo, changes, { updatedAt: new Date().toISOString() })
    this.#notifyChange()
  }

  toggle(id: string) {
    const todo = this.#todos.find((todo) => todo.id === id)
    if (todo === undefined) return

    todo.completed = !todo.completed
    todo.updatedAt = new Date().toISOString()
    this.#notifyChange()
  }

  toggleAll(completed?: boolean) {
    const shouldComplete = completed ?? !this.allCompleted

    this.#todos = this.#todos.map((todo) => ({
      ...todo,
      completed: shouldComplete,
      updatedAt: new Date().toISOString(),
    }))
    this.#notifyChange()
  }

  clearCompleted() {
    this.#todos = this.active as Todo[]
    this.#notifyChange()
  }

  get filter(): TodoFilter {
    return this.#filter
  }

  set filter(filter: TodoFilter) {
    this.#filter = filter
    this.#notifyChange()
  }

  #onHashChange = () => {
    this.filter = this.#filterFromUrl()
  }

  #filterFromUrl(): TodoFilter {
    let filter = /#\/(.*)/.exec(window.location.hash)?.[1]
    if (isTodoFilter(filter)) return filter as TodoFilter

    return 'all'
  }
}
