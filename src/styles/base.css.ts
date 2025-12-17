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

  a {
    color: inherit;
  }

  ::selection {
    background: rgba(234, 88, 12, 0.25);
  }
`
