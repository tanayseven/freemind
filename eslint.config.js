import eslintPluginSvelte from 'eslint-plugin-svelte';
export default [
    ...eslintPluginSvelte.configs['flat/recommended'],
    ...eslintPluginSvelte.configs['flat/prettier'],
    {
        rules: {
            semi: "error",
            "prefer-const": "error"
        }
    }
]
