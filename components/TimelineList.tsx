import type { Location, Person, TimelineEvent } from '../modules/types';
import { EmptyState } from './EmptyState';
import { TimelineEventCard } from './TimelineEventCard';

type TimelineListProps = {
  events: TimelineEvent[];
  people: Person[];
  locations: Location[];
};

export function TimelineList({ events, people, locations }: TimelineListProps) {
  if (events.length === 0) {
    return <EmptyState message="No timeline events match the current filters." />;
  }

  return (
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
  );
}