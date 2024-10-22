import eslintPluginSvelte from 'eslint-plugin-svelte';
import typescriptEslintParser from '@typescript-eslint/parser';
import svelteEslintParser from 'svelte-eslint-parser';
import svelteConfig from './svelte.config.js'
import eslintPluginPrettier from 'eslint-plugin-prettier'
export default [
  ...eslintPluginSvelte.configs['flat/recommended'],
  ...eslintPluginSvelte.configs['flat/prettier'],
  {
    rules: {
      "sort-imports": ["error", {
        "ignoreCase": false,
        "ignoreDeclarationSort": false,
        "ignoreMemberSort": false,
        "memberSyntaxSortOrder": ["none", "all", "multiple", "single"],
        "allowSeparatedGroups": false
      }],
      "sort-keys": ["error", "asc", {"caseSensitive": true, "natural": false, "minKeys": 2}],
    }
  },
  {
    languageOptions: {
      parser: svelteEslintParser,
      parserOptions: {
        parser: typescriptEslintParser,
        project: './tsconfig.json',
        extraFileExtensions: ['.svelte'],
        svelteConfig
      },
    }
  },
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
  {
    ignores: [
      'build/',
      'src-tauri/target/',
      '*.config.js',
      '.svelte-kit/'
    ]
  }
]
