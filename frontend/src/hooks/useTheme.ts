import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Function to update theme based on system preference
    const updateTheme = () => {
      const newResolved = mediaQuery.matches ? 'dark' : 'light';
      setResolvedTheme(newResolved);
      root.setAttribute('data-theme', newResolved);
    };

    // Initial theme detection
    updateTheme();

    // Listen for system theme changes
    mediaQuery.addEventListener('change', updateTheme);
    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, []);

  return {
    resolvedTheme
  };
};