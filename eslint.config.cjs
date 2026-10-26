const js = require('@eslint/js');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const prettier = require('eslint-config-prettier/flat');
const jsdoc = require('eslint-plugin-jsdoc');

/**
 * ESLint 9 flat config. Replaces .eslintrc.cjs and every .eslintignore:
 * ESLint 9 no longer reads them.
 */
module.exports = [
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/*config*', '**/*.md', 'tests/**', 'skills/**', 'packages/*/examples/*.mjs'],
  },
  js.configs.recommended,
  ...tsPlugin.configs['flat/strict'],
  ...tsPlugin.configs['flat/recommended-type-checked'],
  prettier,
  {
    files: ['packages/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/unbound-method': [
        'error',
        {
          ignoreStatic: true,
        },
      ],
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/explicit-member-accessibility': ['error', { overrides: { constructors: 'no-public' } }],

      'comma-dangle': [
        'error',
        {
          arrays: 'always-multiline',
          objects: 'always-multiline',
          imports: 'always-multiline',
          exports: 'always-multiline',
          functions: 'never',
        },
      ],

      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      camelcase: 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'variable', format: ['camelCase', 'UPPER_CASE', 'PascalCase'], leadingUnderscore: 'allow' },
        { selector: 'parameter', format: ['camelCase'], leadingUnderscore: 'allow' },
        { selector: 'memberLike', modifiers: ['private'], format: ['camelCase'], leadingUnderscore: 'allow' },
        { selector: 'typeLike', format: ['PascalCase'] },
      ],

      'max-lines-per-function': ['error', 35],
      'max-classes-per-file': ['error', 1],
      'max-params': ['error', 3],
      'max-depth': ['error', 2],

      'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
      'no-unused-expressions': 'error',
      'no-negated-condition': 'error',
      'no-mixed-operators': 'error',
      'no-nested-ternary': 'error',
      'no-useless-return': 'error',
      'no-param-reassign': 'error',
      'no-return-assign': 'error',
      'no-multi-assign': 'error',
      'no-return-await': 'error',
      'no-undefined': 'error',
      'no-sequences': 'error',
      'no-lonely-if': 'error',
      'no-multi-str': 'error',
      'no-shadow': 'error',
      'no-var': 'error',

      'prefer-promise-reject-errors': 'error',
      'prefer-named-capture-group': 'error',
      'prefer-destructuring': 'error',
      'prefer-object-spread': 'error',
      'prefer-template': 'error',
      'prefer-const': 'error',

      'require-await': 'off',
      'dot-notation': 'error',
      'vars-on-top': 'error',

      eqeqeq: 'error',
      yoda: 'error',
    },
  },
  {
    files: ['packages/http/index.ts', 'packages/http/src/**/*.ts', 'packages/collection/index.ts', 'packages/collection/src/**/*.ts'],
    plugins: { jsdoc },
    settings: { jsdoc: { mode: 'typescript' } },
    rules: {
      'jsdoc/require-jsdoc': [
        'error',
        {
          publicOnly: false,
          checkConstructors: false,
          require: { ClassDeclaration: true, MethodDefinition: true, FunctionDeclaration: true },
          contexts: [
            'TSInterfaceDeclaration',
            'TSTypeAliasDeclaration',
            'TSInterfaceBody > TSMethodSignature',
            'TSInterfaceBody > TSPropertySignature',
          ],
        },
      ],
      // Every block needs @summary, or @inheritDoc to take the comment of the member it implements.
      'jsdoc/no-restricted-syntax': [
        'error',
        {
          contexts: [
            'ClassDeclaration',
            'MethodDefinition',
            'FunctionDeclaration',
            'TSInterfaceDeclaration',
            'TSTypeAliasDeclaration',
            'TSMethodSignature',
          ].map((context) => ({
            context,
            comment: 'JsdocBlock:not(:has(JsdocTag[tag=/^(summary|inheritDoc)$/]))',
            message: 'Add @summary (or @inheritDoc to reuse the comment of the implemented member)',
          })),
        },
      ],
      'jsdoc/require-description': ['error', { contexts: ['TSInterfaceBody > TSPropertySignature'], descriptionStyle: 'body' }],
      'jsdoc/no-blank-blocks': 'error',
      'jsdoc/require-param': ['error', { checkDestructured: false }],
      'jsdoc/require-param-description': 'error',
      'jsdoc/require-returns': ['error', { checkGetters: false }],
      'jsdoc/require-returns-description': 'error',
      'jsdoc/check-param-names': ['error', { checkDestructured: false }],
      'jsdoc/check-tag-names': ['error', { definedTags: ['summary'] }],
      'jsdoc/no-types': 'error',
    },
  },
  {
    // Public API: what index.ts exports and the objects it returns.
    files: [
      'packages/http/index.ts',
      'packages/http/src/Http.ts',
      'packages/http/src/Error/*.ts',
      'packages/http/src/Contract/HttpRequest.ts',
      'packages/http/src/Contract/StreamRequest.ts',
      // Public API of @metapraxis/jext-collection: collection() and the methods of the wrappers it returns.
      'packages/collection/index.ts',
      'packages/collection/src/Value.ts',
      'packages/collection/src/Pipeline.ts',
      'packages/collection/src/*/*Pipeline.ts',
      'packages/collection/src/*/*Root.ts',
      'packages/collection/src/*/*Prototype.ts',
      'packages/collection/src/*/*Extensions.ts',
    ],
    rules: {
      'jsdoc/require-example': [
        'error',
        {
          checkConstructors: false,
          contexts: [
            'ClassDeclaration',
            'MethodDefinition[accessibility="public"]',
            'TSMethodSignature',
            'ExportNamedDeclaration > VariableDeclaration',
          ],
        },
      ],
    },
  },
  {
    files: ['packages/*/tests/**/*.ts'],
    rules: {
      'max-lines-per-function': 'off',
    },
  },
];
