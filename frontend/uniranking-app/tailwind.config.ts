import type { Config } from 'tailwindcss';

export default {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Override default colors to use CSS variables
                background: 'var(--color-bg-primary)',
                surface: {
                    1: 'var(--color-surface-1)',
                    2: 'var(--color-surface-2)',
                    3: 'var(--color-surface-3)',
                    hover: 'var(--color-surface-hover)',
                },
                text: {
                    primary: 'var(--color-text-primary)',
                    secondary: 'var(--color-text-secondary)',
                    tertiary: 'var(--color-text-tertiary)',
                    muted: 'var(--color-text-muted)',
                    'on-brand': 'var(--color-text-on-brand)',
                },
                border: {
                    primary: 'var(--color-border-primary)',
                    secondary: 'var(--color-border-secondary)',
                    light: 'var(--color-border-light)',
                },
                // Brand colors
                brand: {
                    primary: 'var(--color-brand-primary)',
                    'primary-dark': 'var(--color-brand-primary-dark)',
                    'primary-light': 'var(--color-brand-primary-light)',
                    'primary-lighter': 'var(--color-brand-primary-lighter)',
                    'primary-bg': 'var(--color-brand-primary-bg)',
                },
                // Semantic colors
                success: {
                    DEFAULT: 'var(--color-success)',
                    dark: 'var(--color-success-dark)',
                    light: 'var(--color-success-light)',
                    lighter: 'var(--color-success-lighter)',
                    bg: 'var(--color-success-bg)',
                },
                info: {
                    DEFAULT: 'var(--color-info)',
                    dark: 'var(--color-info-dark)',
                    light: 'var(--color-info-light)',
                    lighter: 'var(--color-info-lighter)',
                    bg: 'var(--color-info-bg)',
                },
                highlight: {
                    DEFAULT: 'var(--color-highlight)',
                    dark: 'var(--color-highlight-dark)',
                    light: 'var(--color-highlight-light)',
                    lighter: 'var(--color-highlight-lighter)',
                    bg: 'var(--color-highlight-bg)',
                },
                error: {
                    DEFAULT: 'var(--color-error)',
                    dark: 'var(--color-error-dark)',
                    light: 'var(--color-error-light)',
                    lighter: 'var(--color-error-lighter)',
                    bg: 'var(--color-error-bg)',
                },
            },
            backgroundColor: {
                // Allow using color vars for bg
                primary: 'var(--color-bg-primary)',
                secondary: 'var(--color-bg-secondary)',
                tertiary: 'var(--color-bg-tertiary)',
            },
            textColor: {
                primary: 'var(--color-text-primary)',
                secondary: 'var(--color-text-secondary)',
                tertiary: 'var(--color-text-tertiary)',
                muted: 'var(--color-text-muted)',
            },
            borderColor: {
                primary: 'var(--color-border-primary)',
                secondary: 'var(--color-border-secondary)',
                light: 'var(--color-border-light)',
            },
        },
    },
    plugins: [],
} satisfies Config;
