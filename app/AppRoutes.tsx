import { Navigate, Route, Routes } from 'react-router-dom';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { LocationList } from '../features/people-locations/components/LocationList';
import { PeopleList } from '../features/people-locations/components/PeopleList';
import { PeopleLocationsPage } from '../features/people-locations/PeopleLocationsPage';
import { TimelinePage } from '../features/timeline/TimelinePage';
import type { ReadyCaseData } from './useCaseData';
import { PersonDetailPage } from '../features/people-locations/PersonDetailPage';
import { WorkspacePage } from '../features/workspace/WorkspacePage';
import { EvidencePage } from '../features/evidence/EvidencePage';

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
      <Route
        path="/evidence"
        element={
          <EvidencePage
            evidence={data.evidence}
            people={data.people}
            locations={data.locations}
            onUpdateEvidence={data.updateEvidence}
            notes={data.notes}
            onSaveNote={data.saveEvidenceNote}
          />
        }
      />
      <Route
        path="/workspace"
        element={
          <WorkspacePage
            evidence={data.evidence}
            people={data.people}
            notes={data.notes}
          />
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
