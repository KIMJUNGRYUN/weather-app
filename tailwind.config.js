/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"], // Tailwind가 적용될 파일 경로
  theme: {
    extend: {
      colors: {
        customBackground: "#272f59",
        customCard: "#818cf8",
    }, 
  },
},
  plugins: [], 
};
