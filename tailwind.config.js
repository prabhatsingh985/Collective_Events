/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Partiful Tokens
        'midnight-ink': '#000000',
        'pure-canvas': '#ffffff',
        graphite: '#333333',
        slate: '#666666',
        ash: '#999999',
        fog: '#b3b3b3',
        silver: '#cccccc',
        'warm-sand': '#d9c58b',
        'party-pink': '#f8c4ff',
        'sky-periwinkle': '#96c4ff',
        spearmint: '#85dadc',
        'midnight-blue': '#001666',

        // Semantic RSVP colors
        rsvp: {
          going: '#31c431',
          maybe: '#ffae00',
          cant: '#ff0000',
        },

        // Backward-compatible color aliases mapping to Partiful palette
        blush: {
          cardstock: '#ffffff', // Shifted to pure white canvas!
          light: '#ffffff',
          dark: '#f9f9fb',
        },
        ink: {
          black: '#000000',
          rich: '#111111',
          muted: '#333333',
        },
        paper: {
          white: '#ffffff',
          warm: '#fdfdfd',
        },
        steel: {
          gray: '#666666',
          light: '#999999',
          dark: '#333333',
        },
        festival: {
          violet: '#001666',
          deep: '#00104a',
          light: '#2a3b8f',
        },
        spotlight: {
          magenta: '#f8c4ff',
          vivid: '#e0a0ea',
          muted: '#fbe2ff',
        },
        curtain: {
          orange: '#000000', // Primary actions are Midnight Ink!
          racing: '#111111',
          dark: '#000000',
        },
        turf: {
          green: '#31c431',
          mint: '#31c431',
          emerald: '#28a728',
        },
        gold: {
          foil: '#d9c58b',
          metallic: '#c7b070',
        },
        // Hot Wheels Collector Palette
        hw: {
          orange: '#ff5400',
          flame: '#ff1a1a',
          yellow: '#ffcc00',
          track: '#121212',
          redline: '#d90429',
          amber: '#fb8500',
        },

        // Trading Cards Stadium & Foil Palette
        cards: {
          stadium: '#081c15',
          emerald: '#10b981',
          electric: '#2563eb',
          gold: '#f59e0b',
          holo: '#a855f7',
          slab: '#0f172a',
          psa: '#dc2626',
          bgs: '#d97706',
        },
      },
      fontFamily: {
        walsheim: ['var(--font-lausanne)', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-lausanne)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        racing: ['Impact', 'Haettenschweiler', 'Arial Black', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.03em',
        tight: '-0.02em',
        walsheim: '-0.02em',
        'walsheim-tight': '-0.04em',
      },
      borderRadius: {
        card: '12px',
        input: '8px',
        button: '8px',
        modal: '16px',
        nav: '4px',
        pill: '960px',
      },
      boxShadow: {
        'partiful-sm': 'rgba(0, 0, 0, 0.1) 0px 0px 6px 0px',
        'partiful-lg': 'rgba(0, 0, 0, 0.1) 0px 0px 20px 0px',
        'partiful-card': 'rgba(0, 0, 0, 0.05) 0px 0.8px 2.4px -0.6px, rgba(0, 0, 0, 0.05) 0px 2.4px 7.2px -1.25px, rgba(0, 0, 0, 0.05) 0px 6.4px 19.1px -1.875px, rgba(0, 0, 0, 0.05) 0px 20px 60px -2.5px',
        card: 'rgba(0, 0, 0, 0.08) 0px 2px 8px 0px',
        soft: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        elevated: '0 20px 40px -15px rgba(0, 0, 0, 0.08)',
        broadside: 'rgba(0, 0, 0, 0.1) 0px 0px 6px 0px',
        'broadside-lg': 'rgba(0, 0, 0, 0.1) 0px 0px 20px 0px',
        'foil-glow': '0 0 25px rgba(168, 85, 247, 0.4), 0 0 10px rgba(56, 189, 248, 0.3)',
        'flame-glow': '0 0 25px rgba(255, 84, 0, 0.4), 0 0 12px rgba(255, 204, 0, 0.3)',
        'slab-depth': '0 10px 30px -5px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.6)',
      },
      animation: {
        'pack-reveal': 'packReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'floatSlow 4s ease-in-out infinite',
        shimmer: 'shimmerSweep 2.5s infinite linear',
        'foil-tilt': 'foilTilt 3s ease-in-out infinite alternate',
      },
      keyframes: {
        packReveal: {
          '0%': { transform: 'scale(0.96) translateY(8px)', opacity: '0' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmerSweep: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        foilTilt: {
          '0%': { transform: 'rotate(-1deg) translateY(0px)' },
          '100%': { transform: 'rotate(1deg) translateY(-4px)' },
        },
      },

    },
  },
  plugins: [],
}
