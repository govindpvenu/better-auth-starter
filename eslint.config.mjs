import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import unusedImports from 'eslint-plugin-unused-imports';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
    // Next.js presets
    ...compat.extends('next/core-web-vitals', 'next/typescript'),

    {
        ignores: [
            'node_modules/**',
            '.next/**',
            'out/**',
            'build/**',
            'next-env.d.ts',
        ],
    },

    {
        plugins: {
            'unused-imports': unusedImports,
        },
        rules: {
            'prefer-const': 'warn', // change from "error" → "warn"
            '@typescript-eslint/no-unused-vars': 'warn', // Turn off the TypeScript rule

            // Auto-remove unused imports on --fix
            'unused-imports/no-unused-imports': 'error',
            '@typescript-eslint/no-explicit-any': 'warn',
            'react/no-unescaped-entities': 'warn', // Change from error to warning
            // Warn on unused vars, but allow underscore-prefix to intentionally ignore
            'unused-imports/no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                },
            ],
        },
    },
];

export default eslintConfig;
