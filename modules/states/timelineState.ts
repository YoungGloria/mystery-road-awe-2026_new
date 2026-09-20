import type { TimelineEvent } from '../types.js';

let allTimeline: TimelineEvent[] = [];

async function loadTimelineData(): Promise<TimelineEvent[]> {
  try {
    const locationRes = await fetch('data/timeline.json');

    if (!locationRes.ok) {
      throw new Error('Error fetching timeline.json: ' + locationRes.statusText);
    }

    const data = (await locationRes.json() as TimelineEvent[]).map((event) => ({
      ...event,
      certainty: event.certainty.toLowerCase() as TimelineEvent['certainty'],
    }));
    return allTimeline = data;
  } catch (err) {
    console.error('Failed to load timeline.json', err);
    alert('Timeline could not be loaded. Some views may be incomplete.');
    return []; 
  }
}

export { allTimeline, loadTimelineData };
