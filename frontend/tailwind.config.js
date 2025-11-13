/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        goodwill: {
          // Extracted from goodwillstaffing.ca
          primary: '#02646f', // Main brand teal/cyan
          secondary: '#e5482e', // Red/orange accent
          accent: '#e5482e', // Accent red/orange
          light: '#eefbfe', // Very light blue/cyan background
          dark: '#1a1a1a', // Dark text (almost black for maximum contrast)
          text: '#1a1a1a', // Primary text color (almost black for readability)
          border: '#d1e7f0', // Border color (light teal)
          'text-muted': '#4a5568', // Muted text (dark gray)
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', '"Helvetica Neue"', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(2, 100, 111, 0.08)',
        'medium': '0 4px 16px rgba(2, 100, 111, 0.12)',
        'large': '0 8px 24px rgba(2, 100, 111, 0.16)',
        'glow': '0 0 20px rgba(2, 100, 111, 0.3)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
}

