import { css } from 'lit'

export const baseStyles = css`
  :host {
    font-family: var(--font-sans);
    color: var(--color-text);
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  button,
  input,
  select,
  textarea {
    font: inherit;
    color: inherit;
  }

  input,
  select,
  textarea {
    background: var(--color-surface-2);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    outline: none;
  }

  input:focus,
  select:focus,
  textarea:focus {
    box-shadow: var(--focus-ring);
    border-color: color-mix(in oklab, var(--color-accent), transparent 55%);
  }

  input::placeholder,
  textarea::placeholder {
    color: var(--color-muted);
  }

  a {
    color: inherit;
  }

  ::selection {
    background: rgba(234, 88, 12, 0.25);
  }
`
