import { ISO_2020_01_01, ISO_2020_01_02 } from './time.js'
import { makeTodo } from './todo.js'

export const todoBuyMilk = makeTodo({
  id: 't1',
  title: 'Buy milk',
  completed: false,
  projectId: 'p1',
  priority: 'medium',
  createdAt: ISO_2020_01_01,
  updatedAt: ISO_2020_01_01,
})

export const todoA = makeTodo({ id: 't1', title: 'A' })
export const todoB = makeTodo({ id: 't2', title: 'B' })

export const todoACompleted = makeTodo({ id: 't1', title: 'A', completed: true })
export const todoBCompleted = makeTodo({ id: 't2', title: 'B', completed: true })

export const todoBUpdatedAt20200102 = makeTodo({
  id: 't1',
  title: 'B',
  completed: true,
  updatedAt: ISO_2020_01_02,
})
