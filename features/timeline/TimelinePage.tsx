import type { Location, Person, TimelineEvent } from '../../modules/types';
import { PageSection } from '../../shared/components/PageSection';
import { TimelineList } from './components/TimelineList';
import { TimelineFilters } from './components/TimelineFilters';

type TimelinePageProps = {
  events: TimelineEvent[];
  people: Person[];
  locations: Location[];
};

export function TimelinePage({ events, people, locations }: TimelinePageProps) {
  const chronological = [...events].sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
  );

  const types = Array.from(new Set(events.map((e) => e.type)));

  return (
    <PageSection title="Investigation Timeline">
      <TimelineFilters people={people} locations={locations} types={types} />
      <TimelineList
        events={chronological}
        people={people}
        locations={locations}
      />
    </PageSection>
  );
}
