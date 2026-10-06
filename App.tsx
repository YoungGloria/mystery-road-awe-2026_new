import { AppHeader } from './components/AppHeader';
import { useHashRoute } from './hooks/useHashRoute';
import { PlaceholderPage } from './PlaceholderPage';
import { VIEWS, type ViewId } from './routes';

export function App() {
  const view = useHashRoute();

  return (
    <>
      <AppHeader currentView={view} />
      <main className="app-main">
        <CurrentView view={view} />
      </main>
      <footer className="app-footer">
        <p>
          Project ReMotion Investigation Portal &mdash; Research Center AI,
          Software and IT-Security of HCW (fictional case study)
        </p>
      </footer>
    </>
  );
}

function CurrentView({ view }: { view: ViewId }) {
  const label = VIEWS.find((v) => v.id === view)?.label ?? view;
  return <PlaceholderPage title={label} />;
}
