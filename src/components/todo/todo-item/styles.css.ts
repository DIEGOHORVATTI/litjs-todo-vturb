import { css } from 'lit'

import { todoItemCheckboxStyles } from '../../../styles/todo-checkbox.css.js'

export const todoItemStyles = css`
  ${todoItemCheckboxStyles}

  :host {
    display: block;
  }

  li {
    position: relative;
    font-size: var(--text-2xl);
  }

  .editing {
    border-bottom: none;
    padding: 0;
  }

  .editing .edit {
    display: block;
    width: calc(100% - 43px);
    padding: 12px 16px;
    margin: 0 0 0 43px;
  }

  .editing .view {
    display: none;
  }

  .toggle {
    text-align: center;
    width: 40px;
    height: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto 0;
    border: none;
    -webkit-appearance: none;
    appearance: none;
    opacity: 0;
  }

  label {
    word-break: break-all;
    padding: 15px 15px 15px 60px;
    display: block;
    line-height: 1.2;
    transition: color 0.4s;
    font-weight: 500;
    color: var(--color-text);
  }

  .completed label {
    color: var(--color-muted);
    text-decoration: line-through;
  }

  .completed {
    opacity: 0.72;
  }

  .destroy {
    display: none;
    position: absolute;
    top: 0;
    right: 10px;
    bottom: 0;
    width: 40px;
    height: 40px;
    margin: auto 0;
    font-size: 30px;
    color: var(--color-muted);
    transition: color 0.2s ease-out;
  }

  .destroy:hover,
  .destroy:focus {
    color: var(--color-accent-strong);
  }

  .destroy:after {
    content: '×';
    display: block;
    height: 100%;
    line-height: 1.1;
  }

  li:hover .destroy {
    display: block;
  }

  .edit {
    display: none;
  }

  :host(:last-child) .editing {
    margin-bottom: -1px;
  }
`
