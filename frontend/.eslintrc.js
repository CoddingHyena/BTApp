module.exports = {
    root: true,
    env: {
      node: true,
      browser: true,
      es2021: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended', // Если вы используете React в frontend
      'plugin:react-hooks/recommended', // Для правил хуков React
      'prettier', // Должен быть последним в списке
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true, // Если вы используете JSX
      },
    },
    plugins: ['@typescript-eslint', 'react', 'react-hooks'],
    settings: {
      react: {
        version: 'detect', // Автоматически определять версию React
      },
    },
    rules: {
      // Общие правила
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-unused-vars': 'off', // Отключаем базовое правило
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Включаем TS вариант
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'off',
      
      // React правила
      'react/prop-types': 'off', // Если вы используете TypeScript, prop-types не нужны
      'react/react-in-jsx-scope': 'off', // Не нужно в React 17+ или при использовании vite
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
    // Разные настройки для разных файлов
    overrides: [
      {
        files: ['*.js'],
        rules: {
          '@typescript-eslint/no-var-requires': 'off',
        },
      },
    ],
  };