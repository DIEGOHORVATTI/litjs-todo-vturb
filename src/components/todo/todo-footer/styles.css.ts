import { css } from 'lit'

export const todoFooterStyles = css`
  :host {
    display: block;
    padding: var(--space-3) var(--space-4);
    min-height: 44px;
    text-align: center;
    font-size: var(--text-sm);
    border-top: 1px solid var(--color-border);
    background: var(--color-surface);
    color: var(--color-muted);
  }

  :host:before {
    content: '';
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 50px;
    overflow: hidden;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.12);
    opacity: 0.25;
  }

  .todo-count {
    float: left;
    text-align: left;
  }

  .todo-count strong {
    font-weight: 600;
    color: var(--color-text);
  }

  .filters {
    margin: 0;
    padding: 0;
    list-style: none;
    position: absolute;
    right: 0;
    left: 0;
  }

  li {
    display: inline;
  }

  li a {
    color: inherit;
    margin: 3px;
    padding: 6px 10px;
    text-decoration: none;
    border: 1px solid transparent;
    border-radius: var(--radius-sm);
  }

  a:hover {
    border-color: color-mix(in oklab, var(--color-accent), transparent 65%);
  }

  a.selected {
    color: var(--color-text);
    background: color-mix(in oklab, var(--color-accent), transparent 88%);
    border-color: color-mix(in oklab, var(--color-accent), transparent 45%);
  }

  .clear-completed,
  :host .clear-completed:active {
    float: right;
    position: relative;
    line-height: 19px;
    text-decoration: none;
    cursor: pointer;
    padding: 6px 10px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-border);
    background: var(--color-surface-2);
    color: var(--color-text);
  }

  .clear-completed:hover {
    filter: brightness(0.98);
  }
`
