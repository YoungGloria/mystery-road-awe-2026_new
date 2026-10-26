import { evidenceMentionsPerson } from '../modules/states/evidenceState';
import type { Evidence, Location, Person } from '../modules/types';
import { LocationCard } from '../components/LocationCard';
import { PageSection } from '../components/PageSection';
import { PersonCard } from '../components/PersonCard';
import { TeamTabs, type TeamTab } from '../components/TeamTabs';
import { LocationList } from '../components/LocationList';
import { PeopleList } from '../components/PeopleList';

type PeopleLocationsPageProps = {
  people: Person[];
  locations: Location[];
  evidence: Evidence[];
};

const activeTab: TeamTab = 'people'; // fest, bis Demo 8


export function PeopleLocationsPage({
  people,
  locations,
  evidence,
}: PeopleLocationsPageProps) {
  return (
 <PageSection title="People & Locations">
  <TeamTabs activeTab={activeTab} />
  {activeTab === 'people' ? (
    <PeopleList people={people} evidence={evidence} />
  ) : (
    <LocationList locations={locations} />
  )}
</PageSection>
);
}
