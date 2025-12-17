# Desafio — Web Components com Lit (base: TodoMVC)

### Instalação e Desenvolvimento

```bash
# Instalar dependências
npm install

# Rodar servidor de desenvolvimento
npm run dev
```

⸻

Este desafio avalia sua habilidade com **JavaScript moderno + Web Components + Lit**, com foco em **componentização**, **estado**, **eventos nativos** (via `addEventListener`), **estilização com CSS Variables**, **Shadow DOM fechado** e **testes com Jest**.

Base obrigatória (starter):

```txt
# web version example:
https://todomvc.com/examples/lit/dist/

# source code:
https://github.com/tastejs/todomvc/blob/gh-pages/examples/lit
```

Você pode copiar esse exemplo para o seu repositório (ou trabalhar via fork) e evoluir a solução a partir dele.

⸻

## Objetivo

Evoluir o TodoMVC (Lit) para uma versão “TodoMVC+” com novas features e uma arquitetura componentizada.

### Tempo esperado

A solução deve ser possível em aproximadamente 2 dias.

⸻

### Requisitos técnicos (obrigatórios)

1. Web Components + Lit
   - Implementar usando Lit.
   - Os componentes devem ser Web Components reais (custom elements).

2. Apenas 1 componente “principal”
   - Deve existir apenas 1 componente raiz (ex.: <todo-app>), usado no index.html.
   - Todos os demais componentes devem ser usados apenas dentro do componente principal (direta ou indiretamente).

3. Eventos nativos com addEventListener
   - A comunicação entre componentes deve acontecer via CustomEvent + addEventListener.
   - Não use a sintaxe de binding de eventos do template do Lit (ex.: @click=${...}) para “colar” handlers.
   - Os listeners devem ser registrados/removidos corretamente (ex.: connectedCallback/disconnectedCallback ou firstUpdated + cleanup).
   - Eventos que precisam atravessar a fronteira do Shadow DOM devem usar bubbles: true e composed: true. ￼

4. Estado (state) e re-render
   - Deve existir estado inicial, updates, e re-render coerente.
   - Use o mecanismo reativo do Lit (propriedades reativas/estado interno) ou justifique uma alternativa. ￼

5. Estilo + CSS Variables
   - Estilos encapsulados por componente.
   - Uso real de CSS Custom Properties (variáveis) para permitir tema/customização.

6. Shadow DOM “bloqueado” (fechado)
   - O Shadow DOM deve ser closed no(s) componente(s) do desafio (no mínimo no componente principal).
   - Em Lit, isso pode ser feito por shadowRootOptions (ex.: { mode: 'closed' }). ￼

7. Testes com Jest
   - Implementar testes com Jest cobrindo regras de negócio e interação por eventos.
   - Configurar ambiente DOM (ex.: testEnvironment). ￼

8. Documentação e rastreabilidade de decisões
   - README com instruções de rodar/build/test.
   - Um arquivo de decisões (ex.: DECISIONS.md ou /docs/adr/) explicando escolhas e trade-offs.

## Escopo funcional do “TodoMVC+” (implementar)

Implemente todas as funcionalidades abaixo:

1. Projetos (Projects)
   - Criar/selecionar um “projeto” (ex.: “Pessoal”, “Trabalho”).
   - Cada todo pertence a um projeto.
   - Filtrar a lista pelo projeto selecionado.

2. Prioridade + Data limite (Due date)
   - Todo tem:
   - priority: low | medium | high
   - dueDate: opcional (data)
   - Exibir badges/indicadores no item.
   - Criar filtro “Atrasados” (dueDate < hoje e não concluído).

3. Tema com CSS Variables
   - Criar um painel/controle para alternar tema (ex.: “light/dark”) usando CSS Variables.
   - Persistir preferência (ex.: localStorage).

4. Export / Import
   - Exportar o estado (projetos + todos) para JSON (download ou copiar).
   - Importar JSON e reidratar estado (com validação mínima: formato esperado).

## Restrições e dicas de arquitetura

### Contrato de eventos (sugestão)

Defina e documente um “contrato” de eventos no seu DECISIONS.md ou ARCHITECTURE.md, por exemplo:

- todo:add { title, projectId, priority, dueDate }
- todo:toggle { id }
- todo:update { id, patch }
- todo:remove { id }
- project:add { name }
- project:select { projectId }
- theme:change { theme }
- data:export
- data:import { json }

Lembrete: para atravessar Shadow DOM fechado, eventos customizados devem ser composed: true quando necessário. ￼

Testabilidade com Shadow fechado

Como shadowRoot não fica acessível, prefira:

- Testar por API pública (métodos/propriedades) e eventos.
- Usar data-\* no host e eventos para observar mudanças “de fora”.

⸻

Entregáveis

1. Código em repositório Git
2. README.md com:
   - setup
   - scripts (dev, build, test)
   - como usar a aplicação
3. DECISIONS.md (ou ADRs) com decisões e alternativas consideradas
4. Testes com Jest (mínimo sugerido: 8 testes bem escolhidos)

⸻

Critérios de aceite (check rápido)

- Só existe 1 custom element no index.html (o principal)
- Componentes internos se comunicam por CustomEvent + addEventListener
- Estado gera re-render correto (sem “gambiarras” invisíveis)
- CSS Variables usadas para tema
- Shadow DOM fechado no principal
- Testes Jest rodando em npm test
- Decisões documentadas

⸻

O que NÃO queremos

- Dependências de frameworks de estado (Redux/MobX/etc.) sem justificativa forte para o escopo.
- Comunicação via import direto de store global sem documentação.
- Solução “monolítica” com tudo em um único arquivo.

```

```
