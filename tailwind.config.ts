import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "zoku-bg": "#FAFAF7",
        "zoku-card": "#FFFFFF",
        "zoku-card2": "#F5F5EF",
        "zoku-border": "#E8E8E0",
        "zoku-text": "#1A1A14",
        purple: {
          DEFAULT: "#8B5CF6",
          light: "#A78BFA",
          dark: "#7C3AED",
        },
        pink: {
          DEFAULT: "#EC4899",
          light: "#F472B6",
          dark: "#DB2777",
        },
        cyan: {
          DEFAULT: "#06B6D4",
          light: "#22D3EE",
          dark: "#0891B2",
        },
        green: {
          DEFAULT: "#10B981",
          light: "#34D399",
          dark: "#059669",
        },
        amber: {
          DEFAULT: "#F59E0B",
          light: "#FCD34D",
          dark: "#D97706",
        },
        muted: "#64748B",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-gradient":
          "linear-gradient(135deg, #FAFAF7 0%, #FFFFFF 50%, #FAFAF7 100%)",
        "purple-pink":
          "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
        "cyan-purple":
          "linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)",
        "green-cyan":
          "linear-gradient(135deg, #10B981 0%, #06B6D4 100%)",
        "amber-pink":
          "linear-gradient(135deg, #F59E0B 0%, #EC4899 100%)",
      },
      animation: {
        "gradient-x": "gradient-x 4s ease infinite",
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "slide-up": "slide-up 0.5s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
      },
      keyframes: {
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      boxShadow: {
        "neon-purple": "0 0 20px rgba(139, 92, 246, 0.2)",
        "neon-pink": "0 0 20px rgba(236, 72, 153, 0.2)",
        "neon-cyan": "0 0 20px rgba(6, 182, 212, 0.2)",
        "neon-green": "0 0 20px rgba(16, 185, 129, 0.2)",
        "neon-amber": "0 0 20px rgba(245, 158, 11, 0.2)",
        "card": "0 10px 40px rgba(26, 26, 20, 0.05)",
        "card-hover": "0 20px 60px rgba(26, 26, 20, 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
