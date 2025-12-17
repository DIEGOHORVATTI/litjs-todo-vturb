import type { AddProjectPayload, SelectProjectPayload } from '../events/project-events.js'
import type { AppServices } from '../services/app-services.js'
import type { Project } from '../types/index.js'

export class ProjectController {
  constructor(private readonly services: AppServices) {}

  async hydrate(): Promise<{ projects: Project[]; selectedProjectId: string }> {
    const projects = await this.services.projects.loadProjects()
    const selectedProjectId = await this.services.projects.getSelectedProjectId()
    return { projects, selectedProjectId }
  }

  async addProject(payload: AddProjectPayload): Promise<Project[]> {
    await this.services.projects.addProject({ name: payload.name })
    return this.services.projects.loadProjects()
  }

  async selectProject(payload: SelectProjectPayload): Promise<string> {
    return this.services.projects.selectProject(payload.projectId)
  }
}
