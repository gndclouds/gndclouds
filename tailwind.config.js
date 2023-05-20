/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        backgroundlightmode: "#f9ebbe",
        textlightmode: "#6643b6",
        backgrounddarkmode: "#6643b6",
        textdarkmode: "#f9ebbe",
      },
      fontFamily: {
        sans: [
          "Fivo Sans",
          "IBM Plex Sans",
          "Helvetica Neue",
          "ui-sans-serif",
          "system-ui",
        ],
        serif: ["IBM Plex Serif", "ui-serif", "Georgia"],
        mono: [
          "Fira Code",
          "IBM Plex Mono",
          "monospace",
          "ui-monospace",
          "SFMono-Regular",
        ],
      },

      fontSize: {
        xs: ["10px", "18px"],
        sm: ["10px", "21px"],
        base: ["18px", "24px"],
        lg: ["18px", "27px"],
        xl: ["42px", "54px"],
      },
      fontWeight: {
        hairline: 100,
        "extra-light": 100,
        thin: 200,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        "extra-bold": 800,
        black: 900,
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
