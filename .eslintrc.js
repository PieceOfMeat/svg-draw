module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:jest-dom/recommended',
    'plugin:json/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      modules: true,
    },
    ecmaVersion: 6,
    sourceType: 'module',
  },
  plugins: [
    '@studysync/jsx-conditionals',
    '@studysync/material-ui',
    '@studysync/persnickety',
    '@typescript-eslint',
    'custom-jsx-props-order',
    'jest',
    'jest-dom',
    'json',
    'ocd',
    'prettier',
    'react-hooks',
  ],
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['state', './src/state'],
          ['core', './src/core'],
          ['components', './src/components'],
          ['types', './src/types'],
          ['utils', './src/utils'],
        ],
        extensions: ['.js', '.json', '.ts', 'tsx'],
      },
    },
  },
  rules: {
    '@studysync/jsx-conditionals/ensure-booleans': 'off',
    '@studysync/material-ui/do-not-use-mui-system': 'off',
    '@studysync/material-ui/no-importing-act': 'off',
    '@studysync/material-ui/no-importing-styles': 'off',
    '@studysync/material-ui/no-styled-from-core': 'error',
    '@studysync/material-ui/tree-shakeable-imports': 'error',
    '@studysync/persnickety/jsx-child-location': 'error',
    '@studysync/persnickety/faker-use-explicit-locale': 'error',
    '@studysync/persnickety/jsx-multiple-props-multiple-lines': 'off',
    '@studysync/persnickety/jsx-single-prop-single-line': 'error',
    '@studysync/persnickety/jsx-use-headline-not-headings': 'error',
    '@studysync/persnickety/use-pinnable-components': 'error',
    '@studysync/persnickety/use-pinnable-methods': 'error',
    'array-element-newline': ['error', 'consistent'],
    'arrow-parens': [
      'error',
      'as-needed',
      {
        requireForBlockBody: true,
      },
    ],
    'class-methods-use-this': 'off',
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'always-multiline',
      },
    ],
    'custom-jsx-props-order/bcs-ef-order-props': 'error',
    'function-paren-newline': ['error', 'multiline'],
    'import/default': 'error',
    'import/extensions': 'off',
    'import/namespace': 'off',
    'import/no-anonymous-default-export': [
      'error',
      {
        allowArray: false,
        allowArrowFunction: false,
        allowAnonymousClass: false,
        allowAnonymousFunction: false,
        allowCallExpression: false,
        allowLiteral: false,
        allowObject: false,
      },
    ],
    'import/no-cycle': ['error', { ignoreExternal: true }],
    'import/no-duplicates': 'error',
    'import/no-named-as-default': 'off',
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'never',
      },
    ],
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
        ignoredNodes: [
          'TemplateLiteral',
        ],
      },
    ],
    'max-len': [
      'error',
      {
        code: 120,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],
    'no-await-in-loop': 'off',
    'no-confusing-arrow': 'off',
    'no-extra-parens': ['error', 'functions'],
    'no-multiple-empty-lines': [
      'error',
      {
        max: 1,
        maxEOF: 0,
      },
    ],
    'no-nested-ternary': 'off',
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: ['draft'],
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'lodash',
            message: "Please use methods from 'src/core/fp/' instead.",
          },
        ],
        patterns: ['@mui/*/*/*', '!@mui/material/test-utils/*'],
      },
    ],
    'no-useless-concat': 'error',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    'implicit-arrow-linebreak': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/ban-ts-comment': 'off',
    'object-curly-newline': [
      'error',
      {
        ObjectExpression: {
          consistent: true,
        },
        ObjectPattern: {
          multiline: true,
        },
      },
    ],
    'object-curly-spacing': ['error', 'always'],
    'object-property-newline': [
      'error',
      { allowAllPropertiesOnSameLine: true },
    ],
    'ocd/sort-import-declaration-specifiers': 'error',
    'ocd/sort-variable-declarator-properties': 'error',
    'prefer-template': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react/forbid-prop-types': 'off',
    'react/function-component-definition': ['error', {
      namedComponents: 'arrow-function',
      unnamedComponents: 'arrow-function',
    }],
    'react/jsx-curly-brace-presence': 'error',
    'react/jsx-curly-spacing': ['error', { when: 'never', children: true }],
    'react/jsx-equals-spacing': ['error', 'never'],
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.mdx', '.tsx'] }],
    'react/jsx-first-prop-new-line': ['error', 'multiline'],
    'react/jsx-indent-props': ['warn', 2],
    'react/jsx-max-props-per-line': 'off',
    'react/jsx-no-script-url': 'error',
    'react/jsx-no-target-blank': 'error',
    'react/jsx-no-undef': 'error',
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-pascal-case': 'error',
    'react/jsx-props-no-multi-spaces': 'error',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-uses-react': 'off',
    'react/no-adjacent-inline-elements': 'error',
    'react/no-array-index-key': 'off',
    'react/no-danger': 'off',
    'react/no-unescaped-entities': 'off',
    'react/no-unstable-nested-components': 'error',
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
    'react/react-in-jsx-scope': 'off',
    semi: ['error', 'never'],
    'template-curly-spacing': 'off',
  },
}
