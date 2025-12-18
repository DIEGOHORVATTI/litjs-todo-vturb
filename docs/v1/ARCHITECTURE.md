# Arquitetura TodoMVC+ com Lit (MVC)

## Visão Geral

Aplicação TodoMVC estendida (TodoMVC+) usando **Web Components + Lit**, com **Shadow DOM fechado** (mínimo no componente raiz) e **comunicação por eventos nativos** (`CustomEvent` + `addEventListener`).

### Princípios Arquiteturais

1. **Single Root Component**: Apenas `<todo-app>` é exposto no `index.html`
2. **Event-Driven Communication**: Comunicação exclusiva via `CustomEvent` + `addEventListener`
3. **Closed Shadow DOM**: Encapsulamento completo no componente principal
4. **Model owns state**: O estado vive em Models (não nos Views)
5. **Unidirectional Data Flow**: Props down, events up

---

## MVC no contexto do Lit

- **Model**: mantém estado e regras derivadas (ex.: `TodoModel`, `ThemeModel`). Não acessa DOM.
- **View**: Web Components (LitElements em `src/components/**`) renderizam a UI e disparam eventos.
- **Controller**: recebe eventos, chama serviços/repositórios e atualiza o Model (ex.: `TodoController`).

O `<todo-app>` continua sendo o **componente raiz** e serve como “shell” da View: ele registra listeners (via `addEventListener`) e delega as ações aos Controllers/Models (sem importar “domain/application/infrastructure”).

---

## Estrutura de Pastas (mental model)

- `src/views/`: composição e bootstrap do app.
- `src/components/**`: UI (emite eventos; sem persistência/efeitos).
- `src/events/**`: nomes/payloads tipados/centralizados.
- `src/controllers/**`: handlers de eventos (application).
- `src/models/**`: estado e regras derivadas.
- `src/services/**`: casos de uso, data IO e storage.
- `src/test/**`: testes Jest (regras + eventos).

---

## Decisões arquiteturais (resumo)

- **Eventos como contrato**: `scope:action` + `detail` tipado; evita acoplamento direto entre componentes (ver `EVENT_CONTRACT.md`).
- **Shadow DOM fechado no root**: impede dependência em DOM interno e força integração por eventos/API pública.
- **MVC pragmático**: controllers orquestram; services executam casos de uso/persistência; models mantêm estado.
- **Persistência e reidratação**: repos em localStorage; import/export via `DataIO` com validação.
- **Filtros via hash**: navegação simples (sem router) e fácil de testar.

---

## Tree (orientado a responsabilidades)

```text
docs/
	v1/
		ARCHITECTURE.md      # visão geral (este arquivo)
		DECISIONS.md         # ADRs e trade-offs
		EVENT_CONTRACT.md    # eventos + payloads + bubbles/composed
		TODO.md              # checklist do desafio

src/
	views/                 # bootstrap e composição do root
	components/            # Web Components (UI)
	events/                # tipos/nomes de eventos
	controllers/           # handlers de eventos
	models/                # estado/regras
	services/              # usecases + storage + data-io
	test/                  # Jest
```

## Diagrama de Componentes

```mermaid
flowchart TD
  Index[index.html] --> App[<todo-app> (root)]

  App --> Header[<app-header>]
  App --> ProjectPicker[<project-picker>]
  App --> ProjectForm[<project-form>]
  App --> TodoForm[<todo-form>]
  App --> TodoList[<todo-list>]
  TodoList --> TodoItem[<todo-item>]
  App --> TodoFooter[<todo-footer>]

  App --> DataPanel[<data-panel>]
  DataPanel --> DataPanelActions[<data-panel-actions>]

  App --> Controllers[Controllers]
  Controllers --> Services[Usecases/Services]
  Services --> Models[Models]
  Services --> Storage[(Storage/localStorage)]

```
