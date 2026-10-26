import { Navigate, Route, Routes } from 'react-router-dom';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { LocationList } from '../features/people-locations/LocationList';
import { PeopleList } from '../features/people-locations/PeopleList';
import { PeopleLocationsPage } from '../features/people-locations/PeopleLocationsPage';
import { TimelinePage } from '../features/timeline/TimelinePage';
import { PlaceholderPage } from '../shared/components/PlaceholderPage';
import type { ReadyCaseData } from './useCaseData';
import { PersonDetailPage } from '../features/people-locations/PersonDetailPage';

type AppRoutesProps = { data: ReadyCaseData };

export function AppRoutes({ data }: AppRoutesProps) {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage {...data} />} />

      <Route path="/team" element={<PeopleLocationsPage />}>
        <Route index element={<Navigate to="people" replace />} />
        <Route 
    path="people" 
    element={<PeopleList people={data.people} evidence={data.evidence} />} 
  />
        <Route
          path="people/:personId"
          element={
            <PersonDetailPage people={data.people} evidence={data.evidence} />
          }
        />
        <Route
          path="locations"
          element={<LocationList locations={data.locations} />}
        />
      </Route>

      <Route
        path="/timeline"
        element={
          <TimelinePage
            events={data.timeline}
            people={data.people}
            locations={data.locations}
          />
        }
      />
      <Route path="/evidence" element={<PlaceholderPage title="Evidence" />} />
      <Route
        path="/workspace"
        element={<PlaceholderPage title="Workspace" />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
