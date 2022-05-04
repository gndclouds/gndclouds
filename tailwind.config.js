module.exports = {
  content: ["./components/**/*.js", "./pages/**/*.js"],
  theme: {
    extend: {
      colors: {
        backgroundlight: "#AFC2AE",
        backgroundmid: "#AFC2AE",
        backgrounddark: "#AFC2AE",
        textlight: "#F1F1F1",
        textmid: "#F1F1F1",
        textdark: "#F1F1F1",
        background: "#AFC2AE",
        green: "#204231",
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
      spacing: {
        28: "7rem",
      },
      letterSpacing: {
        tighter: "-.04em",
      },
      lineHeight: {
        tight: 1.2,
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
      boxShadow: {
        sm: "0 5px 10px rgba(0, 0, 0, 0.12)",
        md: "0 8px 30px rgba(0, 0, 0, 0.12)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
