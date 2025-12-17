import { css, html, LitElement } from 'lit'
import { customElement } from 'lit/decorators/custom-element.js'
import { state } from 'lit/decorators/state.js'
import { classMap } from 'lit/directives/class-map.js'

import { todoStyles } from '../components/todo/shared/styles/todo.css.js'
import { ProjectController } from '../controllers/project-controller.js'
import { ThemeController } from '../controllers/theme-controller.js'
import { TodoController } from '../controllers/todo-controller.js'
import { ThemeModel } from '../models/theme-model.js'
import { TodoModel } from '../models/todo-model.js'
import { createServices } from '../services/create-services.js'
import { CONSTANTS } from '../shared/constants/config.js'
import { baseStyles } from '../styles/base.css.js'
import { tokens } from '../styles/tokens.css.js'
import type { FilterMode, Project, Todo } from '../types/index.js'

import '../components/layout/app-header/index.js'
import '../components/todo/todo-list/index.js'
import '../components/todo/todo-form/index.js'
import '../components/todo/todo-footer/index.js'
import '../components/ui/ui-toggle/index.js'
import '../components/projects/project-picker/index.js'
import '../components/projects/project-form/index.js'
import '../components/data/data-panel/index.js'

import { AddProjectEvent, SelectProjectEvent } from '../events/project-events.js'
import { DataExportEvent, DataImportEvent } from '../events/data-events.js'
import { ThemeChangeEvent } from '../events/theme-events.js'
import {
  AddTodoEvent,
  ClearCompletedEvent,
  RemoveTodoEvent,
  ToggleAllTodoEvent,
  UpdateTodoEvent,
} from '../events/todo-events.js'
import { updateOnEvent } from '../utils/update-on-event.js'

@customElement('todo-app')
export class TodoApp extends LitElement {
  static override shadowRootOptions: ShadowRootInit = { mode: 'closed' }

  static override styles = [
    tokens,
    baseStyles,
    todoStyles,
    css`
      :host {
        display: block;
        margin: 96px auto var(--space-6) auto;
        border-radius: var(--radius-lg);
        background: var(--color-bg);
      }

      section {
        width: 800px;
        margin: 0 auto;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-2);
        overflow: hidden;
      }

      main {
        position: relative;
        z-index: 2;
        border-top: 1px solid var(--color-border);
        background: var(--color-surface);
      }

      .theme-row {
        display: flex;
        justify-content: flex-end;
        padding: var(--space-3) var(--space-4);
        border-top: 1px solid var(--color-border);
        background: var(--color-surface);
        border-bottom-left-radius: var(--radius-lg);
        border-bottom-right-radius: var(--radius-lg);
      }

      .hidden {
        display: none;
      }

      .projects-row {
        padding: var(--space-3) var(--space-4);
        display: grid;
        grid-template-columns: 320px 1fr;
        gap: var(--space-4);
        align-items: end;
        border-bottom: 1px solid var(--color-border);
        background: var(--color-surface);
      }

      @media (max-width: 860px) {
        section {
          width: calc(100% - 24px);
        }

        .projects-row {
          grid-template-columns: 1fr;
        }
      }
    `,
  ]

  @updateOnEvent('change')
  @state()
  private todos: Todo[] = []

  @state()
  private filter: FilterMode = 'all'

  @state()
  private projects: Project[] = []

  @state()
  private selectedProjectId: string = 'all'

  @state()
  private theme: 'light' | 'dark' = 'light'

  #services = createServices()
  #todoModel = new TodoModel()
  #themeModel = new ThemeModel()
  #todoController = new TodoController(this.#services, this.#todoModel)
  #themeController = new ThemeController(this.#themeModel)
  #projectController = new ProjectController(this.#services)

