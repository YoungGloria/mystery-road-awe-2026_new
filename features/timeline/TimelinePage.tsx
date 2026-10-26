import type { Location, Person, TimelineEvent } from '../modules/types';
import { PageSection } from '../components/PageSection';
import { TimelineEventCard } from '../components/TimelineEventCard';
import { EmptyState } from '../components/EmptyState';

type TimelinePageProps = {
  events: TimelineEvent[];
  people: Person[];
  locations: Location[];
};

export function TimelinePage({ events, people, locations }: TimelinePageProps) {
  const chronological = [...events].sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
  );

  if (events.length === 0) {
  return (
    <PageSection title="Investigation Timeline">
      <EmptyState message="No timeline events available." />
    </PageSection>
  );
}
  return (
  <PageSection title="Investigation Timeline">
    <div className="timeline-container">
      {chronological.map((event) => (
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
