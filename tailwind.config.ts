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
        background: "#f8fafc",
        surface: "#ffffff",
        surfaceSoft: "#f1f5f9",
        border: "#e2e8f0",
        text: "#0f172a",
        muted: "#64748b",
        primary: "#4f46e5",
        primaryDark: "#3730a3",
        accent: "#0891b2",
        success: "#16a34a",
        warning: "#f59e0b",
        danger: "#dc2626"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(15, 23, 42, 0.06)"
      },
      borderRadius: {
        xl2: "16px"
      }
    }
  },
  plugins: []
};

export default config;
