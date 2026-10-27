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
  const [searchParams, setSearchParams] = useSearchParams();
  const query = parseTimelineQuery(searchParams);
  const visibleEvents = selectTimelineEvents(events, query);
  const types = Array.from(new Set(events.map((e) => e.type)));

  function updateFilter(parameter: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(parameter, value);
    } else {
      next.delete(parameter);
    }
    setSearchParams(next);
  }

  return (
    <PageSection title="Investigation Timeline">
      <TimelineFilters
        key={searchParams.toString()}
        people={people}
        locations={locations}
        types={types}
        initial={query}
        onChange={updateFilter}
      />
      <TimelineList
        events={visibleEvents}
        people={people}
        locations={locations}
      />
    </PageSection>
  );
}
