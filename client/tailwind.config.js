/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        Blue: {
          100: "#E5ECF8",
          200: "#C6D6EF",
          300: "#8DADE0",
          400: "#5483D0",
          500: "#2F5FAC",
          600: "#234781",
          700: "#183056",
          800: "#0C182B",
          900: "#020D1E",
        },
        Gray: {
          100: "#F6F7FC",
          200: "#F1F2F6",
          300: "#E4E6ED",
          400: "#D6D9E4",
          500: "#C8CCDB",
          600: "#9AA1B9",
          700: "#646D89",
          800: "#424C6B",
          900: "#2A2E3F",
        },
        Orange: {
          100: "#FBAA1C",
          500: "#F47E20",
        },
        Green: {
          100: "#2FAC8E",
        },
      },
      fontSize: {
        Headline1: "66px",
        Headline2: "36px",
        Headline3: "24px",
        Body1: "20px",
        Body2: "16px",
        Body3: "14px",
        Body4: "12px",
      },
      fontWeight: {
        Headline1: "500",
        Headline2: "500",
        Headline3: "500",
        Body1: "400",
        Body2: "400",
        Body3: "400",
        Body4: "400",
      },
      screens: {
        sm: "375px",
        md: "768px",
        xl: "1440px",
      },
      boxShadow: {
        shadow1: "2px 2px 12px 0 rgba(0, 0, 0, 0.08)",
        shadow2: "2px 2px 12px 0 rgba(64, 50, 133, 0.12)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
    // other plugins
  ],
};
