/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    fontFamily:{
      sans:["Helvetica Neue"]
    },
    extend: {
      backgroundImage:theme => ({
        none:"none",
        'turing-logo':"url('turing-logo-gray.png')"
      })
    },
  },
  plugins: [],
}

