module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    extends: [
      'airbnb-typescript',
    ],
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
      project: "./tsconfig.json",
      tsconfigRootDir: __dirname,
    },
    ignorePatterns: ['.eslintrc.js', 'webpack.config.js'],
    plugins: [
      'import',
    ],
    extends: [
      "plugin:@typescript-eslint/recommended",
      "plugin:prettier/recommended" 
    ],
    rules: {
      'no-unused-vars': 'warn',
      'arrow-parens': 'warn', // TODO check it
      'no-unused-expressions': 'off',
      'prefer-destructuring': 'off',
      'no-restricted-syntax': 'off',
      'click-events-have-key-events': 'off',
      'no-noninteractive-element-interactions': 'off',
      'max-len': ['error', {
        'code': 140,
        'ignoreTrailingComments': true,
        'ignoreUrls': true,
      }],
      'no-continue': "off",
      'no-underscore-dangle': ["off", { allowFunctionParams: true }],
      'no-plusplus': ['warn', { allowForLoopAfterthoughts: true }],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn"],
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-shadow': 'off',
      'typescript-sort-keys/interface': 'off',
      'import/prefer-default-export': 'off',
      'import/no-extraneous-dependencies': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'linebreak-style': 0,
    }
  };
  