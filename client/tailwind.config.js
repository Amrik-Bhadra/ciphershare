/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // "primary": "#1065FE",
        "primary": "#00bbf9",
        // "primary": "#0466c8",
        "secondary": "#333333",
        "gray-light1": "#eee",
        "gray-light2": "#f9f9f9",
        "gray-dark1": "#ccc",

        "light-bg": "#f1f1f1",
        "dark-bg": "#222",
        "dark-sec-bg": "#303030",
        "dark-ter-bg": "#464646",


        "warning": "#FFB400",
        "error": "#FF0000"
      }
    },
  },
  plugins: [],
}