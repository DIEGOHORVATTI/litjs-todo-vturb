import { css } from 'lit'

export const uiInputStyles = css`
  :host {
    display: block;
  }

  input {
    padding: 16px 16px 16px 60px;
    border: none;
    background: rgba(0, 0, 0, 0.003);
    box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
    position: relative;
    margin: 0;
    width: 100%;
    font-size: 24px;
    font-family: inherit;
    font-weight: inherit;
    line-height: 1.4em;
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  input::-webkit-input-placeholder {
    font-style: italic;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.4);
  }

  input::-moz-placeholder {
    font-style: italic;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.4);
  }

  input::input-placeholder {
    font-style: italic;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.4);
  }

  input:focus {
    outline: 0;
  }
`
