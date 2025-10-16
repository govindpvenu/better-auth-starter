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
            // Turn off the standard unused-vars (we’ll replace it)
            '@typescript-eslint/no-unused-vars': 'off',

            // Auto-remove unused imports on --fix
            'unused-imports/no-unused-imports': 'error',

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
