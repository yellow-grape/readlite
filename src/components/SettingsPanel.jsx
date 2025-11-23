import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useTheme } from '../context/ThemeContext';
import styles from './SettingsPanel.module.css';

const FONT_OPTIONS = [
  { label: 'Serif (Source Serif)', value: 'Source Serif Pro' },
  { label: 'Sans (Inter)', value: 'Inter' },
  { label: 'Merriweather', value: 'Merriweather' },
  { label: 'Lora', value: 'Lora' },
];

const SettingsPanel = ({ isOpen, onClose }) => {
  const { settings, updateSettings, resetSettings } = useSettings();
  const { themeMode, toggleTheme } = useTheme();

  if (!isOpen) return null;

  const handleGradientChange = (type, key, value) => {
    updateSettings({
      [`${type}Gradient`]: {
        ...settings[`${type}Gradient`],
        [key]: value
      }
    });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Reader Settings</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.section}>
          <h3>Theme</h3>
          <div className={styles.themeToggle}>
            <button 
              className={`${styles.themeBtn} ${themeMode === 'light' ? styles.active : ''}`}
              onClick={() => themeMode !== 'light' && toggleTheme()}
            >
              Light
            </button>
            <button 
              className={`${styles.themeBtn} ${themeMode === 'dark' ? styles.active : ''}`}
              onClick={() => themeMode !== 'dark' && toggleTheme()}
            >
              Dark
            </button>
          </div>
        </div>

        <div className={styles.section}>
          <h3>Typography</h3>
          
          <div className={styles.controlGroup}>
            <label>Font Family</label>
            <select 
              value={settings.fontFamily} 
              onChange={(e) => updateSettings({ fontFamily: e.target.value })}
            >
              {FONT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className={styles.controlGroup}>
            <label>Font Size ({settings.fontSize}px)</label>
            <input 
              type="range" 
              min="12" 
              max="32" 
              step="1" 
              value={settings.fontSize}
              onChange={(e) => updateSettings({ fontSize: Number(e.target.value) })}
            />
          </div>

          <div className={styles.controlGroup}>
            <label>Line Height ({settings.lineHeight})</label>
            <input 
              type="range" 
              min="1.0" 
              max="2.5" 
              step="0.1" 
              value={settings.lineHeight}
              onChange={(e) => updateSettings({ lineHeight: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className={styles.section}>
          <h3>Background Colors</h3>
          <p className={styles.hint}>Customize the gradient for the current theme</p>
          
          {themeMode === 'light' ? (
            <div className={styles.colorPickers}>
              <div className={styles.colorInput}>
                <label>Top</label>
                <input 
                  type="color" 
                  value={settings.lightGradient.start}
                  onChange={(e) => handleGradientChange('light', 'start', e.target.value)}
                />
              </div>
              <div className={styles.colorInput}>
                <label>Bottom</label>
                <input 
                  type="color" 
                  value={settings.lightGradient.end}
                  onChange={(e) => handleGradientChange('light', 'end', e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className={styles.colorPickers}>
              <div className={styles.colorInput}>
                <label>Top</label>
                <input 
                  type="color" 
                  value={settings.darkGradient.start}
                  onChange={(e) => handleGradientChange('dark', 'start', e.target.value)}
                />
              </div>
              <div className={styles.colorInput}>
                <label>Bottom</label>
                <input 
                  type="color" 
                  value={settings.darkGradient.end}
                  onChange={(e) => handleGradientChange('dark', 'end', e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button className={styles.resetBtn} onClick={resetSettings}>
            <RotateCcw size={16} /> Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
