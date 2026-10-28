/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#F7F5F0',
        white: '#FFFFFF',
        ink: '#171717',
        charcoal: '#555555',
        stone: {
          DEFAULT: '#D9D5CE',
          light: '#EAE6DF',
          subtle: '#F2EFEB',
          dark: '#B8B3AA',
        },
        studio: {
          cream: '#FAF8F5',
          border: '#E8E4DC',
          accent: '#8C7D70',
          darkMuted: '#242424',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"DM Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        editorial: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
      },
      letterSpacing: {
        widest: '0.15em',
        ultra: '0.25em',
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(0, 0, 0, 0.03)',
        'elevated': '0 10px 30px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
