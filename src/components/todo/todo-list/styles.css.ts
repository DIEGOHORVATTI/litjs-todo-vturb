import { css } from 'lit'

export const todoListStyles = css`
  :host {
    display: block;
  }

  :focus {
    box-shadow: none !important;
  }

  .todo-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .toggle-all {
    width: 1px;
    height: 1px;
    border: none;
    opacity: 0;
    position: absolute;
    right: 100%;
    bottom: 100%;
  }

  .toggle-all + label {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 45px;
    height: 65px;
    font-size: 0;
    position: absolute;
    top: -65px;
    left: 0;
  }

  .toggle-all + label:before {
    content: '❯';
    display: inline-block;
    font-size: 22px;
    color: var(--color-muted);
    padding: 10px 27px;
    transform: rotate(90deg);
  }

  .toggle-all:checked + label:before {
    color: var(--color-text);
  }

  todo-item {
    border-bottom: 1px solid var(--color-border);
  }

  todo-item:last-child {
    border-bottom: none;
  }
`
