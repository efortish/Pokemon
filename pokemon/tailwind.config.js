/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily:{
        sans: ['Poppins','sans-serif']
      },
      gridTemplateColumns:{
        '70/30':'70% 28%'
      },
      colors: {
        'customcyan': '#0CD4E4', 
        'redbattle': '#850D23',
      },
      keyframes: {
        softBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }, // Ajusta la altura del rebote 
        },
        scale: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' }},
      },
      animation: {
        'soft-bounce': 'softBounce 2.2s ease-in-out infinite', // Ajusta la duración 
        'scale': 'scale 1.5s ease-in-out infinite',
      },
      scrollbar: ['rounded'],
    },
    variants: {
      extend: {
        
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
}
