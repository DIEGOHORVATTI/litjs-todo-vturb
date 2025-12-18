import { StorageTodoRepository } from '../services/storage-todo-repository.js'
import { createTodoUseCases } from '../services/todo-usecases.js'
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
import { InMemoryTodoStorage } from './mocks/inmemory-todo-storage.js'

describe('casos de uso de todo', () => {
  test('addTodo persiste e retorna o novo todo', async () => {
    const repo = new StorageTodoRepository(new InMemoryTodoStorage())
    const todos = createTodoUseCases({
      repo,
      clock: fixedClock(ISO_2020_01_01),
      ids: fixedIds('t1'),
    })

    const created = await todos.addTodo({
      title: todoBuyMilk.title,
      projectId: todoBuyMilk.projectId,
      priority: todoBuyMilk.priority,
    })
    expect(created).toEqual(todoBuyMilk)

    await expect(todos.loadTodos()).resolves.toEqual([created])
  })

  test('addTodo faz trim no título antes de persistir', async () => {
    const repo = new StorageTodoRepository(new InMemoryTodoStorage())
    const todos = createTodoUseCases({
      repo,
      clock: fixedClock(ISO_2020_01_01),
      ids: fixedIds('t1'),
    })

    const created = await todos.addTodo({
      title: `  ${todoBuyMilk.title}  `,
      projectId: todoBuyMilk.projectId,
      priority: todoBuyMilk.priority,
    })

    expect(created.title).toBe(todoBuyMilk.title)
    await expect(todos.loadTodos()).resolves.toEqual([created])
  })

  test('addTodo rejeita título vazio após trim', async () => {
    const repo = new StorageTodoRepository(new InMemoryTodoStorage())
    const todos = createTodoUseCases({
      repo,
      clock: fixedClock(ISO_2020_01_01),
      ids: fixedIds('t1'),
    })

    await expect(
      todos.addTodo({
        title: '   ',
        projectId: todoBuyMilk.projectId,
        priority: todoBuyMilk.priority,
      })
    ).rejects.toThrow('title_required')

    await expect(todos.loadTodos()).resolves.toEqual([])
  })

  test('updateTodo atualiza os campos no repositório', async () => {
    const repo = new StorageTodoRepository(new InMemoryTodoStorage({ todos: [todoA] }))
    const todos = createTodoUseCases({
      repo,
      clock: fixedClock(ISO_2020_01_02),
      ids: fixedIds(),
    })

    await todos.updateTodo({
      id: todoA.id,
      changes: { title: todoB.title, completed: true },
    })

    await expect(todos.loadTodos()).resolves.toEqual([todoBUpdatedAt20200102])
  })

  test('updateTodo exige id', async () => {
    const repo = new StorageTodoRepository(new InMemoryTodoStorage({ todos: [todoA] }))
    const todos = createTodoUseCases({ repo, clock: fixedClock('x'), ids: fixedIds() })

    await expect(todos.updateTodo({ id: '', changes: { title: todoB.title } })).rejects.toThrow(
      'id_required'
    )
  })

  test('removeTodo remove o todo do repositório', async () => {
    const repo = new StorageTodoRepository(new InMemoryTodoStorage({ todos: [todoA, todoB] }))
    const todos = createTodoUseCases({ repo, clock: fixedClock('x'), ids: fixedIds() })

    await todos.removeTodo(todoA.id)

    await expect(todos.loadTodos()).resolves.toEqual([todoB])
  })

  test('removeTodo exige id', async () => {
    const repo = new StorageTodoRepository(new InMemoryTodoStorage({ todos: [todoA] }))
    const todos = createTodoUseCases({ repo, clock: fixedClock('x'), ids: fixedIds() })

    await expect(todos.removeTodo('')).rejects.toThrow('id_required')
  })

  test('toggleAll sem entrada alterna com base no estado atual', async () => {
    const repo = new StorageTodoRepository(
      new InMemoryTodoStorage({ todos: [todoA, todoBCompleted] })
    )
    const todos = createTodoUseCases({
      repo,
      clock: fixedClock(ISO_2020_01_03),
      ids: fixedIds(),
    })

    const updated = await todos.toggleAll({})

    expect(updated.map((t) => t.completed)).toEqual([true, true])
    expect(updated.every((t) => t.updatedAt === ISO_2020_01_03)).toBe(true)
  })

  test('toggleAll com completed=false marca todos como não concluídos', async () => {
    const repo = new StorageTodoRepository(
      new InMemoryTodoStorage({ todos: [todoACompleted, todoBCompleted] })
    )
    const todos = createTodoUseCases({
      repo,
      clock: fixedClock(ISO_2020_01_03),
      ids: fixedIds(),
    })

    const updated = await todos.toggleAll({ completed: false })

    expect(updated.map((t) => t.completed)).toEqual([false, false])
    expect(updated.every((t) => t.updatedAt === ISO_2020_01_03)).toBe(true)
    await expect(todos.loadTodos()).resolves.toEqual(updated)
  })

  test('clearCompleted remove os todos concluídos e retorna os restantes', async () => {
    const repo = new StorageTodoRepository(
      new InMemoryTodoStorage({ todos: [todoACompleted, todoB] })
    )
    const todos = createTodoUseCases({ repo, clock: fixedClock('x'), ids: fixedIds() })

    const remaining = await todos.clearCompleted()

    expect(remaining).toEqual([todoB])
    await expect(todos.loadTodos()).resolves.toEqual(remaining)
  })
})
