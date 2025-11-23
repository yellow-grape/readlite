import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';
import styles from './FileUploader.module.css';

const FileUploader = ({ onFileSelect }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const processFile = (file) => {
    const isEpub = file.type === 'application/epub+zip' || file.name.endsWith('.epub');
    const isTxt = file.type === 'text/plain' || file.name.endsWith('.txt');

    if (isEpub || isTxt) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onFileSelect(e.target.result, file.name, isTxt ? 'txt' : 'epub');
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert('Please upload a valid EPUB or TXT file');
    }
  };

  return (
    <div 
      className={styles.uploader}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <input 
        type="file" 
        id="file-input" 
        accept=".epub,.txt" 
        onChange={handleFileChange}
        className={styles.input}
      />
      <label htmlFor="file-input" className={styles.label}>
        <Upload size={48} className={styles.icon} />
        <h3>Drop your EPUB or TXT here</h3>
        <p>or click to browse</p>
      </label>
    </div>
  );
};

export default FileUploader;
