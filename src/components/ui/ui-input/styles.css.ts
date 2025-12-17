import { css } from 'lit'

export const uiInputStyles = css`
  input {
    border: none;
    width: 100%;
    padding: 8px 12px;
    font-size: var(--text-xl);
    color: var(--color-text);
    font-family: inherit;
    font-weight: inherit;
    line-height: 1.4em;
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
  }

  input:focus {
    outline: 0;
  }
`
