/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        "midnight": "#0f172a",
        "koralytics-slate": "#1e293b",
        "slate": "#1e293b",
        "steel": "#475569",
        "mist": "#e2e8f0",
        "accent": "#2563eb"
      }
    }
  },
  plugins: []
};
