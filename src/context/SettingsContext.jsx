import React, { createContext, useContext, useState, useEffect } from 'react';
import localforage from 'localforage';

const defaultSettings = {
  fontFamily: 'Source Serif Pro',
  fontSize: 18,
  lineHeight: 1.6,
  textAlign: 'left',
  tint: 0, // 0 to 100 opacity for night light
  lightGradient: { start: '#FFFFFF', end: '#FFFFFF' },
  darkGradient: { start: '#000000', end: '#000000' }
};

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await localforage.getItem('userSettings');
        if (savedSettings) {
          setSettings({ ...defaultSettings, ...savedSettings });
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadSettings();
  }, []);

  // Save settings whenever they change
  const updateSettings = (newSettings) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localforage.setItem('userSettings', updated).catch(console.error);
      return updated;
    });
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localforage.setItem('userSettings', defaultSettings).catch(console.error);
  };

  const value = {
    settings,
    updateSettings,
    resetSettings,
    isLoaded
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
