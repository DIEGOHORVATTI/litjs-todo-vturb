import { z } from 'zod'

import type { StorageData } from '../types/index.js'

const ThemeSchema = z.enum(['light', 'dark', 'auto'])
const PrioritySchema = z.enum(['low', 'medium', 'high'])

const TodoSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    completed: z.boolean(),
    projectId: z.string(),
    priority: PrioritySchema,
    dueDate: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .strict()

const ProjectSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    color: z.string().optional(),
    icon: z.string().optional(),
  })
  .strict()

const StorageDataSchema = z
  .object({
    version: z.string(),
    todos: z.array(TodoSchema),
    projects: z.array(ProjectSchema),
    theme: ThemeSchema,
    selectedProjectId: z.string(),
    exportedAt: z.string().optional(),
  })
  .strict()

export function safeParseStorageData(json: string): StorageData | null {
  const parsedJson = JSON.parse(json)
  const result = StorageDataSchema.safeParse(parsedJson)
  if (!result.success) return null

  return result.data as StorageData
}
