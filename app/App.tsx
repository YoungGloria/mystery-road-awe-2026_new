// app/App.tsx
import { HashRouter } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import { AppRoutes } from './AppRoutes';
import { BookmarkProvider } from './BookmarkContext';
import { useCaseData } from './useCaseData';

export function App() {
  const data = useCaseData();

  return (
    <HashRouter>
      <AppHeader />
      <main className="app-main">
        {data.status === 'loading' ? (
          <div className="app-loading" role="status" aria-live="polite">
            <div className="spinner" aria-hidden="true"></div>
            <p>Loading case file&hellip;</p>
          </div>
        ) : (
          <BookmarkProvider toggleBookmark={data.toggleEvidenceBookmark}>
            <AppRoutes data={data} />
          </BookmarkProvider>
        )}
      </main>
      <footer className="app-footer">
        <p>
          Project ReMotion Investigation Portal &mdash; Research Center AI,
          Software and IT-Security of HCW (fictional case study)
        </p>
      </footer>
    </HashRouter>
  );
}
