import type { TimelineEvent } from '../../modules/types';

export type TimelineQuery = {
  personId: string;
  locationId: string;
  type: string;
  order: 'asc' | 'desc';
};

export function parseTimelineQuery(params: URLSearchParams): TimelineQuery {
  return {
    personId: params.get('person') ?? '',
    locationId: params.get('location') ?? '',
    type: params.get('type') ?? '',
    order: params.get('order') === 'desc' ? 'desc' : 'asc',
  };
}

export function selectTimelineEvents(
  events: TimelineEvent[],
  query: TimelineQuery
): TimelineEvent[] {
  return events
    .filter((e) => !query.personId || e.personIds.includes(query.personId))
    .filter(
      (e) => !query.locationId || e.locationIds.includes(query.locationId)
    )
    .filter((e) => !query.type || e.type === query.type)
    .sort((a, b) => {
      const diff = new Date(a.time).getTime() - new Date(b.time).getTime();
      return query.order === 'desc' ? -diff : diff;
    });
}
