import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

type BookmarkContextValue = {
  toggleBookmark: (evidenceId: string) => void;
};

const BookmarkContext = createContext<BookmarkContextValue | null>(null);

type BookmarkProviderProps = BookmarkContextValue & {
  children: ReactNode;
};

export function BookmarkProvider({
  toggleBookmark,
  children,
}: BookmarkProviderProps) {
  return (
    <BookmarkContext.Provider value={{ toggleBookmark }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks(): BookmarkContextValue {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
}
