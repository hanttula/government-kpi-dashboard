import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#EFF4FB',
          100: '#D6E4F0',
          200: '#ADC8E1',
          300: '#7AAAC9',
          400: '#4A8AB0',
          500: '#2D6E95',
          600: '#1E3A5F',
          700: '#163050',
          800: '#0F2240',
          900: '#091830',
        },
        civic: {
          blue: '#2563EB',
          green: '#16A34A',
          amber: '#D97706',
          red: '#DC2626',
          slate: '#475569',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'card-hover': '0 4px 12px 0 rgb(0 0 0 / 0.10), 0 2px 4px -2px rgb(0 0 0 / 0.06)',
      },
    },
  },
  plugins: [],
}

export default config
