import js from '@eslint/js';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import prettierConfig from 'eslint-config-prettier';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    // 검사할 파일 확장자 설정
    files: ['**/*.{js,mjs,cjs,ts,tsx,jsx}'],
    languageOptions: {
      parser: tsParser, // TypeScript 파서 사용
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true, // JSX 지원 활성화
        },
        project: './tsconfig.json', // TypeScript 프로젝트 설정
      },
      globals: {
        ...globals.browser, // 브라우저 환경 글로벌 변수
        ...globals.node, // Node.js 글로벌 변수
      },
    },
  },
  // JavaScript 규칙 기본값
  js.configs.recommended,
  // TypeScript 규칙
  tsPlugin.configs.recommended,
  // React 규칙
  reactPlugin.configs.flat.recommended,
  // Prettier 규칙 (충돌 방지)
  prettierConfig,
  {
    rules: {
      // React JSX 규칙 설정
      'react/react-in-jsx-scope': 'off', // React 17+에서 필요 없음
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // 사용하지 않는 변수 경고 (예: `_id` 무시)
      'prettier/prettier': 'warn', // Prettier 스타일 위반 시 경고
    },
  },
];