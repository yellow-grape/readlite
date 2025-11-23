import React, { createContext, useContext, useState, useEffect } from 'react';
import localforage from 'localforage';
import { defaultTheme } from '../config/theme-config';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children, customSettings }) => {
  const [themeMode, setThemeMode] = useState('light');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await localforage.getItem('themeMode');
        if (savedTheme) {
          setThemeMode(savedTheme);
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          setThemeMode('dark');
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadTheme();
  }, []);

  // Save theme preference
  const toggleTheme = () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
    localforage.setItem('themeMode', newMode).catch(console.error);
  };

  // Apply theme variables to CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    const currentTheme = defaultTheme[themeMode];
    
    // Apply base theme colors
    // If custom settings exist, use them, otherwise fallback to default
    const gradientStart = customSettings?.[`${themeMode}Gradient`]?.start || currentTheme.gradientStart;
    const gradientEnd = customSettings?.[`${themeMode}Gradient`]?.end || currentTheme.gradientEnd;

    root.style.setProperty('--bg-gradient-start', gradientStart);
    root.style.setProperty('--bg-gradient-end', gradientEnd);
    root.style.setProperty('--text-primary', currentTheme.textPrimary);
    root.style.setProperty('--text-secondary', currentTheme.textSecondary);
    root.style.setProperty('--ui-background', currentTheme.uiBackground);
    root.style.setProperty('--ui-border', currentTheme.uiBorder);
    root.style.setProperty('--accent-color', currentTheme.accent);
    
    // Update data-theme attribute for other selectors
    document.documentElement.setAttribute('data-theme', themeMode);
    
  }, [themeMode, customSettings]);

  const value = {
    themeMode,
    toggleTheme,
    isLoaded,
    currentTheme: defaultTheme[themeMode]
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
