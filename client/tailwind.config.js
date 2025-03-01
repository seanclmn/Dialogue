/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    extend: {
      colors: {
        "primary": "var(--primary-color)", // #2B66DD
        "secondary": "var(--secondary-color)", // #692bdd
        "bgd-color": "var(--bg-color)", // #ffffff
        "bgd-highlight": "var(--bg-highlight-color)", // #fafafad0
        "brd-color": "var(--border-color)", // #fafafad0
        "txt-color": "var(--text-color)", // #000000
        "my-txt-color": "var(--my-text-color)", // #ffffff
        "error": "var(--error)",
        "success": "var(--success)",
      },
      spacing: {
        128: "32rem",
        144: "36rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    }
  },
  plugins: [],
};
