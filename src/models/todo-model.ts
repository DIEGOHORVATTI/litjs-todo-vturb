import type { FilterMode, Todo } from '../types/index.js'

export class TodoModel {
  #todos: Todo[] = []
  #filter: FilterMode = 'all'

  get todos(): ReadonlyArray<Todo> {
    return this.#todos
  }

  get filter(): FilterMode {
    return this.#filter
  }

  setTodos(todos: Todo[]): void {
    this.#todos = [...todos]
  }

  addTodo(todo: Todo): void {
    this.#todos = [...this.#todos, todo]
  }

  updateTodo(id: string, patch: Partial<Todo>): void {
    this.#todos = this.#todos.map((t) => (t.id === id ? ({ ...t, ...patch } as Todo) : t))
  }

  removeTodo(id: string): void {
    this.#todos = this.#todos.filter((t) => t.id !== id)
  }

  setFilter(filter: FilterMode): void {
    this.#filter = filter
  }

  replaceAll(todos: Todo[]): void {
    this.#todos = [...todos]
  }

  getDerived() {
    const activeCount = this.#todos.filter((t) => !t.completed).length
    const completedCount = this.#todos.length - activeCount
    const allCompleted = this.#todos.length > 0 && completedCount === this.#todos.length

    return {
      activeCount,
      completedCount,
      allCompleted,
      filteredTodos: this.getFilteredTodos(),
    }
  }

  getFilteredTodos(): Todo[] {
    switch (this.#filter) {
      case 'active':
        return this.#todos.filter((t) => !t.completed)
      case 'completed':
        return this.#todos.filter((t) => t.completed)
      case 'overdue': {
        const now = new Date()
        return this.#todos.filter((t) => {
          if (t.completed) return false
          if (!t.dueDate) return false
          const due = new Date(t.dueDate)
          if (Number.isNaN(due.getTime())) return false
          return due.getTime() < now.getTime()
        })
      }
      default:
        return this.#todos
    }
  }
}
