import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#fffdf5",
        foreground: "#2D241E",
        primary: "#8C3A21",
        "primary-hover": "#702E1A",
        accent: "#D99441",
        // Keeping some old utility colors if needed, but updating main ones
        card: "#ffffff",
        "text-muted": "#7d7063",
        "deep-brown": "#3d2817",
        cream: "#f6efe2",
      },
      fontFamily: {
        lora: ["var(--font-lora)", "serif"],
        epilogue: ["var(--font-epilogue)", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, rgba(35,22,10,0.92) 0%, rgba(180,83,9,0.45) 100%)",
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
        "card-hover":
          "0 10px 40px rgba(140, 58, 33, 0.08), 0 4px 12px rgba(0,0,0,0.04)",
        glow: "0 0 30px rgba(217, 148, 65, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
