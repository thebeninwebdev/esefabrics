import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors:{
        'primary': "#50c878",
        'complement': "#2e8b57",
        'accent':"#ffd700",
        'text':"#333333",
        "lighttext":"#555555",
        "secondary":"#f5f5f5",
        "primary-dark":"#50c878",
        "complement-dark":"#39ff14",
        "accent-dark":"#ffd700",
        "text-dark":"#ffffff",
        "textlight-dark":"#d3d3d3",
        "secondary-dark":"#333333"

      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
