/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#003DA5', // Blue from Cayman Islands flag
          '50': '#eff6ff',
          '100': '#dbeafe',
          '200': '#bfdbfe',
          '300': '#93c5fd',
          '400': '#60a5fa',
          '500': '#3b82f6',
          '600': '#1d4ed8',
          '700': '#003DA5', // Same as DEFAULT
          '800': '#002d7a', // Darker blue for hover states
          '900': '#001d52',
          'light': '#1a56c4', // Lighter blue
          'dark': '#002d7a', // Same as 800
        },
        secondary: '#F5F5F5',
        'secondary-light': '#FFFFFF',
        'secondary-dark': '#E5E5E5',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-merriweather)', 'serif'],
      },
      typography: theme => ({
        DEFAULT: {
          css: {
            color: '#1f2937', // text-gray-800
            lineHeight: '1.65', // Slightly increased line height for readability
            a: {
              color: '#003DA5',
              '&:hover': {
                color: '#002d7a',
              },
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            h1: {
              fontFamily: 'var(--font-merriweather), serif',
              color: '#111827', // text-gray-900
              fontWeight: '700',
            },
            h2: {
              fontFamily: 'var(--font-merriweather), serif',
              color: '#111827', // text-gray-900
              fontWeight: '700',
            },
            h3: {
              fontFamily: 'var(--font-merriweather), serif',
              color: '#111827', // text-gray-900
              fontWeight: '600',
            },
            h4: {
              fontFamily: 'var(--font-inter), sans-serif',
              color: '#374151', // text-gray-700
              fontWeight: '600',
            },
            p: {
              marginTop: '1em',
              marginBottom: '1em',
            },
            ol: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },
            ul: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },
            li: {
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
            blockquote: {
              fontStyle: 'normal',
              fontWeight: '500',
              borderLeftColor: '#003DA5',
            },
          },
        },
        dark: {
          css: {
            color: '#e5e7eb', // text-gray-200 — brighter for readability
            a: {
              color: '#60a5fa', // primary-400 (blue)
              '&:hover': {
                color: '#93c5fd', // primary-300
              },
            },
            h1: {
              color: '#f9fafb', // text-gray-50
            },
            h2: {
              color: '#f9fafb', // text-gray-50
            },
            h3: {
              color: '#f3f4f6', // text-gray-100
            },
            h4: {
              color: '#e5e7eb', // text-gray-200
            },
            blockquote: {
              borderLeftColor: '#60a5fa', // primary-400
              color: '#d1d5db', // text-gray-300
            },
            strong: {
              color: '#f3f4f6', // text-gray-100
            },
            code: {
              color: '#e5e7eb', // text-gray-200
            },
            figcaption: {
              color: '#9ca3af', // text-gray-400
            },
            hr: {
              borderColor: '#374151', // text-gray-700
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 