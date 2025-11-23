import { useState, useEffect, useRef } from 'react';

export const useTextBook = (bookData, settings) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const viewerRef = useRef(null);

  useEffect(() => {
    if (!bookData) return;

    setIsLoading(true);
    try {
      // bookData is ArrayBuffer, convert to string
      const decoder = new TextDecoder('utf-8');
      const text = decoder.decode(bookData);
      
      // Simple processing: wrap paragraphs in <p> tags
      const htmlContent = text
        .split(/\n\s*\n/) // Split by double newlines
        .filter(para => para.trim().length > 0)
        .map(para => `<p>${para.trim()}</p>`)
        .join('');
      
      setContent(htmlContent);
      setIsLoading(false);
    } catch (err) {
      console.error("Error parsing text file:", err);
      setError("Failed to parse text file");
      setIsLoading(false);
    }
  }, [bookData]);

  // Apply styles to the container
  useEffect(() => {
    if (viewerRef.current) {
      viewerRef.current.style.fontFamily = settings.fontFamily;
      viewerRef.current.style.fontSize = `${settings.fontSize}px`;
      viewerRef.current.style.lineHeight = settings.lineHeight;
      viewerRef.current.style.textAlign = settings.textAlign;
      viewerRef.current.style.color = 'var(--text-primary)';
    }
  }, [content, settings]);

  return {
    content,
    isLoading,
    error,
    viewerRef
  };
};
