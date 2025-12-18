# Contrato de Eventos - TodoMVC+ com Lit

Este documento define **formalmente todos os eventos customizados** usados na aplicação, seus payloads, propriedades de propagação e contratos de uso.

---

## Regras gerais

- **Canal único de comunicação entre componentes**: `CustomEvent` + `addEventListener`.
- **Naming**: `scope:action` (ex.: `todo:add`, `project:select`).
- **Shadow DOM**:
  - Se o evento precisa “atravessar” a fronteira do Shadow DOM (ou ser observado no host), ele **deve** ser disparado com `bubbles: true` e `composed: true`.
  - Se o evento é estritamente interno (pai/filho dentro do mesmo shadow), `composed` pode ser `false`.
- **detail tipado**: todo evento com payload deve expor `detail` com shape estável.
- **Sem handlers via template** entre componentes (evitar `@click=${...}` para wiring cross-component).

---

## Tabela de eventos

> Convenção de coluna: `B` = bubbles, `C` = composed.

| Evento                 | Origem típica          |                                                                                        `detail` |  B  |  C  | Observações                                                         |
| ---------------------- | ---------------------- | ----------------------------------------------------------------------------------------------: | :-: | :-: | ------------------------------------------------------------------- |
| `todo:add`             | `<todo-form>`          | `{ title: string; projectId: string; priority: 'low' \| 'medium' \| 'high'; dueDate?: string }` | ✅  | ✅  | Cria um novo todo. `dueDate` em ISO (`YYYY-MM-DD` ou ISO completo). |
| `todo:toggle`          | `<todo-item>`          |                                                                                `{ id: string }` | ✅  | ✅  | Alterna `completed`.                                                |
| `todo:update`          | `<todo-item>`          |                                                          `{ id: string; patch: Partial<Todo> }` | ✅  | ✅  | Atualização parcial (título, prioridade, dueDate, projectId...).    |
| `todo:remove`          | `<todo-item>`          |                                                                                `{ id: string }` | ✅  | ✅  | Remove um todo.                                                     |
| `todo:toggle-all`      | `<todo-footer>`        |                                                                        `{ completed: boolean }` | ✅  | ✅  | Marca/desmarca todos.                                               |
| `todo:clear-completed` | `<todo-footer>`        |                                                                                            `{}` | ✅  | ✅  | Remove todos concluídos.                                            |
| `project:add`          | `<project-form>`       |                                                                              `{ name: string }` | ✅  | ✅  | Cria projeto (id é gerado no domínio/usecase).                      |
| `project:select`       | `<project-picker>`     |                                                                 `{ projectId: string \| null }` | ✅  | ✅  | `null` representa “All Projects”.                                   |
| `project:update`       | UI de projetos         |                                                       `{ id: string; patch: Partial<Project> }` | ✅  | ✅  | Renomear/alterar cor/ícone.                                         |
| `project:remove`       | UI de projetos         |                                                 `{ id: string; moveTodosToProjectId?: string }` | ✅  | ✅  | Se mover não for informado, controlador decide default.             |
| `filter:change`        | UI (tabs/hash)         |                                     `{ filter: 'all' \| 'active' \| 'completed' \| 'overdue' }` | ✅  | ✅  | Usado junto com hash (`#/active`, etc.).                            |
| `theme:change`         | `<ui-toggle>` / header |                                                 `{ theme: 'light' \| 'dark'; source?: string }` | ✅  | ✅  | Alterna tema via CSS Variables.                                     |
| `data:export`          | `<data-panel-actions>` |                                                                                            `{}` | ✅  | ✅  | Solicita export do estado.                                          |
| `data:import`          | `<data-panel-actions>` |                                                  `{ json: string; mode: 'merge' \| 'replace' }` | ✅  | ✅  | Importa JSON; validação ocorre em `DataIO`.                         |
| `data:import-error`    | serviços/controlador   |                                                          `{ message: string; cause?: unknown }` | ✅  | ✅  | Notifica falha de validação/parsing.                                |

---

## Contratos de erro e validação

- **Import**: JSON inválido ou schema incompatível deve resultar em `data:import-error`.
- **IDs**: `id` é sempre `string` (gerado no domínio/usecase).
- **Datas**: `dueDate` deve ser interpretado em UTC/ISO; UI pode normalizar para `YYYY-MM-DD`.
