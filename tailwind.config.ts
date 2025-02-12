import type { Config } from "tailwindcss";
import colors from 'tailwindcss/colors'
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
    colors:{
      ...colors,
      'purple':'rgb(44, 51, 214)',
      'white':'rgb(255, 255, 255)',
      'black':'rgb(0, 0, 0)',
      'grey':'rgb(16, 16, 16)',
      'pink':'rgb(255, 192, 203)',
      'orange':'rgb(255, 165, 0)',
      'yellow':'rgb(255, 255, 0)',
      'lime':'rgb(0, 255, 0)',
      'mint':'rgb(189, 252, 201)',
      'test':'rgb(255, 192, 203)',
      'test2':'rgb(44, 51, 214)',
      'grey2':'rgb(16, 16, 16)',
    }
  },
  plugins: [],

} satisfies Config;
