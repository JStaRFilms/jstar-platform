import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'jstar-blue': 'var(--color-jstar-blue)',
        'faith-purple': 'var(--color-faith-purple)',
        'growth-green': 'var(--color-growth-green)',
        'admin-red': 'var(--color-admin-red)',
        'sacred-gold': 'var(--color-sacred-gold)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        highlight: 'var(--color-highlight)',
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        border: 'var(--color-border)',
        ring: 'var(--color-ring)',
        error: 'var(--color-error)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        card: 'var(--color-card)',
        muted: 'var(--color-muted)',
        'muted-foreground': 'var(--color-muted-foreground)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Clash Display', 'sans-serif'],
      },
      animation: {
        'bounce': 'bounce 1s infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin': 'spin 1s linear infinite',
      }
    },
  },
  plugins: [],
}

export default config
