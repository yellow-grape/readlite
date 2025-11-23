import React from 'react';
import { useEpub } from '../hooks/useEpub';
import { useTextBook } from '../hooks/useTextBook';
import { useSettings } from '../context/SettingsContext';
import NavigationControls from './NavigationControls';
import styles from './ReaderView.module.css';

const EpubViewer = ({ bookData, settings }) => {
  const { 
    viewerRef, 
    isLoading, 
    error, 
    next, 
    prev, 
    toc, 
    currentLocation, 
    goToLocation 
  } = useEpub(bookData, settings);

  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      {isLoading && <div className={styles.loading}>Loading book...</div>}
      <div ref={viewerRef} className={styles.viewer} />
      
      {!isLoading && (
        <NavigationControls 
          onNext={next} 
          onPrev={prev} 
          toc={toc}
          currentLocation={currentLocation}
          onNavigate={goToLocation}
        />
      )}
    </div>
  );
};

const TextViewer = ({ bookData, settings }) => {
  const { content, isLoading, error, viewerRef } = useTextBook(bookData, settings);

  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      {isLoading && <div className={styles.loading}>Loading text...</div>}
      <div 
        ref={viewerRef} 
        className={styles.textViewer}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

const ReaderView = ({ bookData, format = 'epub' }) => {
  const { settings } = useSettings();

  if (format === 'txt') {
    return <TextViewer bookData={bookData} settings={settings} />;
  }

  return <EpubViewer bookData={bookData} settings={settings} />;
};

export default ReaderView;
