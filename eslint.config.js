import eslintPluginSvelte from 'eslint-plugin-svelte';
import typescriptEslintParser from '@typescript-eslint/parser';
import * as typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import svelteEslintParser from 'svelte-eslint-parser';
import svelteConfig from './svelte.config.js'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import sortKeysFixPlugin from 'eslint-plugin-sort-keys-fix'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

export default [
  ...eslintPluginSvelte.configs['flat/recommended'],
  ...eslintPluginSvelte.configs['flat/prettier'],

  // TypeScript specific configuration
  {
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
      'sort-keys-fix': sortKeysFixPlugin,
    },
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        project: './tsconfig.json',
        extraFileExtensions: ['.ts'],
      },
    },
    rules: {
      ...typescriptEslintPlugin.configs['recommended'].rules,
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      // Replace standard sort-keys with auto-fixable version
      'sort-keys': 'off',
      'sort-keys-fix/sort-keys-fix': ['error', 'asc', {
        caseSensitive: true,
        natural: false,
      }],
    }
  },

  // disable some rules for shad-cn components
  {
    files: ['src/lib/components/ui/**/*.ts', 'src/lib/components/ui/**/*.svelte'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    }
  },

  // Svelte files configuration
  {
    files: ['**/*.svelte'],
    plugins: {
      'sort-keys-fix': sortKeysFixPlugin,
      extraFileExtensions: ['.svelte'],
    },
    languageOptions: {
      parser: svelteEslintParser,
      parserOptions: {
        parser: typescriptEslintParser,
        project: './tsconfig.json',
        extraFileExtensions: ['.svelte'],
        svelteConfig
      },
    },
    rules: {
      'sort-keys': 'off',
      'sort-keys-fix/sort-keys-fix': ['error', 'asc', {
        caseSensitive: true,
        natural: false,
      }],
    },
  },

  // General rules that apply to all files
  {
    rules: {
      "sort-imports": ["error", {
        "ignoreCase": false,
        "ignoreDeclarationSort": false,
        "ignoreMemberSort": false,
        "memberSyntaxSortOrder": ["none", "all", "multiple", "single"],
        "allowSeparatedGroups": false
      }],
      "sort-keys": ["error", "asc", {"caseSensitive": true, "natural": false}],
    }
  },

  // Prettier configuration
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },

  // Simple import sort
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      // Use only simple-import-sort for import sorting
      'simple-import-sort/imports': 'error',
      // Other rules here, but disable sort-imports
      'sort-imports': 'off',
      'prettier/prettier': 'error', // Keep Prettier enabled
    },
  },

  // Ignore patterns
  {
    ignores: [
      'build/',
      'src-tauri/target/',
      '*.config.js',
      '.svelte-kit/'
    ]
  }
]
