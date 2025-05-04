// .eslintrc.js
module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    rules: {
        // General ESLint rules
        'no-console': 'off', // Allow console usage for CLI tool
        'no-unused-vars': 'off', // TypeScript handles this
        'no-undef': 'off', // TypeScript handles this
        'quotes': ['error', 'single', { 'avoidEscape': true }],
        'semi': ['error', 'always'],

        // TypeScript specific rules
        '@typescript-eslint/explicit-function-return-type': ['warn', {
            allowExpressions: true,
            allowTypedFunctionExpressions: true,
        }],
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unused-vars': ['error', {
            vars: 'all',
            args: 'after-used',
            ignoreRestSiblings: false,
        }],
    },
    env: {
        node: true,
        es6: true,
        jest: true,
    },
};