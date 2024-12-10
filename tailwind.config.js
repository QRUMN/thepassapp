/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'brand': {
          primary: '#9B403D',
          light: '#FBFAFA',
          accent: '#DDD6CC',
          dark: '#313131',
        },
        'dark': {
          primary: '#9B403D',
          background: '#1F1F1F',
          surface: '#2D2D2D',
          accent: '#4A4A4A',
          text: '#FBFAFA',
        }
      },
    },
  },
  plugins: [],
}
