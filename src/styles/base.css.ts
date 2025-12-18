import { css } from 'lit'

export const baseStyles = css`
  :host {
    font-family: var(--font-sans);
    color: var(--color-text);
    background: var(--color-bg);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    line-height: 1.4;
    display: block;
    min-height: 100vh;
    width: 100%;
  }

  :global(body) {
    margin: 0;
    background: var(--color-bg);
    color: var(--color-text);
    font-family: var(--font-sans);
    overflow-y: auto;
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

  button {
    background: transparent;
    border: 0;
    padding: 0;
  }

  input,
  select,
  textarea {
    background: var(--color-surface-2);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    outline: none;
  }

  input,
  select,
  textarea {
    min-height: 40px;
    padding: 8px 12px;
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
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  :global(:focus-visible) {
    outline: none;
  }

  ::selection {
    background: rgba(234, 88, 12, 0.25);
  }
`
