module.exports = {
  extract: {
    include: ['app/**/*.{vue,html,jsx,tsx,ts}'],
    exclude: ['node_modules', '.git', '.next'],
  },
  theme: {
    extend: {
      colors: {
        background: '#040404',
        foreground: '#fafafa',
        card: '#121212',
        'card-foreground': '#fafafa',
        'brand-green': '#b6f09c',
        'brand-orange': '#f4a460',
        'brand-dark': '#0a0a0a',
        muted: '#1e1e1e',
        'muted-foreground': '#a1a1aa',
        border: '#27272a',
      },
    },
  },
};
