import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F4F0EB",
        ink: "#1A1A1A",
        "ink-warm": "#342f30",
        accent: "#E8291C",
        "ink-light": "#6B6B6B",
        "ink-muted": "#9E9E9E",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans:  ["var(--font-josefin)", "system-ui", "sans-serif"],
        ivy:   ["Ivy Mode", "Georgia", "serif"],
        jost:  ["var(--font-jost)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
