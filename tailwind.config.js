/** @type {import('tailwindcss').Config} */

export default {
  content: [],
  theme: {
    extend: {
      fontFamily: {
        alexandria: ['Alexandria', 'sans-serif'],
      },
      
    },
    colors: {
      background: "#FFFFFF", // Hintergrundfarbe
      primary: "#184AAC",    // Erste Farbe
      secondary: "#FABD59",  // Zweite Farbe
      tertiary: "#1C2D49",   // Dritte Farbe
    },

  },

  daisyui: {
    themes: ["light"],
    rtl: true,
  },

  plugins: [require("daisyui")],
}
