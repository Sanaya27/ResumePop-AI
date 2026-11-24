/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pop: {
          yellow: '#ffdb00',
          pink: '#ff4bb3',
          mint: '#6ee7b7',
          blush: '#fef2fb',
          surface: '#fffdfe',
          dark: '#110d17',
          border: '#0f0b15',
          borderSoft: '#2a2330',
          error: '#db2777',
          softYellow: '#fef08a',
          highlight: '#7fe8c5'
        }
      },
      fontFamily: {
        grotesk: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace']
      },
      boxShadow: {
        'pop-sm': '2px 2px 0px #0f0b15',
        'pop': '3px 3px 0px #0f0b15',
        'pop-md': '4px 4px 0px #0f0b15',
        'pop-lg': '6px 6px 0px #0f0b15',
        'pop-pink': '4px 4px 0px #ff4bb3',
        'pop-yellow': '4px 4px 0px #ffdb00',
        'pop-mint': '4px 4px 0px #6ee7b7'
      },
      borderRadius: {
        'card': '22px',
        'pill': '9999px'
      }
    },
  },
  plugins: [],
}
