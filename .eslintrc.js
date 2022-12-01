module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    // 'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'prefer-const': 0,
    'quotes': [2, 'single'],
    'jsx-quotes': [2, 'prefer-double'],
    'eol-last': 2,
    'no-unused-expressions': [2, {
      'allowShortCircuit': false,
      'allowTernary': false
    }],
    'no-multiple-empty-lines': [2, {
      'max': 2,
      'maxBOF': 1,
      'maxEOF': 0
    }],
    'indent': [2, 2, {
      'ignoredNodes': ['TemplateLiteral'],
      'SwitchCase': 1
    }],
    'eqeqeq': [2, 'always'],
    'template-curly-spacing': 2,
    'space-in-parens': [2, 'never'],
    'object-curly-spacing': [2, 'always'],
    'space-before-blocks': 2,
    'space-before-function-paren': [2, {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'always'
    }],
    'object-shorthand': [2, 'always', {
      ignoreConstructors: false,
      avoidQuotes: true,
    }],
    'array-bracket-spacing': [2, 'never'],
    'arrow-body-style': [2, 'as-needed'],
    'max-len': [2, 120, 2, {
      'ignoreUrls': true,
      'ignoreComments': false,
      'ignoreRegExpLiterals': true,
      'ignoreStrings': true,
      'ignoreTemplateLiterals': true
    }],
    'padded-blocks': ['error', {
      blocks: 'never',
      classes: 'never',
      switches: 'never',
    }, {
      allowSingleLineBlocks: true,
    }],
    'new-parens': 2,
    'function-paren-newline': [2, 'consistent'],
    'keyword-spacing': [2, {
      'before': true,
      'after': true,
      'overrides': {
        'return': { 'after': true },
        'throw': { 'after': true },
        'case': { 'after': true }
      }
    }],
    'spaced-comment': [2, 'always', {
      'line': {
        'exceptions': ['-', '+'],
        'markers': ['=', '!'] // space here to support sprockets directives
      },
      'block': {
        'exceptions': ['-', '+'],
        'markers': ['=', '!', ':', '::'], // space here to support sprockets directives and flow comment types
        'balanced': true
      }
    }],
    'semi': [2, 'always'],
    'comma-spacing': 2,
    'space-infix-ops': 2,
    'no-whitespace-before-property': 2,
    'computed-property-spacing': 2,
    'key-spacing': 2,
    'arrow-spacing': [2, { 'before': true, 'after': true }],
    'no-trailing-spaces': [2, {
      'skipBlankLines': false,
      'ignoreComments': false
    }],
    'object-property-newline': [2, {
      'allowAllPropertiesOnSameLine': true
    }],
    'no-multi-spaces': [2, {
      'ignoreEOLComments': false
    }],
    'comma-dangle': [2, {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'always-multiline',
    }],
    'brace-style': [2, 'stroustrup'],
    'prefer-rest-params': 0,
    // 'import/no-default-export': 2,
    'no-duplicate-imports': 2,
    // '@typescript-eslint/no-explicit-any': 2,
    '@typescript-eslint/interface-name-prefix': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-empty-interface': 0,
    '@typescript-eslint/ban-types': 0,
    '@typescript-eslint/member-delimiter-style': [
      2,
      {
        'multiline': {
          'delimiter': 'semi',
          'requireLast': true
        },
        'singleline': {
          'delimiter': 'semi',
          'requireLast': false
        }
      }
    ]
  },
};
