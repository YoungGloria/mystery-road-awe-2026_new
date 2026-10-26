import type { Location, Person, TimelineEvent } from '../modules/types';
import { PageSection } from '../shared/components/PageSection';
import { TimelineList } from '../features/timeline/components/TimelineList';

type TimelinePageProps = {
  events: TimelineEvent[];
  people: Person[];
  locations: Location[];
};

export function TimelinePage({ events, people, locations }: TimelinePageProps) {
  const chronological = [...events].sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
  );

  return (
    <PageSection title="Investigation Timeline">
      <TimelineList
        events={chronological}
        people={people}
        locations={locations}
      />
    </PageSection>
  );
}
