import { css } from 'lit'

export const uiInputStyles = css`
  input {
    border: none;
    background: transparent;
    box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
    position: relative;
    margin: 0;
    width: 100%;
    font-size: var(--text-xl);
    font-family: inherit;
    font-weight: inherit;
    line-height: 1.4em;
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: var(--color-text);
  }

  input:focus {
    outline: 0;
  }
`
