import type { ProjectRepository } from '../models/project-repository.js'
import type { Project } from '../types/index.js'

interface IdGenerator {
  nextId(): string
}

type AddProjectInput = {
  name: string
}

export type ProjectUseCases = {
  loadProjects(): Promise<Project[]>
  addProject(input: AddProjectInput): Promise<Project>
  selectProject(projectId: string): Promise<string>
  getSelectedProjectId(): Promise<string>
}

type Props = {
  repo: ProjectRepository
  ids: IdGenerator
}

export function createProjectUseCases({ repo, ids }: Props): ProjectUseCases {
  return {
    async loadProjects() {
      return repo.list()
    },

    async addProject(input) {
      const name = input.name.trim()
      if (!name) throw new Error('project_name_required')

      const project: Project = {
        id: ids.nextId(),
        name,
      }

      await repo.add(project)

      return project
    },

    async selectProject(projectId) {
      const id = (projectId ?? '').trim()
      if (!id) throw new Error('project_id_required')
      await repo.setSelectedProjectId(id)
      return id
    },

    async getSelectedProjectId() {
      return repo.getSelectedProjectId()
    },
  }
}
