import { css } from 'lit'

/**
 * Design tokens (CSS Custom Properties) for the app.
 *
 * Applied at the root (<todo-app>) so it cascades to internal components.
 */
export const tokens = css`
  :host {
    /* Typography */
    --font-sans: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial,
      'Apple Color Emoji', 'Segoe UI Emoji';

    --text-xs: 12px;
    --text-sm: 14px;
    --text-md: 16px;
    --text-lg: 18px;
    --text-xl: 20px;
    --text-2xl: 24px;

    /* Spacing (4pt grid) */
    --space-1: 4px;
    --space-2: 8px;
    --space-3: 12px;
    --space-4: 16px;
    --space-5: 20px;
    --space-6: 24px;
    --space-8: 32px;

    /* Radius */
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;

    /* Shadows */
    --shadow-1: 0 1px 2px rgba(0, 0, 0, 0.06), 0 8px 24px rgba(0, 0, 0, 0.06);
    --shadow-2: 0 2px 4px rgba(0, 0, 0, 0.08), 0 18px 60px rgba(0, 0, 0, 0.08);

    /* Brand */
    --accent-h: 8;
    --accent-s: 75%;
    --accent-l: 52%;
    --color-accent: hsl(var(--accent-h) var(--accent-s) var(--accent-l));
    --color-accent-strong: hsl(var(--accent-h) var(--accent-s) 45%);

    /* Default theme is light unless overridden */
    --color-bg: #f6f7fb;
    --color-surface: #ffffff;
    --color-surface-2: #fbfbfd;
    --color-text: #0f172a;
    --color-muted: #64748b;
    --color-border: rgba(15, 23, 42, 0.12);

    --focus-ring: 0 0 0 3px rgba(234, 88, 12, 0.28);

    /* Todo-specific */
    --todo-max-width: 720px;
  }

  :host([data-theme='dark']) {
    --color-bg: #0b1020;
    --color-surface: #0f172a;
    --color-surface-2: #111c36;
    --color-text: #e5e7eb;
    --color-muted: #a1a1aa;
    --color-border: rgba(226, 232, 240, 0.12);

    --shadow-1: 0 1px 2px rgba(0, 0, 0, 0.35), 0 18px 60px rgba(0, 0, 0, 0.35);
    --shadow-2: 0 2px 4px rgba(0, 0, 0, 0.45), 0 24px 80px rgba(0, 0, 0, 0.45);

    --focus-ring: 0 0 0 3px rgba(234, 88, 12, 0.35);
  }
`
