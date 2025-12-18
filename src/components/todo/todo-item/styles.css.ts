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
    padding: 8px 12px;
    margin: 0 0 0 43px;
    font-size: var(--text-lg);
    line-height: 1.2;
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
    font-size: var(--text-lg);
    padding: 15px 15px 15px 60px;
    display: block;
    line-height: 1.2;
    transition: color 0.4s;
    font-weight: 500;
    color: var(--color-text);
  }

  .meta {
    display: inline-flex;
    gap: 8px;
    margin-left: 10px;
    vertical-align: middle;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    height: 20px;
    padding: 0 8px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.02em;
    border: 1px solid var(--color-border);
    background: var(--color-surface-2);
    color: var(--color-text);
    text-transform: capitalize;
  }

  .badge[data-project='true'] {
    border-color: color-mix(in oklab, var(--color-text), transparent 80%);
    background: color-mix(in oklab, var(--color-text), transparent 92%);
    text-transform: none;
  }

  .badge[data-priority='low'] {
    border-color: color-mix(in oklab, var(--color-accent), transparent 65%);
    background: color-mix(in oklab, var(--color-accent), transparent 88%);
  }

  .badge[data-priority='medium'] {
    border-color: color-mix(in oklab, var(--color-warning, #c27a00), transparent 55%);
    background: color-mix(in oklab, var(--color-warning, #c27a00), transparent 88%);
  }

  .badge[data-priority='high'] {
    border-color: color-mix(in oklab, var(--color-danger, #b42318), transparent 55%);
    background: color-mix(in oklab, var(--color-danger, #b42318), transparent 88%);
  }

  .badge[data-due='overdue'] {
    border-color: color-mix(in oklab, var(--color-danger, #b42318), transparent 55%);
    background: color-mix(in oklab, var(--color-danger, #b42318), transparent 90%);
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
