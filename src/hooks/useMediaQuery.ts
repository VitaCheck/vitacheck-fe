// src/hooks/useMediaQuery.ts
import { useState, useEffect } from 'react';

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);

    mediaQueryList.addListener(listener);
    setMatches(mediaQueryList.matches);

    return () => {
      mediaQueryList.removeListener(listener);
    };
  }, [query]);

  return matches;
};

export default useMediaQuery;