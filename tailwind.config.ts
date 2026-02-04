import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.7s ease-out forwards",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        mono: ["Fira Code", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        // Legacy / compatibility
        backgroundLight: "#f3f4f0",
        textLight: "#333333",
        backgroundDark: "#1c1c1c",
        textDark: "#f2f2f2",
        "forest-green": "#228B22",
        "forest-green-dark": "#1a6b1a",
        // New palette – Primary
        "primary-black": "#000000",
        "primary-gray": "#eeeeee",
        "primary-white": "#ffffff",
        // New palette – Secondary
        "secondary-yellow": "#fadc4b",
        "secondary-orange": "#ff6622",
        "secondary-blue": "#0068e2",
        "secondary-green": "#04b53b",
        // New palette – Tertiary
        "tertiary-pink": "#fa91b7",
        "tertiary-lavender": "#d4b8ff",
        "tertiary-bronze": "#b45e06",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
