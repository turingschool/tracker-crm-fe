/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Helvetica Neue"],
    },
    extend: {
      backgroundImage: (theme) => ({
        none: "none",
        "turing-logo": "url('./assets/turing-logo-gray.png')",
      }),
      colors: {
        cyan: {
          500: "#3dbdd3",
          600: "#298895",
          700: "#2f97a8",
          800: " #278290",
        },
      },
    },
  },
  plugins: [],
};
