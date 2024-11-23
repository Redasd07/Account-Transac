module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1e40af", // Bleu primaire
        secondary: "#f59e0b", // Jaune secondaire
        danger: "#dc2626", // Rouge pour suppression
        background: "#f3f4f6", // Fond clair
      },
    },
  },
  plugins: [],
};
