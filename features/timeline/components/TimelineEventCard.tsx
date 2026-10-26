import { formatDate } from '../../../modules/helpers';
import type { Location, Person, TimelineEvent } from '../../../modules/types';
import { CertaintyBadge } from './CertaintyBadge';
import { EventPlaces } from './EventPlaces';

type TimelineEventCardProps = {
  event: TimelineEvent;
  participants: Person[];
  places: Location[];
};

export function TimelineEventCard({
  event,
  participants,
  places,
}: TimelineEventCardProps) {
  return (
    <article className={`timeline-event certainty-${event.certainty}`}>
      <div className="timeline-time">
        {formatDate(event.time)}&nbsp;&middot;&nbsp;
        <CertaintyBadge certainty={event.certainty} />
      </div>
      <h3>{event.title}</h3>
      <p>{event.description}</p>

      {participants.length > 0 && (
        <p className="evidence-meta">
          People: {participants.map((p) => p.name).join(', ')}
        </p>
      )}

      <EventPlaces places={places} />

      {event.evidenceIds.map((id) => (
        <span key={id} className="evidence-link-btn">
          View {id}
        </span>
      ))}
    </article>
  );
}
