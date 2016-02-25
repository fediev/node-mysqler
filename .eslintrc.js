/*eslint quote-props: 0, no-inline-comments: 0 */
// TODO: check Stylistic Issues and ECMA 6
// TODO: compare with https://github.com/eslint/eslint/blob/master/packages/eslint-config-eslint/default.yml
/**
 * .eslintrc.js
 * base: .eslintrc.js r.0.2.0-pre (eslint v2.2.0)
 * modified: NO
 */
module.exports = {
  'root': true,
  'env': {
    'browser': true,
    'node': true,
    'commonjs': true,
    'es6': true,
    'mocha': true,
    'jquery': true,
  },
  'parserOptions': {
    'ecmaVersion': 6,
    'sourceType': 'module',
    'ecmaFeatures': {
      'jsx': true,
      'experimentalObjectRestSpread': true,
    },
  },
  'plugins': [
    'react',
  ],
  'extends': 'eslint:recommended',
  'rules': {
    // Possible Errors
    'comma-dangle': [1, 'always-multiline'],  // override:recommended
    'no-cond-assign': [2, 'except-parens'],
    'no-console': 1,                          // override:recommended
    'no-constant-condition': 2,
    'no-control-regex': 2,
    'no-debugger': 2,
    'no-dupe-args': 2,
    'no-dupe-keys': 2,
    'no-duplicate-case': 2,
    'no-empty': 2,
    'no-empty-character-class': 2,
    'no-ex-assign': 2,
    'no-extra-boolean-cast': 2,
    'no-extra-parens': [1, 'all'],
    'no-extra-semi': 2,
    'no-func-assign': 2,
    'no-inner-declarations': [2, 'functions'],
    'no-invalid-regexp': 2,
    'no-irregular-whitespace': 2,
    'no-negated-in-lhs': 2,
    'no-obj-calls': 2,
    'no-regex-spaces': 2,
    'no-sparse-arrays': 2,
    'no-unexpected-multiline': 2,
    'no-unreachable': 2,
    'use-isnan': 2,
    'valid-jsdoc': [1, {
      'prefer': {
        'return': 'returns',
        'requireReturn': 'true',
      },
    }],
    'valid-typeof': 2,

    // Best Practices
    'accessor-pairs': 2,
    'array-callback-return': 2,
    'block-scoped-var': 2,
    'complexity': 1,
    'consistent-return': 1,
    'curly': 2,
    'default-case': 2,
    'dot-location': [2, 'property'],
    'dot-notation': 2,
    'eqeqeq': 2,
    'guard-for-in': 1,
    'no-alert': 2,
    'no-caller': 2,
    'no-case-declarations': 2,
    'no-div-regex': 2,
    'no-else-return': 1,
    'no-empty-function': 1,
    'no-empty-pattern': 2,
    'no-eq-null': 2,
    'no-eval': 2,
    'no-extend-native': 2,
    'no-extra-bind': 2,
    'no-extra-label': 2,
    'no-fallthrough': 2,
    'no-floating-decimal': 2,
    'no-implicit-coercion': 0,
    'no-implicit-globals': 0,
    'no-implied-eval': 2,
    'no-invalid-this': 2,
    'no-iterator': 2,
    'no-labels': 2,
    'no-lone-blocks': 2,
    'no-loop-func': 2,
    'no-magic-numbers': 0,
    'no-multi-spaces': [2, {
      'exceptions': {
        'Property': false,
      },
    }],
    'no-multi-str': 2,
    'no-native-reassign': 2,
    'no-new': 2,
    'no-new-func': 2,
    'no-new-wrappers': 2,
    'no-octal': 2,
    'no-octal-escape': 2,
    'no-param-reassign': 1,
    'no-process-env': 1,
    'no-proto': 2,
    'no-redeclare': 2,
    'no-return-assign': 2,
    'no-script-url': 2,
    'no-self-assign': 2,
    'no-self-compare': 2,
    'no-sequences': 2,
    'no-throw-literal': 2,
    'no-unmodified-loop-condition': 2,
    'no-unused-expressions': 2,
    'no-unused-labels': 2,
    'no-useless-call': 2,
    'no-useless-concat': 2,
    'no-void': 2,
    'no-warning-comments': 0,
    'no-with': 2,
    'radix': [2, 'as-needed'],
    'vars-on-top': 0,
    'wrap-iife': 2,
    'yoda': [2, 'never'],

    // Strict Mode
    // TODO: understand effects of env and sourceType
    'strict': [0, 'global'],

    // Variables
    'init-declarations': 0,
    'no-catch-shadow': 0,
    'no-delete-var': 2,
    'no-label-var': 2,
    'no-shadow': 1,
    'no-shadow-restricted-names': 2,
    'no-undef': 2,
    'no-undef-init': 2,
    'no-undefined': 2,
    'no-unused-vars': [1, { 'vars': 'all', 'args': 'after-used' }], // override:recommended
    'no-use-before-define': [2, 'nofunc'],

    // Node.js and CommJS
    'callback-return': [2, ['cb', 'clbk', 'callback', 'done', 'next']],
    'global-require': 2,
    'handle-callback-err': [1, '^(err|error)$'],
    'no-mixed-requires': [2, {
      'grouping': true,
      'allowCall': true,
    }],
    'no-new-require': 2,
    'no-path-concat': 2,
    'no-process-exit': 2,
    'no-restricted-imports': 0,
    'no-restricted-modules': 0,
    'no-sync': 1,

    // Stylistic Issues
    'array-bracket-spacing': [2, 'never'],
    'block-spacing': 2,
    'brace-style': [2, '1tbs'],
    'camelcase': [2, { 'properties': 'never' }],
    'comma-spacing': 2,
    'comma-style': [2, 'last'],
    'computed-property-spacing': [2, 'never'],
    'consistent-this': [2, 'self'],
    'eol-last': 2,
    'func-names': 1, // intentional report level 1
    // 'func-style': [2, 'declaration'], // change when needed
    'jsx-quotes': [2, 'prefer-double'],
    'key-spacing': [2, { 'beforeColon': false, 'afterColon': true }],
    'max-nested-callbacks': [2, 3],
    'new-cap': 2,
    'new-parens': 2,
    'no-array-constructor': 2,
    'no-inline-comments': 2,
    'no-lonely-if': 2,
    'no-mixed-spaces-and-tabs': 2,
    'no-multiple-empty-lines': [2, { 'max': 2 }],
    'no-negated-condition': 2,
    'no-nested-ternary': 2,
    'no-new-object': 2,
    'no-spaced-func': 2,
    'no-trailing-spaces': 2,
    // 'no-underscore-dangle': 2, // change when needed
    'no-unneeded-ternary': 2,
    'object-curly-spacing': [2, 'always'],
    'one-var': [2, 'never'],
    'one-var-declaration-per-line': [2, 'always'],
    'operator-linebreak': [2, 'before'],
    'padded-blocks': [2, 'never'],
    'quote-props': [2, 'as-needed', { 'keywords': true }],
    // 'require-jsdoc': 1, // change when needed
    'semi-spacing': [2, { 'before': false, 'after': true }],
    'keyword-spacing': 2,
    'space-before-blocks': [2, 'always'],
    'space-before-function-paren': [2, 'never'],
    'space-in-parens': [2, 'never'],
    'space-infix-ops': 2,
    'space-unary-ops': [2, { 'words': true, 'nonwords': false }],
    'spaced-comment': [2, 'always', {
      'exceptions': ['-', 'eslint'],
      'markers': [
        'global',
        'eslint',
        'eslint-enable',
        'eslint-disable',
        'eslint-env',
      ],
    }],
    'indent': [2, 2, {
      'SwitchCase': 1,
      'VariableDeclarator': { 'var': 2, 'let': 2, 'const': 3 },
    }],
    'quotes': [2, 'single', 'avoid-escape'],
    'linebreak-style': [2, 'unix'],
    'semi': [2, 'always'],
    'max-len': [2, 80, 2, { 'ignoreComments': true, 'ignoreUrls': true }],

    // ECMAScript 6
  },
};
