/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        offblack: '#02000C',
        greenlight: '#00FAAE'
      },
      fontFamily: {
        inconsolata: ["Inconsolata", "monospace"]
      }
    },
  },
  plugins: [],
}

