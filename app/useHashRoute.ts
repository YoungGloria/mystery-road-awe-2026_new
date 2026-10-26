import { useEffect, useState } from 'react';
import { parseHash, type ViewId } from '../routes';

export function useHashRoute(): ViewId {
  const [view, setView] = useState<ViewId>(() =>
    parseHash(window.location.hash)
  );

  useEffect(() => {
    function handleHashChange(): void {
      setView(parseHash(window.location.hash));
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return view;
}
