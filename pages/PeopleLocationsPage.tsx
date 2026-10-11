import { evidenceMentionsPerson } from '../modules/states/evidenceState';
import type { Evidence, Location, Person } from '../modules/types';
import { LocationCard } from '../components/LocationCard';
import { PageSection } from '../components/PageSection';
import { PersonCard } from '../components/PersonCard';

type PeopleLocationsPageProps = {
  people: Person[];
  locations: Location[];
  evidence: Evidence[];
};

export function PeopleLocationsPage({
  people,
  locations,
  evidence,
}: PeopleLocationsPageProps) {
  return (
    <PageSection title="People & Locations">
      <h3>People</h3>
      <div className="people-grid">
        {people.map((person) => (
          <PersonCard
            key={person.id}
            person={person}
            evidenceCount={
              evidence.filter((item) => evidenceMentionsPerson(item, person))
                .length
            }
          />
        ))}
      </div>

      <h3>Locations</h3>
      <div className="locations-grid">
        {locations.map((location) => (
          <LocationCard key={location.id} location={location} />
        ))}
      </div>
    </PageSection>
  );
}
