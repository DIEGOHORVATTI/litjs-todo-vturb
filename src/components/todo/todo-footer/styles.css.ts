import { css } from 'lit'

export const todoFooterStyles = css`
  :host {
    display: block;
    padding: var(--space-3) var(--space-4);
    min-height: 44px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: space-between;
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
    display: inline-block;
  }

  a {
    padding: 6px 10px;
    list-style: none;
    border: 1px solid transparent;
    border-radius: var(--radius-sm);
    color: inherit;
    margin: 3px;
    text-decoration: none;
  }

  .clear-completed {
    border: 1px solid var(--color-border);
    background: var(--color-surface-2);
    border-radius: var(--radius-sm);
    color: inherit;
    padding: 6px 10px;
    text-decoration: none;
    cursor: pointer;
  }

  .clear-completed:hover {
    color: var(--color-text);
    border-color: color-mix(in oklab, var(--color-accent), transparent 65%);
    background: color-mix(in oklab, var(--color-accent), transparent 88%);
  }

  a:hover {
    border-color: color-mix(in oklab, var(--color-accent), transparent 65%);
  }

  a.selected {
    color: var(--color-text);
    background: color-mix(in oklab, var(--color-accent), transparent 88%);
    border-color: color-mix(in oklab, var(--color-accent), transparent 45%);
  }
`
