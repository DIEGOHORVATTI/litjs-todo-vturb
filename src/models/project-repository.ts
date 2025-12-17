import type { Project } from '../types/index.js'

export interface ProjectRepository {
  list(): Promise<Project[]>
  add(project: Project): Promise<void>
  setSelectedProjectId(projectId: string): Promise<void>
  getSelectedProjectId(): Promise<string>
}
