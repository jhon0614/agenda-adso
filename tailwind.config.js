/** @type {import('tailwindcss').Config} */

// Instructor: Gustavo Bolaños – Curso: Desarrollo Web – ReactJS (Agenda ADSO)
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        senaPurple: "#7c3aed",
        senaPurpleDark: "#5b21b6",
      },
    },
  },
  plugins: [],
};
