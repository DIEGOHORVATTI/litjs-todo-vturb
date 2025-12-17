import type { Project } from '../types/index.js'
import type { ProjectRepository } from '../models/project-repository.js'
import type { TodoStorage } from './todo-storage.js'

export class StorageProjectRepository implements ProjectRepository {
  constructor(private readonly storage: TodoStorage) {}

  async list(): Promise<Project[]> {
    return this.storage.read().projects
  }

  async add(project: Project): Promise<void> {
    const data = this.storage.read()
    this.storage.write({ ...data, projects: [...data.projects, project] })
  }

  async setSelectedProjectId(projectId: string): Promise<void> {
    const data = this.storage.read()
    this.storage.write({ ...data, selectedProjectId: projectId })
  }

  async getSelectedProjectId(): Promise<string> {
    return this.storage.read().selectedProjectId
  }
}
