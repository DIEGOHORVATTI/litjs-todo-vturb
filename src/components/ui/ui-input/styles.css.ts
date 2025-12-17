import { css } from 'lit'

export const uiInputStyles = css`
  input,
  select {
    border: 1px solid var(--color-border);
    width: 100%;
    padding: 8px 12px;
    font-size: var(--text-xl);
    color: var(--color-text);
    background: var(--color-surface-2);
    font-family: inherit;
    font-weight: inherit;
    line-height: 1.4em;
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
    border-radius: var(--radius-sm);
  }

  input:focus,
  select:focus {
    outline: 0;
    box-shadow: var(--focus-ring);
    border-color: color-mix(in oklab, var(--color-accent), transparent 55%);
  }

  input::placeholder {
    color: var(--color-muted);
  }

  select {
    cursor: pointer;
  }
`
