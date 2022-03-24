module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", "**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        'cream': "#eceae5",
        'black': "#050709"
      }
    },
    fontSize: {
      xs: ['14px', { lineHeight: '24px' }],
      sm: ['16px', { lineHeight: '28px' }],
      lg: ['18px', { lineHeight: '28px' }],
      xl: ['24px', { lineHeight: '36px' }],
      '2xl': ['36px', { lineHeight: '48px' }],
      '3xl': ['48px', { lineHeight: '60px' }],
      '4xl': ['56px', { lineHeight: '64px' }],
      '5xl': ['64px', { lineHeight: '80px' }],
      '6xl': ['5vw', { lineHeight: '120%' }],
      '7xl': ['10vw', { lineHeight: '120%' }],
    }
  },
  plugins: [],
}
