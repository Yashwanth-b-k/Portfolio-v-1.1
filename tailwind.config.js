/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Chunky arcade caps — titles and tiny HUD labels only.
        pixel: ['"Press Start 2P"', "ui-monospace", "monospace"],
        // Headings and buttons.
        head: ['"Jersey 25"', "ui-monospace", "monospace"],
        // Body copy.
        body: ["VT323", "ui-monospace", "Menlo", "Consolas", "monospace"],
        mono: ["VT323", "ui-monospace", "Menlo", "Consolas", "monospace"],
      },
      maxWidth: {
        content: "1024px",
        wide: "1240px",
      },
    },
  },
  plugins: [],
};
