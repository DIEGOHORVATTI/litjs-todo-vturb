import { css } from 'lit'

export const inputPickerStyles = css`
  :host {
    display: block;
    width: 100%;
  }

  label {
    display: grid;
    gap: 6px;
    font-size: var(--text-sm);
    color: var(--color-muted);
  }

  select {
    height: 40px;
    padding: 8px 12px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-border);
    background: var(--color-surface-2);
    color: var(--color-text);
    width: 100%;
    box-sizing: border-box;
    appearance: none;
  }

  select:focus {
    outline: 0;
    box-shadow: var(--focus-ring);
    border-color: color-mix(in oklab, var(--color-accent), transparent 55%);
  }
`
