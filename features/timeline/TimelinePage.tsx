import { useSearchParams } from 'react-router-dom';
import type { Location, Person, TimelineEvent } from '../../modules/types';
import { PageSection } from '../../shared/components/PageSection';
import { TimelineFilters } from './components/TimelineFilters';
import { TimelineList } from './components/TimelineList';
import { parseTimelineQuery, selectTimelineEvents } from './timelineQuery';

type TimelinePageProps = {
  events: TimelineEvent[];
  people: Person[];
  locations: Location[];
};

export function TimelinePage({ events, people, locations }: TimelinePageProps) {
  const [searchParams] = useSearchParams();
  const query = parseTimelineQuery(searchParams);
  const visibleEvents = selectTimelineEvents(events, query);
  const types = Array.from(new Set(events.map((e) => e.type)));

  return (
    <PageSection title="Investigation Timeline">
      <TimelineFilters
        key={searchParams.toString()}
        people={people}
        locations={locations}
        types={types}
        initial={query}
      />
      <TimelineList
        events={visibleEvents}
        people={people}
        locations={locations}
      />
    </PageSection>
  );
}
