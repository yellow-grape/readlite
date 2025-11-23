import { useState, useEffect, useRef, useCallback } from 'react';
import ePub from 'epubjs';

export const useEpub = (bookData, settings, theme) => {
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
      flow: settings.flow, // Dynamic flow based on settings
      manager: 'default', // Load one chapter at a time (no infinite scroll)
      allowScriptedContent: false
    });

    setRendition(newRendition);

    // Inject fonts into the iframe
    newRendition.hooks.content.register((contents) => {
      const link = contents.document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400&family=Source+Serif+Pro:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap';
      contents.document.head.appendChild(link);
    });

    const displayPromise = newRendition.display();

    displayPromise.then(() => {
      // Set initial styles
      applyStyles(newRendition, settings, theme);
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
    applyStyles(rendition, settings, theme);
  }, [rendition, settings, theme]);

  const applyStyles = (rend, settings, theme) => {
    if (!rend || !theme) return;
    
    rend.themes.default({
      'p': { 
        'font-family': `${settings.fontFamily} !important`,
        'font-size': `${settings.fontSize}px !important`,
        'line-height': `${settings.lineHeight} !important`,
        'text-align': `${settings.textAlign} !important`,
        'color': `${theme.textPrimary} !important` 
      },
      'h1, h2, h3, h4, h5, h6': {
        'font-family': `${settings.fontFamily} !important`,
        'color': `${theme.textPrimary} !important`
      },
      'body': {
        'color': `${theme.textPrimary} !important`,
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
