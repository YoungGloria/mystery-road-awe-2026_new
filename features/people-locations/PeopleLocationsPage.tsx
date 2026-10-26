import { Outlet } from 'react-router-dom';
import { PageSection } from '../../shared/components/PageSection';
import { TeamTabs } from './components/TeamTabs';

export function PeopleLocationsPage() {
  return (
    <PageSection title="People & Locations">
      <TeamTabs />
      <Outlet />
    </PageSection>
  );
}
