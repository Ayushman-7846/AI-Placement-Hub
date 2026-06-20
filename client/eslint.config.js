import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import reactPlugin from 'eslint-plugin-react';

/**
 * ESLint Flat Config — Tailored for React 19 + Vite 8
 * Uses the new flat config format (ESLint 9+)
 */
export default [
  // ── Files to ignore ────────────────────────────────────────
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      '*.min.js',
      'public/**',
    ],
  },

  // ── Base JS recommended rules ───────────────────────────────
  js.configs.recommended,

  // ── React + Hooks + Refresh rules ──────────────────────────
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2024,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect', // Automatically detect the React version
      },
    },
    rules: {
      // ── React Rules ─────────────────────────────────────────
      ...reactPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // Not needed with React 17+ JSX transform
      'react/prop-types': 'off', // Disable prop-types (use TypeScript in future)
      'react/jsx-no-target-blank': 'warn', // Security: rel="noreferrer" on target="_blank"
      'react/display-name': 'warn',
      'react/no-unused-prop-types': 'warn',

      // ── React Hooks Rules ───────────────────────────────────
      ...reactHooks.configs.recommended.rules,
      'react-hooks/rules-of-hooks': 'error', // Hooks must follow rules
      'react-hooks/exhaustive-deps': 'warn', // useEffect dependencies

      // ── React Refresh ───────────────────────────────────────
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // ── General JavaScript Rules ────────────────────────────
      'no-console': ['warn', { allow: ['warn', 'error'] }], // Use logger utility
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-var': 'error', // Always use const/let
      'prefer-const': 'error',
      'eqeqeq': ['error', 'always'], // Always use ===
      'no-duplicate-imports': 'error',
      'no-shadow': 'warn',

      // ── Code Quality ─────────────────────────────────────────
      'no-debugger': 'error',
      'no-alert': 'warn',
      'no-eval': 'error',
    },
  },
];
