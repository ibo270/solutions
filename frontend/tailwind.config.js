/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      keyframes: {
        cloud: {
          "0%": { transform: "translateX(0) scale(var(--tw-scale-x,1))" },
          "100%": { transform: "translateX(120%)" },
        },
        plane: {
          "0%":   { "--x":"60px",   "--y":"300px", transform:"rotate(-8deg)" },
          "20%":  { "--x":"260px",  "--y":"230px", transform:"rotate(5deg)" },
          "40%":  { "--x":"420px",  "--y":"330px", transform:"rotate(12deg)" },
          "60%":  { "--x":"600px",  "--y":"230px", transform:"rotate(-2deg)" },
          "80%":  { "--x":"860px",  "--y":"180px", transform:"rotate(6deg)" },
          "100%": { "--x":"1040px", "--y":"260px", transform:"rotate(0deg)" },
        },
      },
      animation: {
        cloud: "cloud 48s linear infinite",
        cloudSlow: "cloud 60s linear infinite",
        cloudFast: "cloud 38s linear infinite",
        plane: "plane 9s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
