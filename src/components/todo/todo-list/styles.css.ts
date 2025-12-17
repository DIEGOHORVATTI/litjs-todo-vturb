import { css } from 'lit'

import { todoItemCheckboxStyles } from '../../../styles/todo-checkbox.css.js'

export const todoListStyles = css`
  ${todoItemCheckboxStyles}

  .new-todo-row {
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 0px;
    border-bottom: 1px solid var(--color-border);
    background: var(--color-surface);
  }

  ::slotted([slot='new-todo']) {
    flex: 1;
    min-width: 0;
  }

  .todo-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .toggle-all {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
    border: 0;
  }

  .toggle + label {
    width: 40px;
    height: 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0;
    cursor: pointer;
  }

  todo-item {
    border-bottom: 1px solid var(--color-border);
  }

  todo-item:last-child {
    border-bottom: none;
  }
`
