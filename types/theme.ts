export type ThemeType = 'dark' | 'light' | 'red' | 'blue' | 'custom';

export interface Theme {
  type: ThemeType;
  colors: {
    background: string;
    surface: string;
    surfaceSecondary: string;
    text: string;
    textSecondary: string;
    primary: string;
    primaryText: string;
    border: string;
    success: string;
    error: string;
    warning: string;
  };
}

export const themes: Record<ThemeType, Theme> = {
  dark: {
    type: 'dark',
    colors: {
      background: '#000000',
      surface: '#0a0a0a',
      surfaceSecondary: '#1a1a1a',
      text: '#ffffff',
      textSecondary: '#666666',
      primary: '#ffffff',
      primaryText: '#000000',
      border: '#1a1a1a',
      success: '#4ade80',
      error: '#f87171',
      warning: '#fbbf24',
    },
  },
  light: {
    type: 'light',
    colors: {
      background: '#ffffff',
      surface: '#f5f5f5',
      surfaceSecondary: '#e5e5e5',
      text: '#000000',
      textSecondary: '#666666',
      primary: '#000000',
      primaryText: '#ffffff',
      border: '#e5e5e5',
      success: '#22c55e',
      error: '#ef4444',
      warning: '#f59e0b',
    },
  },
  red: {
    type: 'red',
    colors: {
      background: '#0f0000',
      surface: '#1a0505',
      surfaceSecondary: '#2a0a0a',
      text: '#ffffff',
      textSecondary: '#b87575',
      primary: '#ef4444',
      primaryText: '#ffffff',
      border: '#2a0a0a',
      success: '#4ade80',
      error: '#dc2626',
      warning: '#fbbf24',
    },
  },
  blue: {
    type: 'blue',
    colors: {
      background: '#000510',
      surface: '#050a1a',
      surfaceSecondary: '#0a0f2a',
      text: '#ffffff',
      textSecondary: '#7591b8',
      primary: '#3b82f6',
      primaryText: '#ffffff',
      border: '#0a0f2a',
      success: '#4ade80',
      error: '#f87171',
      warning: '#fbbf24',
    },
  },
  custom: {
    type: 'custom',
    colors: {
      background: '#000000',
      surface: '#0a0a0a',
      surfaceSecondary: '#1a1a1a',
      text: '#ffffff',
      textSecondary: '#666666',
      primary: '#ffffff',
      primaryText: '#000000',
      border: '#1a1a1a',
      success: '#4ade80',
      error: '#f87171',
      warning: '#fbbf24',
    },
  },
};
