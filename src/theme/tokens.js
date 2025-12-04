/**
 * Career Path System - Design Tokens
 * Complete design system with colors, typography, spacing, and shadows
 */

export const colors = {
  // Brand Colors
  primary: '#3A7AFE',      // Career Blue
  primaryLight: '#6EC3F5', // Secondary
  success: '#30C48D',      // Green
  warning: '#F7B538',      // Amber
  error: '#E35151',        // Red

  // Neutral Gray Scale (50-900)
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Surface Colors
  surface: {
    light: '#FFFFFF',
    lightAlt: '#F9FAFB',
    dark: '#1F2937',
    darkAlt: '#111827',
  },

  // Border Colors
  border: {
    subtle: '#E5E7EB',
    medium: '#D1D5DB',
    strong: '#9CA3AF',
  },

  // Text Colors
  text: {
    primary: '#111827',
    secondary: '#4B5563',
    inverse: '#FFFFFF',
    muted: '#6B7280',
  },
};

export const typography = {
  // Font family
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",

  // Scale with size (px) and weight
  display: {
    fontSize: 32,
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: -0.5,
  },
  h1: {
    fontSize: 28,
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: -0.3,
  },
  h2: {
    fontSize: 22,
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: -0.2,
  },
  h3: {
    fontSize: 18,
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: 0,
  },
  body: {
    fontSize: 16,
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: 0,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: 0,
  },
  caption: {
    fontSize: 12,
    fontWeight: 400,
    lineHeight: 1.4,
    letterSpacing: 0.2,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: 0,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 48,
};

export const radii = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 20,
  pill: 9999,
};

export const shadows = {
  // Card shadow
  card: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  // Popover shadow
  popover: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
  // Elevated shadow
  elevated: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
  // Focus outline
  focus: '0 0 0 3px rgba(58, 122, 254, 0.1), 0 0 0 4px #3A7AFE',
};

export const breakpoints = {
  mobile: 320,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
};

// CSS variable generator for use in stylesheets
export const getCSSVariables = () => {
  const vars = {};

  // Colors
  Object.entries(colors).forEach(([key, value]) => {
    if (typeof value === 'object') {
      Object.entries(value).forEach(([subKey, subValue]) => {
        vars[`--color-${key}-${subKey}`] = subValue;
      });
    } else {
      vars[`--color-${key}`] = value;
    }
  });

  // Typography
  Object.entries(typography).forEach(([key, value]) => {
    if (typeof value === 'object') {
      Object.entries(value).forEach(([prop, val]) => {
        if (prop === 'fontFamily') return;
        vars[`--type-${key}-${prop}`] = val;
      });
    }
  });

  // Spacing
  Object.entries(spacing).forEach(([key, value]) => {
    vars[`--space-${key}`] = `${value}px`;
  });

  // Radii
  Object.entries(radii).forEach(([key, value]) => {
    vars[`--radius-${key}`] = `${value}px`;
  });

  // Shadows
  Object.entries(shadows).forEach(([key, value]) => {
    vars[`--shadow-${key}`] = value;
  });

  return vars;
};
