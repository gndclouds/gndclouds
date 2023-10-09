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
        backgroundlightmode: "#fff",
        textlightmode: "#000",
        backgrounddarkmode: "#000",
        textdarkmode: "#fff",
      },
      fontFamily: {
        sans: [
          "Inter",
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
        largest: "65pt",
        larget: "36pt",
        large: "24pt",
        standard: "18pt",
        small: "14pt",
        smaller: "10pt",
        tiny: "6pt",
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
