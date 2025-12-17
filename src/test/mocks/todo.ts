import type { Todo } from '../../types/index.js'

export const makeTodo = (overrides: Partial<Todo> = {}): Todo => {
  return {
    id: 't1',
    title: 'Todo',
    completed: false,
    projectId: 'p1',
    priority: 'medium',
    createdAt: 'x',
    updatedAt: 'x',
    ...overrides,
  }
}
