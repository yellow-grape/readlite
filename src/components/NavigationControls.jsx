import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './NavigationControls.module.css';

const NavigationControls = ({ onNext, onPrev, toc, currentLocation, onNavigate }) => {
  // Find current chapter title based on location
  const currentChapter = toc.find(chapter => 
    currentLocation && 
    chapter.href === currentLocation.start.href
  );

  return (
    <div className={styles.controls}>
      <button className={styles.navBtn} onClick={onPrev} aria-label="Previous Chapter">
        <ChevronLeft size={24} />
      </button>

      <div className={styles.chapterSelect}>
        <select 
          value={currentChapter ? currentChapter.href : ''} 
          onChange={(e) => onNavigate(e.target.value)}
        >
          <option value="" disabled>Select Chapter</option>
          {toc.map((chapter, index) => (
            <option key={index} value={chapter.href}>
              {chapter.label.trim()}
            </option>
          ))}
        </select>
      </div>

      <button className={styles.navBtn} onClick={onNext} aria-label="Next Chapter">
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default NavigationControls;
