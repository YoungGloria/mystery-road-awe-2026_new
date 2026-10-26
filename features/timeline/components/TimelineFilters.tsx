import type { Location, Person } from '../../../modules/types';
import { FilterSelect } from './FilterSelect';

type TimelineFiltersProps = {
  people: Person[];
  locations: Location[];
  types: string[];
};

export function TimelineFilters({
  people,
  locations,
  types,
}: TimelineFiltersProps) {
  return (
    <div className="toolbar">
      <div className="toolbar-row">
        <FilterSelect
          id="timelineOrder"
          label="Order"
          allLabel="Oldest first"
          defaultValue=""
          options={[{ value: 'desc', label: 'Newest first' }]}
        />
        <FilterSelect
          id="timelinePersonFilter"
          label="Filter by person"
          allLabel="All people"
          defaultValue=""
          options={people.map((p) => ({ value: p.id, label: p.name }))}
        />
        <FilterSelect
          id="timelineLocationFilter"
          label="Filter by location"
          allLabel="All locations"
          defaultValue=""
          options={locations.map((l) => ({
            value: l.id,
            label: `${l.id} - ${l.name}`,
          }))}
        />
        <FilterSelect
          id="timelineTypeFilter"
          label="Filter by event type"
          allLabel="All event types"
          defaultValue=""
          options={types.map((t) => ({ value: t, label: t }))}
        />
      </div>
    </div>
  );
}
