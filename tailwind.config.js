/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Light theme
        light: {
          bg: "#FFFFFF",
          secondary: "#F5F5F7",
          text: "#1D1D1F",
          accent: "#0071E3",
          border: "#D2D2D7",
        },
        // Dark theme
        dark: {
          bg: "#000000",
          secondary: "#111111",
          text: "#F5F5F7",
          accent: "#2997FF",
          border: "#333333",
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
      },
      maxWidth: {
        content: "1120px",
      },
      boxShadow: {
        apple: "0 4px 24px rgba(0, 0, 0, 0.08)",
        "apple-lg": "0 12px 48px rgba(0, 0, 0, 0.12)",
        "apple-dark": "0 4px 24px rgba(0, 0, 0, 0.5)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [],
};
