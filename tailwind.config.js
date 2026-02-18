
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        accent: '#7C5CFF',
        primary: '#8B5CF6',
        dark: '#0B0D10',
        panel: '#111318'
      },
      boxShadow: {
        'tosca': '0 10px 30px rgba(139, 92, 246, 0.3)',
      }
    },
  },
  plugins: [],
}
