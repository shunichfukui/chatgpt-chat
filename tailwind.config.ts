import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundColor: {
        blackblue: '#000011',
        blackgray: '#696969',
      },
      textColor: {
        'white-400': '#94a3b8',
      },
    },
  },
  plugins: [],
};
export default config;
