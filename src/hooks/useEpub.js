import { useState, useEffect, useRef, useCallback } from 'react';
import ePub from 'epubjs';

export const useEpub = (bookData, settings) => {
  const [book, setBook] = useState(null);
  const [rendition, setRendition] = useState(null);
  const [toc, setToc] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const viewerRef = useRef(null);

  // Initialize book when data changes
  useEffect(() => {
    if (!bookData) return;

    setIsLoading(true);
    setError(null);

    const newBook = ePub(bookData);
    setBook(newBook);

    newBook.loaded.navigation.then((nav) => {
      setToc(nav.toc);
    }).catch(err => {
      console.error("Error loading navigation:", err);
      setError("Failed to load book navigation");
    });

    newBook.ready.then(() => {
      setIsLoading(false);
    }).catch(err => {
      console.error("Error loading book:", err);
      setError("Failed to load book content");
      setIsLoading(false);
    });

    return () => {
      if (newBook) {
        newBook.destroy();
      }
    };
  }, [bookData]);

  // Initialize rendition when book or viewer is ready
  useEffect(() => {
    if (!book || !viewerRef.current) return;

    const newRendition = book.renderTo(viewerRef.current, {
      width: '100%',
      height: '100%',
      flow: 'scrolled-doc', // Vertical scrolling like Bible.com
      manager: 'continuous',
      allowScriptedContent: false
    });

    setRendition(newRendition);

    const displayPromise = newRendition.display();

    displayPromise.then(() => {
      // Set initial styles
      applyStyles(newRendition, settings);
    });

    // Track location changes
    newRendition.on('relocated', (location) => {
      setCurrentLocation(location);
    });

    return () => {
      if (newRendition) {
        newRendition.destroy();
      }
    };
  }, [book]);

  // Apply settings whenever they change
  useEffect(() => {
    if (!rendition) return;
    applyStyles(rendition, settings);
  }, [rendition, settings]);

  const applyStyles = (rend, settings) => {
    if (!rend) return;
    
    rend.themes.default({
      'p': { 
        'font-family': `${settings.fontFamily} !important`,
        'font-size': `${settings.fontSize}px !important`,
        'line-height': `${settings.lineHeight} !important`,
        'text-align': `${settings.textAlign} !important`,
        'color': 'var(--text-primary) !important' 
      },
      'h1, h2, h3, h4, h5, h6': {
        'font-family': `${settings.fontFamily} !important`,
        'color': 'var(--text-primary) !important'
      },
      'body': {
        'color': 'var(--text-primary) !important',
        'background': 'transparent !important' // Let our app background show through
      }
    });
  };

  const next = useCallback(() => {
    if (rendition) rendition.next();
  }, [rendition]);

  const prev = useCallback(() => {
    if (rendition) rendition.prev();
  }, [rendition]);

  const goToLocation = useCallback((href) => {
    if (rendition) rendition.display(href);
  }, [rendition]);

  return {
    book,
    rendition,
    toc,
    currentLocation,
    isLoading,
    error,
    viewerRef,
    next,
    prev,
    goToLocation
  };
};
