/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

const brandColors = {
  orange: {
    aws: '#f90',
    awshover: '#ec7211',
  },
};

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'toast-enter': 'fadeScale 3s ease-in',
        'toast-exit': 'fadeScale 3s ease-in reverse',
      },
      keyframes: {
        fadeScale: {
          '0%': { opacity: '0', transform: 'scale(0.2)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-themer')({
      defaultTheme: {
        extend: {
          colors: {
            orange: brandColors.orange,
            primary: brandColors.orange.aws,
            primaryAlt: brandColors.orange.awshover,
            secondary: colors.neutral[500],
            secondaryAlt: colors.neutral[700],
            positive: colors.emerald[500],
            positiveAlt: colors.emerald[700],
            destruct: colors.red[500],
            destructAlt: colors.red[700],
            warn: colors.yellow[300],
            warnAlt: colors.yellow[500],
            uiText: colors.neutral[900],
            uiTextAlt: colors.neutral[100],
            surface: colors.white,
            surfaceAlt: colors.neutral[100],
            surfaceAlt2: colors.black,
            border: colors.neutral[200],
            overlay: colors.neutral[100],
          },
        },
      },
      themes: [
        {
          name: 'dark-theme',
          mediaQuery: '@media (prefers-color-scheme: dark)',
          extend: {
            colors: {
              primary: brandColors.orange.aws,
              primaryAlt: brandColors.orange.awshover,
              secondary: colors.neutral[500],
              secondaryAlt: colors.neutral[700],
              positive: colors.emerald[600],
              positiveAlt: colors.emerald[500],
              destruct: colors.red[600],
              destructAlt: colors.red[500],
              warn: colors.yellow[500],
              warnAlt: colors.yellow[400],
              uiText: colors.neutral[300],
              uiTextAlt: colors.neutral[700],
              surface: colors.black,
              surfaceAlt: colors.neutral[900],
              surfaceAlt2: colors.white,
              border: colors.neutral[800],
              overlay: colors.neutral[900],
            },
          },
        },
      ],
    }),
  ],
};
