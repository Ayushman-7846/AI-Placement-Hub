/**
 * Prettier Configuration
 * Consistent code formatting across the entire client codebase.
 */
export default {
  // ── General Formatting ──────────────────────────────────────
  printWidth: 80, // Wrap lines at 80 characters
  tabWidth: 2, // 2 spaces indentation
  useTabs: false, // Use spaces, not tabs
  semi: true, // Always add semicolons
  singleQuote: true, // Use single quotes
  quoteProps: 'as-needed', // Only quote object props when necessary

  // ── JSX Formatting ──────────────────────────────────────────
  jsxSingleQuote: false, // Double quotes in JSX (HTML convention)
  bracketSameLine: false, // Closing > of JSX on new line
  bracketSpacing: true, // { foo: bar } with spaces

  // ── Trailing Commas ─────────────────────────────────────────
  trailingComma: 'es5', // Trailing commas where valid in ES5 (objects, arrays)

  // ── Arrow Functions ──────────────────────────────────────────
  arrowParens: 'always', // Always include parens: (x) => x

  // ── End of Line ─────────────────────────────────────────────
  endOfLine: 'lf', // Unix line endings (consistent cross-platform)

  // ── Embedded Language Formatting ────────────────────────────
  embeddedLanguageFormatting: 'auto',

  // ── File-Specific Overrides ──────────────────────────────────
  overrides: [
    {
      files: ['*.json'],
      options: {
        printWidth: 100,
      },
    },
    {
      files: ['*.md'],
      options: {
        printWidth: 100,
        proseWrap: 'always',
      },
    },
    {
      files: ['*.css'],
      options: {
        singleQuote: false,
      },
    },
  ],
};
