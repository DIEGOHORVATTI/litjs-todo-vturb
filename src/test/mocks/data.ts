export const storageDataJsonValid = JSON.stringify({
  version: '1',
  selectedProjectId: 'all',
  theme: 'dark',
  projects: [{ id: 'p1', name: 'Pessoal' }],
  todos: [
    {
      id: 't1',
      title: 'Comprar leite',
      completed: false,
      projectId: 'p1',
      priority: 'high',
      dueDate: '2025-12-18',
      createdAt: '2025-12-18T10:00:00.000Z',
      updatedAt: '2025-12-18T10:00:00.000Z',
    },
  ],
  exportedAt: '2025-12-18T12:00:00.000Z',
})

export const storageDataJsonMissingArrays = JSON.stringify({
  version: '1',
  selectedProjectId: 'all',
  theme: 'light',
})

export const storageDataJsonInvalidPriority = JSON.stringify({
  version: '1',
  selectedProjectId: 'all',
  theme: 'light',
  projects: [{ id: 'p1', name: 'Pessoal' }],
  todos: [
    {
      id: 't1',
      title: 'X',
      completed: false,
      projectId: 'p1',
      priority: 'urgent',
      createdAt: '2025-12-18T10:00:00.000Z',
      updatedAt: '2025-12-18T10:00:00.000Z',
    },
  ],
})
