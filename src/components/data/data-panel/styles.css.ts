import { css } from 'lit'

export const dataPanelStyles = css`
  :host {
    display: block;
  }

  .wrap {
    display: grid;
    gap: var(--space-2);
  }

  .row {
    display: flex;
    align-items: center;
    justify-content space-between;
    gap: var(--space-2);
  }

  textarea {
    width: 100%;
    min-height: 120px;
    resize: vertical;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    padding: 10px;
    font-family:
      ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
      monospace;
    font-size: 12px;
    color: var(--color-text);
    background: var(--color-surface-2);
    box-sizing: border-box;
  }

  textarea:focus {
    outline: 0;
    box-shadow: var(--focus-ring);
    border-color: color-mix(in oklab, var(--color-accent), transparent 55%);
  }

  .hint {
    font-size: var(--text-sm);
    color: var(--color-muted);
  }
`
