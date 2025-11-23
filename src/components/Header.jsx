import React from 'react';
import { Settings, BookOpen } from 'lucide-react';
import styles from './Header.module.css';

const Header = ({ onOpenSettings, bookTitle }) => {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <BookOpen size={24} color="var(--accent-color)" />
          <h1>ReadLite</h1>
        </div>
      </div>
      
      <div className={styles.center}>
        {bookTitle && <span className={styles.bookTitle}>{bookTitle}</span>}
      </div>

      <div className={styles.right}>
        <button 
          className={styles.iconBtn} 
          onClick={onOpenSettings}
          aria-label="Settings"
        >
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
