import { createTodoUseCases } from '../application/todos/todo-usecases.js'
import {
  fixedClock,
  fixedIds,
  ISO_2020_01_01,
  ISO_2020_01_02,
  ISO_2020_01_03,
  todoA,
  todoACompleted,
  todoB,
  todoBCompleted,
  todoBUpdatedAt20200102,
  todoBuyMilk,
} from './mocks/index.js'
import { InMemoryTodoRepository } from './mocks/inmemory-todo-repository.js'

describe('todo use cases', () => {
  test('addTodo persists and returns the new todo', async () => {
    const repo = new InMemoryTodoRepository()
    const todos = createTodoUseCases({
      repo,
      clock: fixedClock(ISO_2020_01_01),
      ids: fixedIds('t1'),
    })

    const created = await todos.addTodo({ title: 'Buy milk', projectId: 'p1', priority: 'medium' })
    expect(created).toEqual(todoBuyMilk)

    await expect(todos.loadTodos()).resolves.toEqual([created])
  })

  test('updateTodo updates fields in repository', async () => {
    const repo = new InMemoryTodoRepository([todoA])
    const todos = createTodoUseCases({
      repo,
      clock: fixedClock(ISO_2020_01_02),
      ids: fixedIds(),
    })

    await todos.updateTodo({ id: 't1', changes: { title: 'B', completed: true } })

    await expect(todos.loadTodos()).resolves.toEqual([todoBUpdatedAt20200102])
  })

  test('removeTodo removes from repository', async () => {
    const repo = new InMemoryTodoRepository([todoA, todoB])
    const todos = createTodoUseCases({ repo, clock: fixedClock('x'), ids: fixedIds() })

    await todos.removeTodo('t1')

    await expect(todos.loadTodos()).resolves.toEqual([todoB])
  })

  test('toggleAll without input flips based on current state', async () => {
    const repo = new InMemoryTodoRepository([todoA, todoBCompleted])
    const todos = createTodoUseCases({
      repo,
      clock: fixedClock(ISO_2020_01_03),
      ids: fixedIds(),
    })

    const updated = await todos.toggleAll({})

    expect(updated.map((t) => t.completed)).toEqual([true, true])
    expect(updated.every((t) => t.updatedAt === ISO_2020_01_03)).toBe(true)
  })

  test('clearCompleted removes completed todos and returns remaining', async () => {
    const repo = new InMemoryTodoRepository([todoACompleted, todoB])
    const todos = createTodoUseCases({ repo, clock: fixedClock('x'), ids: fixedIds() })

    const remaining = await todos.clearCompleted()

    expect(remaining).toEqual([todoB])
    await expect(todos.loadTodos()).resolves.toEqual(remaining)
  })
})
