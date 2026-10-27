import type { Location, Person } from '../../../modules/types';
import { FilterSelect } from './FilterSelect';
import type { TimelineQuery } from '../timelineQuery';

type TimelineFiltersProps = {
  people: Person[];
  locations: Location[];
  types: string[];
  initial: TimelineQuery;
  onChange: (parameter: string, value: string) => void;
};

export function TimelineFilters({
  people,
  locations,
  types,
  initial,
  onChange,
}: TimelineFiltersProps) {
  return (
    <div className="toolbar">
      <div className="toolbar-row">
        <FilterSelect
          id="timelineOrder"
          label="Order"
          allLabel="Oldest first"
          value={initial.order === 'desc' ? 'desc' : ''}
          onChange={(value) => onChange('order', value)}
          options={[{ value: 'desc', label: 'Newest first' }]}
        />
        <FilterSelect
          id="timelinePersonFilter"
          label="Filter by person"
          allLabel="All people"
          value={initial.personId}
          onChange={(value) => onChange('person', value)}
          options={people.map((p) => ({ value: p.id, label: p.name }))}
        />
        <FilterSelect
          id="timelineLocationFilter"
          label="Filter by location"
          allLabel="All locations"
          value={initial.locationId}
          onChange={(value) => onChange('location', value)}
          options={locations.map((l) => ({
            value: l.id,
            label: `${l.id} - ${l.name}`,
          }))}
        />
        <FilterSelect
          id="timelineTypeFilter"
          label="Filter by event type"
          allLabel="All event types"
          value={initial.type}
          onChange={(value) => onChange('type', value)}
          options={types.map((t) => ({ value: t, label: t }))}
        />
      </div>
    </div>
  );
}
