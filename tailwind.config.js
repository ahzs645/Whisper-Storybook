/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,mdx}',
    '../WhisperDesk-1/src/renderer/whisperdesk-ui/src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        arcgray: {
          100: 'hsl(240 2% 92%)',
          300: 'rgb(167 168 171)',
          400: 'hsl(220 3% 41%)',
          600: 'rgb(56 57 59)',
          700: 'rgb(46 47 48)',
          800: 'rgb(37 38 39)',
          900: 'rgb(30 31 31)',
        },
        darkgray: {
          100: 'hsl(240 1% 84%)',
          600: 'rgb(56 57 59)',
          800: 'rgb(35 36 37)',
          900: 'rgb(26 27 28)',
          950: 'rgb(17 17 18)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
};
