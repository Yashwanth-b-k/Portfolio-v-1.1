/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        light: {
          bg: "#FFFFFF",
          secondary: "#F5F5F7",
          text: "#1D1D1F",
          muted: "#6E6E73",
          accent: "#0071E3",
          border: "#D2D2D7",
        },
        dark: {
          bg: "#000000",
          secondary: "#161617",
          text: "#F5F5F7",
          muted: "#A1A1A6",
          accent: "#2997FF",
          border: "#424245",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "Inter",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "SF Mono",
          "JetBrains Mono",
          "ui-monospace",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
      maxWidth: {
        content: "1024px",
        wide: "1280px",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      boxShadow: {
        tile: "0 2px 12px rgba(0,0,0,0.04), 0 20px 60px -20px rgba(0,0,0,0.12)",
        "tile-dark": "0 2px 12px rgba(0,0,0,0.6), 0 20px 60px -20px rgba(0,0,0,0.9)",
        window: "0 40px 120px -30px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06) inset",
      },
      transitionTimingFunction: {
        apple: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
