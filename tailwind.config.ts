import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f7f2ea',
          100: '#eee4d5',
          200: '#dcc8aa',
          300: '#c6a779',
          400: '#aa814f',
          500: '#8f6334',
          600: '#744a28',
          700: '#583820',
          800: '#38251a',
          900: '#201713',
          950: '#100b09',
        },
        accent: {
          DEFAULT: '#f4efe6',
          muted: '#aaa097',
        },
        brand: {
          red: '#d1463f',
          redDark: '#8f2624',
          gold: '#c6a15b',
          ink: '#090807',
        },
        background: {
          DEFAULT: '#090807',
          secondary: '#12100e',
          tertiary: '#1b1713',
        },
        surface: {
          DEFAULT: '#171310',
          hover: '#211b16',
          active: '#2a221c',
        },
        border: {
          DEFAULT: '#332a22',
          hover: '#4d3d31',
        },
        success: '#22c55e',
        warning: '#eab308',
        error: '#ef4444',
        info: '#3b82f6',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      animation: {
        'slide-left': 'slideLeft 30s linear infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        slideLeft: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      boxShadow: {
        'glow': '0 18px 60px rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(244, 239, 230, 0.04)',
        'glow-lg': '0 28px 90px rgba(0, 0, 0, 0.38), 0 0 0 1px rgba(209, 70, 63, 0.14)',
        'inner-light': 'inset 0 1px 0 rgba(244, 239, 230, 0.07)',
      },
      backdropBlur: {
        xs: '2px',
      },
      screens: {
        'xs': '480px',
        '3xl': '1920px',
      },
    },
  },
  plugins: [],
};

export default config;
