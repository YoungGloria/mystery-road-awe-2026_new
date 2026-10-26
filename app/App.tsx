// app/App.tsx
import { HashRouter } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import { AppRoutes } from './AppRoutes';
import { useCaseData } from './useCaseData';

export function App() {
  const data = useCaseData();

  return (
    <HashRouter>
      <AppHeader />
      <main className="app-main">
        {data.status === 'loading' ? (
          <p>Loading case file&hellip;</p>
        ) : (
          <AppRoutes data={data} />
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
