/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // <--- PERHATIKAN BARIS INI (Sapu Jagat)
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F2C23',
        gold: '#C8A165',
      }
    },
  },
  plugins: [],
};