import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FAF4EF",
        ink: "#1A1A1A",
        "ink-warm": "#342F30",
        accent: "#E8291C",
        "ink-light": "#757071",
        "ink-muted": "#9E9899",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans:  ["var(--font-josefin)", "system-ui", "sans-serif"],
        ivy:   ["Ivy Mode", "Georgia", "serif"],
        jost:  ["var(--font-jost)", "sans-serif"],
      },
    },
  },
  // Override hover variant so it only fires on devices with a real pointer (mouse).
  // On touch screens, :hover gets "stuck" after a tap — this prevents that globally.
  plugins: [
    plugin(({ addVariant }) => {
      addVariant("hover", "@media (hover: hover) { &:hover }");
    }),
  ],
};

export default config;
