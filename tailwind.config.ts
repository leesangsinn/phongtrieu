import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design tokens (kênh RGB khai báo trong globals.css -> đổi màu 1 chỗ, giữ được opacity /xx)
        // bg-main = background | bg-surface = surface | text-main = foreground | text-muted
        background: "rgb(var(--rgb-bg-main) / <alpha-value>)",
        surface: "rgb(var(--rgb-bg-surface) / <alpha-value>)",
        foreground: "rgb(var(--rgb-text-main) / <alpha-value>)",
        "text-muted": "rgb(var(--rgb-text-muted) / <alpha-value>)",
        "accent-primary": "rgb(var(--rgb-accent-primary) / <alpha-value>)",
        "accent-secondary": "rgb(var(--rgb-accent-secondary) / <alpha-value>)",
        "accent-soft": "rgb(var(--rgb-accent-soft) / <alpha-value>)",
        "footer-dark": "rgb(var(--rgb-footer-dark) / <alpha-value>)",
        card: "rgb(var(--rgb-card) / <alpha-value>)",
        // Alias cho class cũ trong code
        primary: "rgb(var(--rgb-accent-primary) / <alpha-value>)",
        "primary-hover": "rgb(var(--rgb-accent-secondary) / <alpha-value>)",
        accent: "rgb(var(--rgb-accent-secondary) / <alpha-value>)",
        "deep-brown": "rgb(var(--rgb-text-main) / <alpha-value>)",
        cream: "rgb(var(--rgb-bg-surface) / <alpha-value>)",
        "earth-dark": "rgb(var(--rgb-footer-dark) / <alpha-value>)",
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "Georgia", "serif"],
        epilogue: ["var(--font-epilogue)", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(to right, rgba(44,26,20,0.9) 0%, rgba(122, 2, 33,0.5) 100%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulse: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.05)", opacity: "0.8" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s ease forwards",
        "fade-in": "fade-in 1s ease forwards",
        float: "float 3s ease-in-out infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      boxShadow: {
        brand: "0 10px 40px -10px rgba(122, 2, 33, 0.15)",
        "card-hover": "0 10px 40px -10px rgba(122, 2, 33, 0.15)",
        glow: "0 0 30px rgba(156, 26, 54, 0.25)",
      },
    },
  },
  plugins: [typography],
};

export default config;
