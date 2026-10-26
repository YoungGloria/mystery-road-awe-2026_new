import { Link } from 'react-router-dom';
import { formatDate } from '../../../modules/helpers';
import type { Location, Person, TimelineEvent } from '../../../modules/types';
import { CertaintyBadge } from './CertaintyBadge';
import { EventPlaces } from './EventPlaces';
import { paths } from '../../../shared/paths';

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
          People:{' '}
          {participants.map((person, i) => (
            <span key={person.id}>
              {i > 0 && ', '}
              <Link to={paths.person(person.id)}>{person.name}</Link>
            </span>
          ))}
        </p>
      )}

      <EventPlaces places={places} />

      {event.evidenceIds.map((id) => (
        <Link
          key={id}
          className="evidence-link-btn"
          to={paths.evidenceItem(id)}
        >
          View {id}
        </Link>
      ))}
    </article>
  );
}
