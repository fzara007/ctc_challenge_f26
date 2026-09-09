import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    fontSize: {
      xs: ['1rem', { lineHeight: '1.4rem' }],
      sm: ['1.15rem', { lineHeight: '1.6rem' }],
      base: ['1.35rem', { lineHeight: '1.8rem' }],
      lg: ['1.55rem', { lineHeight: '2rem' }],
      xl: ['1.75rem', { lineHeight: '2.1rem' }],
      '2xl': ['2rem', { lineHeight: '2.3rem' }],
      '3xl': ['2.6rem', { lineHeight: '2.9rem' }],
    },
    extend: {
      colors: {
        brand: {
          50: '#faf3ee',
          100: '#f3e2d5',
          200: '#e6c3ab',
          400: '#cf9868',
          500: '#c17f4d',   // main accent — muted terracotta
          600: '#a8683c',
          900: '#5c3720',
        },
      },
    },
  },
  plugins: [],
};

export default config;
