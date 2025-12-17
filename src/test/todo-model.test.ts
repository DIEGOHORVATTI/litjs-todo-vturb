import { TodoModel } from '../models/todo-model.js'
import { makeTodo } from './mocks/todo.js'

describe('TodoModel', () => {
  test('filtro overdue retorna apenas não concluídos com dueDate no passado', () => {
    const model = new TodoModel()

    model.setTodos([
      makeTodo({ id: 't1', completed: false, dueDate: '2020-01-01T00:00:00.000Z' }),
      makeTodo({ id: 't2', completed: true, dueDate: '2020-01-01T00:00:00.000Z' }),
      makeTodo({ id: 't3', completed: false }),
      makeTodo({ id: 't4', completed: false, dueDate: 'invalid-date' }),
      makeTodo({ id: 't5', completed: false, dueDate: '2999-01-01T00:00:00.000Z' }),
    ])

    jest.useFakeTimers()
    jest.setSystemTime(new Date('2020-01-02T00:00:00.000Z'))

    model.setFilter('overdue')

    const ids = model.getFilteredTodos().map((t) => t.id)
    expect(ids).toEqual(['t1'])

    jest.useRealTimers()
  })
})
