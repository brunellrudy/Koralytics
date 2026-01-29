/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        "midnight": "#0f172a",
        "slate": "#1e293b",
        "steel": "#475569",
        "mist": "#e2e8f0",
        "accent": "#2563eb"
      }
    }
  },
  plugins: []
};
