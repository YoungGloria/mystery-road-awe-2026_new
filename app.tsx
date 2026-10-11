import { AppHeader } from './components/AppHeader';
import { useCaseData } from './hooks/useCaseData';
import { useHashRoute } from './hooks/useHashRoute';
import { DashboardPage } from './pages/DashboardPage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { VIEWS, type ViewId } from './routes';
import { PeopleLocationsPage } from './pages/PeopleLocationsPage';
import { TimelinePage } from './pages/TimelinePage';

export function App() {
  const view = useHashRoute();
  const data = useCaseData();

  return (
    <>
      <AppHeader currentView={view} />
      <main className="app-main">
        {data.status === 'loading' ? (
          <p>Loading case file&hellip;</p>
        ) : (
          <CurrentView view={view} data={data} />
        )}
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

type CurrentViewProps = {
  view: ViewId;
  data: Extract<ReturnType<typeof useCaseData>, { status: 'ready' }>;
};

function CurrentView({ view, data }: CurrentViewProps) {
  switch (view) {
    case 'dashboard':
      return <DashboardPage {...data} />;
    case 'people':
      return (
        <PeopleLocationsPage
          people={data.people}
          locations={data.locations}
          evidence={data.evidence}
        />
      );
    case 'timeline':
      return (
        <TimelinePage
          events={data.timeline}
          people={data.people}
          locations={data.locations}
        />
      );
    case 'evidence':
    case 'workspace': {
      const label = VIEWS.find((v) => v.id === view)?.label ?? view;
      return <PlaceholderPage title={label} />;
    }
    default: {
      const unreachable: never = view;
      return unreachable;
    }
  }
}
