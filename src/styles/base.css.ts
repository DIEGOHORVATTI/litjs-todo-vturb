import { css } from 'lit'

/**
 * Base styles shared across components.
 * Keep it small: reset + accessibility + consistent defaults.
 */
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

  a {
    color: inherit;
  }

  :focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
    border-radius: 8px;
  }

  ::selection {
    background: rgba(234, 88, 12, 0.25);
  }
`
