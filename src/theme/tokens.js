/**
 * Design Tokens - Career Path System
 * Centralized design system with colors, typography, spacing, and effects
 */

export const tokens = {
  // ==================== COLORS ====================
  colors: {
    // Primary
    primary: {
      50: '#F0F7FF',
      100: '#E0EFFE',
      200: '#BAE0FD',
      300: '#7CC5FC',
      400: '#38ACFD',
      500: '#2563EB', // Main primary
      600: '#1D4ED8',
      700: '#1E40AF',
      800: '#1E3A8A',
      900: '#172554',
    },
    // Secondary - Success
    success: {
      50: '#F0FDF4',
      100: '#DCFCE7',
      200: '#BBF7D0',
      300: '#86EFAC',
      400: '#4ADE80',
      500: '#10B981', // Main success
      600: '#059669',
      700: '#047857',
      800: '#065F46',
      900: '#064E3B',
    },
    // Warning
    warning: {
      50: '#FFF7ED',
      100: '#FFEDD5',
      200: '#FED7AA',
      300: '#FDBA74',
      400: '#FB923C',
      500: '#F97316', // Main warning
      600: '#EA580C',
      700: '#C2410C',
      800: '#9A3412',
      900: '#7C2D12',
    },
    // Error
    error: {
      50: '#FEF2F2',
      100: '#FEE2E2',
      200: '#FECACA',
      300: '#FCA5A5',
      400: '#F87171',
      500: '#EF4444', // Main error
      600: '#DC2626',
      700: '#B91C1C',
      800: '#991B1B',
      900: '#7F1D1D',
    },
    // Neutral - Grayscale
    neutral: {
      0: '#FFFFFF',
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    },
  },

  // ==================== TYPOGRAPHY ====================
  typography: {
    fontFamily: {
      display: '"Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", sans-serif',
      body: '"Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", sans-serif',
      code: '"JetBrains Mono", "Courier New", monospace',
    },
    sizes: {
      display: {
        fontSize: '36px',
        fontWeight: 700,
        lineHeight: '44px',
        letterSpacing: '-0.02em',
      },
      h1: {
        fontSize: '28px',
        fontWeight: 700,
        lineHeight: '36px',
        letterSpacing: '-0.01em',
      },
      h2: {
        fontSize: '22px',
        fontWeight: 600,
        lineHeight: '28px',
        letterSpacing: '-0.01em',
      },
      h3: {
        fontSize: '18px',
        fontWeight: 600,
        lineHeight: '24px',
        letterSpacing: '0em',
      },
      h4: {
        fontSize: '16px',
        fontWeight: 600,
        lineHeight: '22px',
        letterSpacing: '0em',
      },
      body: {
        fontSize: '15px',
        fontWeight: 400,
        lineHeight: '24px',
        letterSpacing: '0em',
      },
      bodySmall: {
        fontSize: '13px',
        fontWeight: 400,
        lineHeight: '20px',
        letterSpacing: '0em',
      },
      caption: {
        fontSize: '12px',
        fontWeight: 500,
        lineHeight: '16px',
        letterSpacing: '0em',
      },
      code: {
        fontSize: '12px',
        fontWeight: 400,
        lineHeight: '16px',
        letterSpacing: '0em',
      },
    },
  },

  // ==================== SPACING ====================
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    xxl: '32px',
    xxxl: '48px',
  },

  // ==================== BORDER RADIUS ====================
  borderRadius: {
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  // ==================== SHADOWS ====================
  shadows: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },

  // ==================== TRANSITIONS ====================
  transitions: {
    fast: '150ms ease-in-out',
    normal: '200ms ease-in-out',
    slow: '300ms ease-in-out',
  },

  // ==================== BREAKPOINTS ====================
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1440px',
    ultra: '1920px',
  },
};

export default tokens;
