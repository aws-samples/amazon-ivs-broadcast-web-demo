/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

const brandColors = {
  orange: {
    aws: '#f90',
    awshover: '#ec7211',
  },
};

// NYU Sports Color Scheme
const nyuColors = {
  // Primary Colors
  primary: {
    600: '#57068c',
    500: '#8900e1',
    900: '#000000',
  },
  // Secondary Colors
  secondary: {
    700: '#330662',
    600: '#702b9d',
    500: '#7b5aa6',
    400: '#ab82c5',
    100: '#eee6f3',
  },
  // Neutral Colors
  neutral: {
    800: '#404040',
    600: '#6d6d6d',
    400: '#b8b8b8',
    300: '#d6d6d6',
    100: '#f2f2f2',
    white: '#ffffff',
  },
  // Accent Colors
  accent: {
    teal: '#009b8a',
    pink: '#fb0f78',
    blue: '#59B2D1',
    yellow: '#f4ec51',
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
            // NYU Sports Colors
            nyu: nyuColors,
            // Legacy colors for backward compatibility
            orange: brandColors.orange,
            primary: nyuColors.primary[500], // #8900e1
            primaryAlt: nyuColors.primary[600], // #57068c
            secondary: nyuColors.secondary[500],
            secondaryAlt: nyuColors.secondary[700],
            positive: colors.emerald[500],
            positiveAlt: colors.emerald[700],
            destruct: colors.red[500],
            destructAlt: colors.red[700],
            warn: nyuColors.accent.yellow,
            warnAlt: colors.yellow[500],
            uiText: nyuColors.primary[900], // black
            uiTextAlt: nyuColors.neutral.white,
            surface: nyuColors.neutral.white,
            surfaceAlt: nyuColors.neutral[100],
            surfaceAlt2: nyuColors.primary[900],
            border: nyuColors.neutral[300],
            overlay: nyuColors.neutral[100],
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
