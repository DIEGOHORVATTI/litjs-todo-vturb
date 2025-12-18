import { css } from 'lit'

export const uiButtonStyles = css`
  :host {
    display: inline-block;
  }

  button {
    padding: 6px 10px;
    background: none;
    font-size: 100%;
    vertical-align: baseline;
    font-family: inherit;
    font-weight: inherit;
    color: inherit;
    appearance: none;
    -webkit-appearance: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    cursor: pointer;
    background: var(--color-surface-2);
    border: 1px solid transparent;
    border-radius: var(--radius-sm);
  }

  button:hover {
    border-color: color-mix(in oklab, var(--color-accent), transparent 65%);
  }

  button:focus {
    color: var(--color-text);
    background: color-mix(in oklab, var(--color-accent), transparent 88%);
    border-color: color-mix(in oklab, var(--color-accent), transparent 45%);
  }
`
