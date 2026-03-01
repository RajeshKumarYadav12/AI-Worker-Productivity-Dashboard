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
        navy: { DEFAULT: "#1A2B3C", light: "#243544", dark: "#111E28" },
        teal: {
          DEFAULT: "#2A9D8F",
          light: "#3BB5A6",
          dark: "#1F7A70",
          muted: "#D1EFEC",
        },
        coral: {
          DEFAULT: "#E76F51",
          light: "#ED8C72",
          dark: "#C4593D",
          muted: "#FADFDA",
        },
        sage: {
          DEFAULT: "#8AB17D",
          light: "#A3C497",
          dark: "#6E9261",
          muted: "#E2EFE0",
        },
        amber: {
          DEFAULT: "#E9C46A",
          light: "#F0D28C",
          dark: "#C9A445",
          muted: "#FAF3DC",
        },
        surface: { DEFAULT: "#F5F7FA", card: "#FFFFFF", border: "#E1E5EA" },
        ink: { primary: "#1A2B3C", secondary: "#5A6B7C", muted: "#8A9BAC" },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(26,43,60,0.08), 0 1px 2px rgba(26,43,60,0.04)",
        "card-hover":
          "0 4px 12px rgba(26,43,60,0.12), 0 2px 4px rgba(26,43,60,0.06)",
      },
      borderRadius: {
        card: "8px",
      },
    },
  },
  plugins: [],
};
