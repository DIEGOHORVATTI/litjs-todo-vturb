export interface Todo {
  id: string
  title: string
  completed: boolean
  projectId: string
  priority: Priority
  dueDate?: string
  createdAt: string
  updatedAt: string
}

export type Priority = 'low' | 'medium' | 'high'

export type TodoEdit = Partial<Omit<Todo, 'id' | 'createdAt'>> & {
  id: string
}

export interface Project {
  id: string
  name: string
  color?: string
  icon?: string
}

export type FilterMode = 'all' | 'active' | 'completed' | 'overdue'

export type Theme = 'light' | 'dark' | 'auto'

export interface AppState {
  todos: Todo[]
  projects: Project[]

  selectedProjectId: string
  filterMode: FilterMode

  theme: Theme
}

export interface StorageData {
  version: string
  todos: Todo[]
  projects: Project[]
  theme: Theme
  selectedProjectId: string
  exportedAt?: string
}
