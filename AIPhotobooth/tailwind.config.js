/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'photobooth-purple': {
          400: '#a855f7',
          500: '#9333ea',
          600: '#7e22ce',
          700: '#6b21a8',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        'photobooth-blue': {
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin': 'spin 1s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
        'gradient-shift': 'gradient-shift 15s ease infinite',
      },
      backgroundSize: {
        'auto': 'auto',
        'cover': 'cover',
        'contain': 'contain',
        '200%': '200%',
      },
      boxShadow: {
        'neon': '0 0 5px rgba(168, 85, 247, 0.5), 0 0 20px rgba(168, 85, 247, 0.3)',
        'neon-hover': '0 0 10px rgba(168, 85, 247, 0.7), 0 0 30px rgba(168, 85, 247, 0.5), 0 0 50px rgba(168, 85, 247, 0.3)',
      },
      scale: {
        '103': '1.03',
        '105': '1.05',
      },
      transitionDuration: {
        '2000': '2000ms',
      },
    },
  },
  plugins: [],
}; 