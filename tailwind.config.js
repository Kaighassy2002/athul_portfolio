/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'orbitron': ['Orbitron', 'sans-serif'],
        'tech-mono': ['Share Tech Mono', 'monospace'],
        'rajdhani': ['Rajdhani', 'sans-serif'],
      },
      colors: {
        'neon': {
          'green': '#00ff41',
          'cyan': '#00ffff',
          'magenta': '#ff00ff',
          'blue': '#0080ff',
        },
        'cyber': {
          'black': '#000000',
          'dark': '#0a0a0a',
          'gray': '#1a1a1a',
          'light-gray': '#2a2a2a',
        },
      },
      animation: {
        'glitch': 'glitch 0.3s infinite',
        'hologram-glow': 'hologram-glow 2s ease-in-out infinite',
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'rain-fall': 'rain-fall linear infinite',
        'scanline': 'scanline 8s linear infinite',
        'blink': 'blink 1s infinite',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'scale-in': 'scaleIn 0.6s ease-out',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { 
            textShadow: '2px 0 #00ffff, -2px 0 #ff00ff',
            transform: 'translate(0)',
          },
          '20%': { 
            textShadow: '-2px 0 #00ffff, 2px 0 #ff00ff',
            transform: 'translate(2px, -2px)',
          },
          '40%': { 
            textShadow: '2px 0 #ff00ff, -2px 0 #00ffff',
            transform: 'translate(-2px, 2px)',
          },
          '60%': { 
            textShadow: '-2px 0 #00ffff, 2px 0 #ff00ff',
            transform: 'translate(2px, 2px)',
          },
          '80%': { 
            textShadow: '2px 0 #ff00ff, -2px 0 #00ffff',
            transform: 'translate(-2px, -2px)',
          },
        },
        'hologram-glow': {
          '0%, 100%': {
            boxShadow: '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff, inset 0 0 10px rgba(0, 255, 255, 0.1)',
          },
          '50%': {
            boxShadow: '0 0 20px #00ffff, 0 0 40px #00ffff, 0 0 60px #00ffff, inset 0 0 20px rgba(0, 255, 255, 0.2)',
          },
        },
        'pulse-neon': {
          '0%, 100%': {
            opacity: '1',
            boxShadow: '0 0 10px #00ff41, 0 0 20px #00ff41',
          },
          '50%': {
            opacity: '0.8',
            boxShadow: '0 0 20px #00ff41, 0 0 40px #00ff41',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(2deg)' },
        },
        'rain-fall': {
          'to': { transform: 'translateY(100vh)' },
        },
        scanline: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(4px)' },
        },
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      backdropBlur: {
        'cyber': '10px',
      },
    },
  },
  plugins: [],
}



