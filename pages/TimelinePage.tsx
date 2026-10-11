import type { Location, Person, TimelineEvent } from '../modules/types';
import { PageSection } from '../components/PageSection';
import { TimelineEventCard } from '../components/TimelineEventCard';

type TimelinePageProps = {
  events: TimelineEvent[];
  people: Person[];
  locations: Location[];
};

export function TimelinePage({ events, people, locations }: TimelinePageProps) {
  return (
    <PageSection title="Investigation Timeline">
      <div className="timeline-container">
        {events.map((event) => (
          <TimelineEventCard
            key={event.id}
            event={event}
            participants={people.filter((p) => event.personIds.includes(p.id))}
            places={locations.filter((l) => event.locationIds.includes(l.id))}
          />
        ))}
      </div>
    </PageSection>
  );
}
