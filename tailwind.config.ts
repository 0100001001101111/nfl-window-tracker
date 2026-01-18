import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Bloomberg Terminal aesthetic
        background: '#0a0a0f',
        card: '#12121a',
        'card-hover': '#1a1a24',
        border: '#2a2a35',
        // Window status colors
        'window-elite': '#00ff88',
        'window-favorable': '#88ff00',
        'window-caution': '#ffaa00',
        'window-danger': '#ff6600',
        'window-closed': '#ff4444',
        // Text colors
        'text-primary': '#e8e8e8',
        'text-secondary': '#a0a0a0',
        'text-muted': '#6b7280',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
export default config
