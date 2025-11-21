import { useState, useEffect } from 'react';
import type { Theme } from '../types';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Function to update theme based on current theme setting
    const updateTheme = () => {
      let newResolved: 'light' | 'dark';

      if (theme === 'system') {
        newResolved = mediaQuery.matches ? 'dark' : 'light';
      } else {
        newResolved = theme;
      }

      setResolvedTheme(newResolved);
      root.setAttribute('data-theme', newResolved);
    };

    // Initial theme detection
    updateTheme();

    // Listen for system theme changes (only if theme is 'system')
    if (theme === 'system') {
      mediaQuery.addEventListener('change', updateTheme);
      return () => mediaQuery.removeEventListener('change', updateTheme);
    }
  }, [theme]);

  return {
    theme,
    resolvedTheme,
    toggleTheme
  };
};