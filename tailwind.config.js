module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: false,
  theme: {
    extend: {
      screens: {
        mobile: { max: '640px' }
      },
      spacing: {
        18: '4.5em'
      },
      colors: {
        current: 'currentColor',
        transparent: 'transparent',
        white: 'white',
        grey: 'var(--grey)',
        error: 'var(--error)',
        errorDark: 'var(--error-dark)'
      },
      keyframes: {
        'fade-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(14px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        }
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out both'
      },
      transitionProperty: {
        size: 'width, height, transform, color, margin'
      }
    }
  }
}
