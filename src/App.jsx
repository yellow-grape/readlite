import React, { useState } from 'react';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import SettingsPanel from './components/SettingsPanel';
import ReaderView from './components/ReaderView';
import FileUploader from './components/FileUploader';
import './App.css';

// Wrapper to pass settings to ThemeProvider
const ThemeWrapper = ({ children }) => {
  const { settings, isLoaded } = useSettings();
  
  if (!isLoaded) return null; // Or a loading spinner

  return (
    <ThemeProvider customSettings={settings}>
      {children}
    </ThemeProvider>
  );
};

function AppContent() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [bookData, setBookData] = useState(null);
  const [bookTitle, setBookTitle] = useState('');
  const [bookFormat, setBookFormat] = useState('epub');
  const { settings } = useSettings();

  const handleFileSelect = (data, name, format) => {
    setBookData(data);
    setBookTitle(name.replace(/\.(epub|txt)$/, ''));
    setBookFormat(format);
  };

  return (
    <div className="app-container">
      {/* Night Light Overlay */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#FFB000', // Warm amber color
          opacity: settings.tint / 100,
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'multiply'
        }} 
      />

      <Header 
        onOpenSettings={() => setIsSettingsOpen(true)} 
        bookTitle={bookTitle}
      />
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      
      <main className="reader-container" style={{ flex: 1, padding: '2rem 0' }}>
        {!bookData ? (
          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <h2 style={{ marginBottom: '2rem' }}>Welcome to ReadLite</h2>
            <FileUploader onFileSelect={handleFileSelect} />
          </div>
        ) : (
          <ReaderView bookData={bookData} format={bookFormat} />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <SettingsProvider>
      <ThemeWrapper>
        <AppContent />
      </ThemeWrapper>
    </SettingsProvider>
  );
}

export default App;
