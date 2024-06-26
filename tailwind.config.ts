import cq from '@tailwindcss/container-queries'
import type { Config } from 'tailwindcss'
import { fontFamily, screens } from 'tailwindcss/defaultTheme'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      '3xs': '375px',
      '2xs': '410px',
      xs: '475px',
      ...screens,
    },
    extend: {
      screens: {
        md: '720px',
      },
      colors: {
        'app-bg': 'rgb(var(--app-bg) / <alpha-value>)',
        'app-fg': 'rgb(var(--app-fg) / <alpha-value>)',
        'app-bg-inverted': 'rgb(var(--app-bg-inverted) / <alpha-value>)',
        'app-fg-inverted': 'rgb(var(--app-fg-inverted) / <alpha-value>)',
        error: 'rgb(var(--error) / <alpha-value>)',
        'error-dark': 'rgb(var(--error-dark) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
        'success-dark': 'rgb(var(--success-dark) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        info: 'rgb(var(--info) / <alpha-value>)',
        danger: 'rgb(var(--danger) / <alpha-value>)',
        'danger-dark': 'rgb(var(--danger-dark) / <alpha-value>)',
        keyline: 'rgb(var(--keyline) / <alpha-value>)',
        highlight: 'rgb(var(--highlight) / <alpha-value>)',
        'gr33n-100': 'rgb(var(--gr33n-100) / <alpha-value>)',
        'y3llow-50': 'rgb(var(--y3llow-50) / <alpha-value>)',
        'y3llow-0': 'rgb(var(--y3llow-0) / <alpha-value>)',
        gr33n: {
          500: 'rgb(var(--gr33n-500) / <alpha-value>)',
          700: 'rgb(var(--gr33n-700) / <alpha-value>)',
          900: 'rgb(var(--gr33n-900) / <alpha-value>)',
        },
        r3d: {
          500: 'rgb(var(--r3d-500) / <alpha-value>)',
          700: 'rgb(var(--r3d-700) / <alpha-value>)',
        },
        blu3: {
          100: 'rgb(var(--blu3-100) / <alpha-value>)',
          200: 'rgb(var(--blu3-200) / <alpha-value>)',
          300: 'rgb(var(--blu3-300) / <alpha-value>)',
          400: 'rgb(var(--blu3-400) / <alpha-value>)',
          500: 'rgb(var(--blu3-500) / <alpha-value>)',
          600: 'rgb(var(--blu3-600) / <alpha-value>)',
          700: 'rgb(var(--blu3-700) / <alpha-value>)',
          800: 'rgb(var(--blu3-800) / <alpha-value>)',
          900: 'rgb(var(--blu3-900) / <alpha-value>)',
        },
        p1nk: {
          100: 'rgb(var(--p1nk-100) / <alpha-value>)',
          500: 'rgb(var(--p1nk-500) / <alpha-value>)',
          700: 'rgb(var(--p1nk-700) / <alpha-value>)',
        },
        y311ow: {
          100: 'rgb(var(--y311ow-100) / <alpha-value>)',
          500: 'rgb(var(--y311ow-500) / <alpha-value>)',
        },
        'lumin0us-yellow': {
          500: 'rgb(var(--lumin0us-yellow-500) / <alpha-value>)'
        },
        purpl3: {
          500: 'rgb(var(--purpl3-500) / <alpha-value>)'
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
        mono: ['var(--font-mono)', ...fontFamily.mono],
        sk: ['var(--sk-typeface)', ...fontFamily.sans],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      spacing: {
        112: '28rem',
        128: '32rem',
        144: '36rem',
        160: '40rem',
        176: '44rem',
        192: '48rem',
        208: '52rem',
        224: '56rem',
        240: '60rem',
        256: '64rem',
        272: '68rem',
        288: '72rem',
        304: '76rem',
        320: '80rem',
        336: '84rem',
        352: '88rem',
        368: '92rem',
        384: '96rem',
      },
      transitionProperty: {
        bg: 'background-color',
      },
      aria: {
        current: 'current=page',
      },
      animation: {
        blink: 'blink 1s linear infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '0' },
          '50%': { opacity: '1' },
        },
      },
      scale: {
        '-100': '-1',
      },
    },
  },
  darkMode: ['class', '[data-theme=dark]'],
  plugins: [cq],
}

export default config
