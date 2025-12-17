import { css } from 'lit'

export const appHeaderStyles = css`
  :host {
    display: block;
    position: relative;
  }

  h1 {
    position: absolute;
    top: -92px;
    width: 100%;
    font-size: 64px;
    font-weight: 250;
    letter-spacing: -0.03em;
    text-align: center;
    color: color-mix(in oklab, var(--color-text), var(--color-accent) 35%);
    -webkit-text-rendering: optimizeLegibility;
    -moz-text-rendering: optimizeLegibility;
    text-rendering: optimizeLegibility;
    margin: 0;
  }

  .header {
    position: relative;
    padding: var(--space-4);
    background: var(--color-surface);
  }

  .actions {
    position: absolute;
    top: var(--space-4);
    right: var(--space-4);
  }
`