  constructor() {
    super()

    this.addEventListener(AddTodoEvent.eventName, this.#onAddTodo)
    this.addEventListener(RemoveTodoEvent.eventName, this.#onRemoveTodo)
    this.addEventListener(UpdateTodoEvent.eventName, this.#onUpdateTodo)
    this.addEventListener(ToggleAllTodoEvent.eventName, this.#onToggleAll)
    this.addEventListener(ClearCompletedEvent.eventName, this.#onClearCompleted)

    this.addEventListener('todo-filter:selected', this.#onFilterSelected as EventListener)

    this.addEventListener(AddProjectEvent.eventName, this.#onAddProject)
    this.addEventListener(SelectProjectEvent.eventName, this.#onSelectProject)

  this.addEventListener(DataExportEvent.eventName, this.#onDataExport)
  this.addEventListener(DataImportEvent.eventName, this.#onDataImport)

    this.addEventListener(ThemeChangeEvent.eventName, this.#onThemeChange)

    this.addEventListener('ui-toggle', this.#onUiThemeToggle as EventListener)
  }

  #onUiThemeToggle(e: Event) {
    const evt = e as CustomEvent<{ checked: boolean; source?: HTMLElement }>
    const path = typeof e.composedPath === 'function' ? e.composedPath() : []
    const toggle = path.find(
      (n): n is HTMLElement => n instanceof HTMLElement && n.tagName.toLowerCase() === 'ui-toggle'
    )

    const source = (toggle ?? evt.detail?.source) as HTMLElement | null

    if (!source) {
      return
    }

    if (source.dataset.action !== 'theme') {
      return
    }

    const checked = evt.detail?.checked
    if (typeof checked !== 'boolean') return
    this.dispatchEvent(new ThemeChangeEvent({ theme: checked ? 'dark' : 'light' }))
  }

  #onHashChange = () => {
    const next = parseFilterFromHash(window.location.hash)
    this.#setFilter(next, { updateHash: false })
  }

  #onFilterSelected(e: Event) {
    const evt = e as CustomEvent<{ filter: FilterMode }>
    const next = evt.detail?.filter ?? 'all'
    this.#setFilter(next, { updateHash: true })
  }

  #setFilter(next: FilterMode, opts: { updateHash: boolean }) {
    this.filter = next
    this.#todoModel.setFilter(next)

    if (opts.updateHash) {
      const desired = `#${next}`

      if (window.location.hash !== desired) {
        window.location.hash = desired
      }
    }

    this.requestUpdate()
  }

  override connectedCallback(): void {
    super.connectedCallback()

    this.#hydrateTodos()
    this.#hydrateProjects()

    window.addEventListener('hashchange', this.#onHashChange)
    this.#onHashChange()

    // Theme is persisted inside the main app state (STATE_KEY).
    const raw = window.localStorage.getItem(CONSTANTS.LOCAL_STORAGE_KEYS.STATE_KEY)
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { theme?: unknown }
        const stored = parsed.theme
        if (stored === 'dark' || stored === 'light') {
          this.theme = stored
          this.#themeModel.setTheme(stored)
        }
      } catch {
        // ignore
      }
    }
    this.dataset.theme = this.theme
  }

  override disconnectedCallback(): void {
    window.removeEventListener('hashchange', this.#onHashChange)
    super.disconnectedCallback()
  }

  override render() {
    const filteredTodos = this.#filteredTodos()
    const activeCount = this.todos.filter((t) => !t.completed).length
    const completedCount = this.todos.length - activeCount
    const allCompleted = this.todos.length > 0 && completedCount === this.todos.length

    return html`
      <section>
        <app-header class="hidden"></app-header>

        <div class="projects-row">
          <project-picker
            .projects=${this.projects}
            .selectedProjectId=${this.selectedProjectId}></project-picker>
          <project-form></project-form>
        </div>

        <main class="main">
          <todo-list class="show-priority" .todos=${filteredTodos} .allCompleted=${allCompleted}>
            <todo-form slot="new-todo" .projectId=${this.selectedProjectId}></todo-form>
          </todo-list>
        </main>

        <todo-footer
          class="${classMap({
            hidden: this.todos.length === 0,
          })}"
          .activeCount=${activeCount}
          .completedCount=${completedCount}
          .filter=${this.filter}></todo-footer>

        <div
          class="${classMap({
            hidden: this.todos.length === 0,
            'theme-row': true,
          })}">
          <ui-toggle label="Dark" .checked=${this.theme === 'dark'} data-action="theme"></ui-toggle>
        </div>

        <data-panel></data-panel>
      </section>
    `
  }

  #onDataExport(_e: DataExportEvent) {
    const data = this.#snapshotState({ includeExportedAt: true })
    const json = JSON.stringify(data, null, 2)

    // Put JSON into panel textarea if open.
    const panel = this.shadowRoot?.querySelector('data-panel') as any
    const textarea = panel?.shadowRoot?.querySelector('textarea[data-action="json"]') as
      | HTMLTextAreaElement
      | undefined

    if (textarea) {
      textarea.value = json
      // Keep internal state in sync.
      panel.value = json
    }

    // Trigger a download.
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `todomvc-plus-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  #onDataImport(e: DataImportEvent) {
    const raw = (e.payload?.json ?? '').trim()
    if (!raw) return

    const parsed = safeParseStorageData(raw)
    if (!parsed) return

    window.localStorage.setItem(CONSTANTS.LOCAL_STORAGE_KEYS.STATE_KEY, JSON.stringify(parsed))

    // Apply to UI state and re-render.
    this.todos = [...parsed.todos]
    this.projects = [...parsed.projects]
    this.selectedProjectId = parsed.selectedProjectId ?? 'all'
    if (parsed.theme === 'dark' || parsed.theme === 'light') {
      this.theme = parsed.theme
      this.dataset.theme = this.theme
    }

    this.requestUpdate()
  }

  #snapshotState(opts: { includeExportedAt: boolean }) {
    const raw = window.localStorage.getItem(CONSTANTS.LOCAL_STORAGE_KEYS.STATE_KEY)
    let base: any = {}
    if (raw) {
      try {
        base = JSON.parse(raw)
      } catch {
        base = {}
      }
    }

    const snapshot = {
      version: base.version ?? CONSTANTS.STORAGE_DEFAULTS.VERSION,
      todos: [...this.todos],
      projects: [...this.projects],
      theme: this.theme,
      selectedProjectId: this.selectedProjectId,
      ...(opts.includeExportedAt ? { exportedAt: new Date().toISOString() } : {}),
    }

    // Persist snapshot, keeping app state consistent.
    window.localStorage.setItem(CONSTANTS.LOCAL_STORAGE_KEYS.STATE_KEY, JSON.stringify(snapshot))
    return snapshot
  }

  #onAddTodo(e: AddTodoEvent) {
    void this.#todoController.addTodo(e.payload).then(() => {
      this.todos = [...this.#todoModel.todos]
      this.requestUpdate()
    })
  }

  #onRemoveTodo(e: RemoveTodoEvent) {
    if (e.defaultPrevented) return
    void this.#todoController.removeTodo(e.payload).then(() => {
      this.todos = [...this.#todoModel.todos]
      this.requestUpdate()
    })
  }

  #onUpdateTodo(e: UpdateTodoEvent) {
    void this.#todoController.updateTodo(e.payload).then(() => {
      this.todos = [...this.#todoModel.todos]
      this.requestUpdate()
    })
  }

  #onToggleAll(e: ToggleAllTodoEvent) {
    void this.#todoController.toggleAll(e.payload).then(() => {
      this.todos = [...this.#todoModel.todos]
      this.requestUpdate()
    })
  }

  #onClearCompleted(e: ClearCompletedEvent) {
    if (e.defaultPrevented) return
    void this.#todoController.clearCompleted().then(() => {
      this.todos = [...this.#todoModel.todos]
      this.requestUpdate()
    })
  }

  #onThemeChange(e: ThemeChangeEvent) {
    this.theme = this.#themeController.setTheme(e.payload.theme)
    this.dataset.theme = this.theme

    // Persist theme inside the main app state object.
    const raw = window.localStorage.getItem(CONSTANTS.LOCAL_STORAGE_KEYS.STATE_KEY)
    if (!raw) {
      window.localStorage.setItem(
        CONSTANTS.LOCAL_STORAGE_KEYS.STATE_KEY,
        JSON.stringify({
          version: CONSTANTS.STORAGE_DEFAULTS.VERSION,
          todos: [],
          projects: [],
          selectedProjectId: CONSTANTS.STORAGE_DEFAULTS.SELECTED_PROJECT_ID,
          theme: this.theme,
        })
      )
      return
    }

    try {
      const parsed = JSON.parse(raw) as any
      window.localStorage.setItem(
        CONSTANTS.LOCAL_STORAGE_KEYS.STATE_KEY,
        JSON.stringify({ ...parsed, theme: this.theme })
      )
    } catch {
      // If state is corrupted, rewrite a minimal valid state.
      window.localStorage.setItem(
        CONSTANTS.LOCAL_STORAGE_KEYS.STATE_KEY,
        JSON.stringify({
          version: CONSTANTS.STORAGE_DEFAULTS.VERSION,
          todos: [],
          projects: [],
          selectedProjectId: CONSTANTS.STORAGE_DEFAULTS.SELECTED_PROJECT_ID,
          theme: this.theme,
        })
      )
    }
  }

  async #hydrateTodos() {
    await this.#todoController.hydrate()
    this.todos = [...this.#todoModel.todos]
    this.requestUpdate()
  }

  async #hydrateProjects() {
    const { projects, selectedProjectId } = await this.#projectController.hydrate()
    this.projects = projects
    this.selectedProjectId = selectedProjectId || 'all'
    this.requestUpdate()
  }

  #filteredTodos(): Todo[] {
    this.#todoModel.setTodos(this.todos)
    this.#todoModel.setFilter(this.filter)

    const byFilter = this.#todoModel.getFilteredTodos()
    if (this.selectedProjectId === 'all') return byFilter
    return byFilter.filter((t) => t.projectId === this.selectedProjectId)
  }

  #onAddProject(e: AddProjectEvent) {
    void this.#projectController.addProject(e.payload).then((projects) => {
      this.projects = projects
      this.requestUpdate()
    })
  }

  #onSelectProject(e: SelectProjectEvent) {
    void this.#projectController.selectProject(e.payload).then((selectedProjectId) => {
      this.selectedProjectId = selectedProjectId
      this.requestUpdate()
    })
  }
}

function safeParseStorageData(json: string):
  | {
      version: string
      todos: any[]
      projects: any[]
      theme: any
      selectedProjectId: string
      exportedAt?: string
    }
  | null {
  try {
    const data = JSON.parse(json) as any
    if (!data || typeof data !== 'object') return null
    if (!Array.isArray(data.todos) || !Array.isArray(data.projects)) return null
    if (typeof data.selectedProjectId !== 'string') return null
    if (typeof data.version !== 'string') return null

    // Minimal todo shape validation
    for (const t of data.todos) {
      if (!t || typeof t !== 'object') return null
      if (typeof t.id !== 'string') return null
      if (typeof t.title !== 'string') return null
      if (typeof t.completed !== 'boolean') return null
      if (typeof t.projectId !== 'string') return null
      if (t.priority !== 'low' && t.priority !== 'medium' && t.priority !== 'high') return null
      if (t.dueDate !== undefined && typeof t.dueDate !== 'string') return null
      if (typeof t.createdAt !== 'string' || typeof t.updatedAt !== 'string') return null
    }

    for (const p of data.projects) {
      if (!p || typeof p !== 'object') return null
      if (typeof p.id !== 'string' || typeof p.name !== 'string') return null
    }

    // Theme
    const theme = data.theme
    if (theme !== 'light' && theme !== 'dark' && theme !== 'auto') return null

    return {
      version: data.version,
      todos: data.todos,
      projects: data.projects,
      theme: data.theme,
      selectedProjectId: data.selectedProjectId,
      ...(typeof data.exportedAt === 'string' ? { exportedAt: data.exportedAt } : {}),
    }
  } catch {
    return null
  }
}

function parseFilterFromHash(hash: string): FilterMode {
  const raw = (hash ?? '').replace(/^#\/?/, '').trim().toLowerCase()
  if (raw === 'active' || raw === 'completed' || raw === 'all' || raw === 'overdue') return raw
  return 'all'
}

declare global {
  interface HTMLElementTagNameMap {
    'todo-app': TodoApp
  }
}
