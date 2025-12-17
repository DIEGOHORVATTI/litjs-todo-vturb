import { css } from 'lit'

export const uiToggleStyles = css`
  :host {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    user-select: none;
  }

  button {
    all: unset;
    box-sizing: border-box;
    width: 44px;
    height: 26px;
    border-radius: 999px;
    background: var(--toggle-track, rgba(100, 116, 139, 0.35));
    border: 1px solid var(--color-border);
    display: inline-flex;
    align-items: center;
    padding: 2px;
    cursor: pointer;
    transition:
      background 160ms ease,
      border-color 160ms ease;
  }

  button[aria-checked='true'] {
    background: var(--color-accent);
    border-color: rgba(0, 0, 0, 0);
  }

  .thumb {
    width: 20px;
    height: 20px;
    border-radius: 999px;
    background: var(--color-surface);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.18);
    transform: translateX(0);
    transition: transform 160ms ease;
  }

  button[aria-checked='true'] .thumb {
    transform: translateX(18px);
  }

  .label {
    font-size: var(--text-sm);
    color: var(--color-muted);
    line-height: 1;
    white-space: nowrap;
  }
`
