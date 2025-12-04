/**
 * Design Tokens - Career Path System
 * Centralized design system with colors, typography, spacing, and effects
 */

export const tokens = {
  // ==================== COLORS ====================
  colors: {
    // Primary - INDIGO (Modern & Professional)
    primary: {
      50: '#F4F3FF',
      100: '#E9E5FF',
      200: '#D4CCFE',
      300: '#B4A3FE',
      400: '#816AFE',
      500: '#6366F1', // Main primary - INDIGO
      600: '#4F46E5',
      700: '#4F46E5',
      800: '#3730A3',
      900: '#312E81',
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
      50: '#FAFAFA',
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

    // Accent - Violet (For highlights & special elements)
    accent: {
      50: '#FAF5FF',
      100: '#F3E8FF',
      200: '#E9D5FF',
      300: '#D8B4FE',
      400: '#C084FC',
      500: '#A855F7',
      600: '#9333EA',
      700: '#7E22CE',
      800: '#6B21A8',
      900: '#581C87',
    },
  },

  // ==================== TYPOGRAPHY ====================
  typography: {
    fontFamily: {
      display: '"Sora", "Geist", "-apple-system", "BlinkMacSystemFont", "Segoe UI", sans-serif',
      body: '"Sora", "Geist", "-apple-system", "BlinkMacSystemFont", "Segoe UI", sans-serif',
      code: '"JetBrains Mono", "Monaco", "Courier New", monospace',
    },
    sizes: {
      display: {
        fontSize: '40px',
        fontWeight: 700,
        lineHeight: '48px',
        letterSpacing: '-0.02em',
      },
      h1: {
        fontSize: '32px',
        fontWeight: 700,
        lineHeight: '40px',
        letterSpacing: '-0.01em',
      },
      h2: {
        fontSize: '24px',
        fontWeight: 600,
        lineHeight: '32px',
        letterSpacing: '0em',
      },
      h3: {
        fontSize: '20px',
        fontWeight: 600,
        lineHeight: '28px',
        letterSpacing: '0em',
      },
      h4: {
        fontSize: '16px',
        fontWeight: 600,
        lineHeight: '24px',
        letterSpacing: '0em',
      },
      body: {
        fontSize: '15px',
        fontWeight: 400,
        lineHeight: '24px',
        letterSpacing: '0em',
      },
      bodySmall: {
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: '22px',
        letterSpacing: '0em',
      },
      caption: {
        fontSize: '12px',
        fontWeight: 500,
        lineHeight: '16px',
        letterSpacing: '0.5px',
      },
      code: {
        fontSize: '13px',
        fontWeight: 400,
        lineHeight: '20px',
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
