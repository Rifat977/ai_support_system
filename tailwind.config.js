/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'bounce': 'bounce 1s infinite',
      },
    },
  },
  plugins: [],
  safelist: [
    {
      pattern: /(bg|text|ring)-(indigo|purple|blue|emerald|rose)-(400|500|600)/,
    },
  ],
};