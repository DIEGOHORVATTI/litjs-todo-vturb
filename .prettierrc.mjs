/**
 * @type {import('prettier').Options}
 */
export default {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: true,
  plugins: ['@ianvs/prettier-plugin-sort-imports'],
  importOrderParserPlugins: ['typescript', 'decorators-legacy'],
  importOrder: [
    // External dependencies
    '<BUILTIN_MODULES>',
    '<THIRD_PARTY_MODULES>',
    '',
    // Type imports
    '^types/(.*)$',
    '',
    // Source code structure
    '^src/(.*)$',
    '^components/(.*)$',
    '^utils/(.*)$',
    '',
    // Styles (usually imported last in components)
    '^styles/(.*)$',
    '',
    // Internal aliases and relative imports
    '^@(.*)$',
    '^[./]',
  ],
}
