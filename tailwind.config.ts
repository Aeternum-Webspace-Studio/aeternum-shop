import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./docs/**/*.{md,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#fff7ed",
        surface: "#ffffff",
        surfaceSoft: "#ffedd5",
        border: "#111827",
        text: "#111827",
        muted: "#6b7280",
        primary: "#f97316",
        primaryDark: "#c2410c",
        accent: "#0ea5e9",
        success: "#16a34a",
        warning: "#f59e0b",
        danger: "#dc2626"
      },
      boxShadow: {
        soft: "8px 8px 0 #111827"
      },
      borderRadius: {
        xl2: "10px"
      }
    }
  },
  plugins: []
};

export default config;
