import { css } from 'lit'

export const appHeaderStyles = css`
  .header {
    position: relative;
    padding: var(--space-4);
    background: var(--color-surface);
  }

  .top-row {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: var(--space-3);
  }

  .content-row {
    display: block;
  }
`
