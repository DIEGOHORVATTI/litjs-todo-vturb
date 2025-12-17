import { css } from 'lit'

//  Styles used in more than one element.
export const todoStyles = css`
  button {
    margin: 0;
    padding: 0;
    border: 0;
    background: none;
    font-size: 100%;
    vertical-align: baseline;
    font-family: inherit;
    font-weight: inherit;
    color: inherit;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  :focus,
  .toggle:focus + label,
  .toggle-all:focus + label {
    box-shadow: var(--focus-ring);
    outline: 0;
  }

  .new-todo,
  .edit {
    position: relative;
    margin: 0;
    width: 100%;
    font-size: 24px;
    font-family: inherit;
    font-weight: inherit;
    line-height: 1.4em;
    border: 0;
    color: inherit;
    padding: 6px;
    border: 1px solid var(--color-border);
    background: var(--color-surface);
    box-shadow: inset 0 -1px 4px rgba(0, 0, 0, 0.08);
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .new-todo {
    padding-left: 40px;
    border: none;
    background: transparent;
    box-shadow: none;
  }
`
