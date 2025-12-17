/**
 * @type {import('prettier').Options}
 */
export default {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  trailingComma: "es5",
  bracketSpacing: true,
  bracketSameLine: true,
  plugins: ["@ianvs/prettier-plugin-sort-imports"],
  importOrder: [
    // External dependencies
    "<BUILTIN_MODULES>",
    "<THIRD_PARTY_MODULES>",
    "",
    // Type imports
    "^types/(.*)$",
    "",
    // Application layers (Clean Architecture)
    "^domain/(.*)$",
    "^application/(.*)$",
    "^infrastructure/(.*)$",
    "",
    // Source code structure
    "^src/(.*)$",
    "^components/(.*)$",
    "^utils/(.*)$",
    "",
    // Configuration and DI
    "^di/(.*)$",
    "",
    // Styles (usually imported last in components)
    "^styles/(.*)$",
    "",
    // Internal aliases and relative imports
    "^@(.*)$",
    "^[./]"
  ]
}
