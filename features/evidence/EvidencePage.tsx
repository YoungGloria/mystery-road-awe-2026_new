import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Evidence, Location, Person } from '../../modules/types';
import { EmptyState } from '../../shared/components/EmptyState';
import { PageSection } from '../../shared/components/PageSection';
import { Panel } from '../../shared/components/Panel';
import { EvidenceCard } from './components/EvidenceCard';
import { EvidenceDetail } from './components/EvidenceDetail';

type EvidencePageProps = {
  evidence: Evidence[];
  people: Person[];
  locations: Location[];
  onToggleBookmark: (evidenceId: string) => void;
  onUpdateEvidence: (evidenceId: string, changes: Partial<Evidence>) => void;
};

type EvidenceFilters = {
  search: string;
  type: string;
  person: string;
  location: string;
  status: string;
  relevance: string;
  sort: 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc';
};

const DEFAULT_FILTERS: EvidenceFilters = {
  search: '',
  type: '',
  person: '',
  location: '',
  status: '',
  relevance: '',
  sort: 'date-desc',
};

function getFilters(params: URLSearchParams): EvidenceFilters {
  const sort = params.get('sort');
  return {
    search: params.get('search') ?? '',
    type: params.get('type') ?? '',
    person: params.get('person') ?? '',
    location: params.get('location') ?? '',
    status: params.get('status') ?? '',
    relevance: params.get('relevance') ?? '',
    sort:
      sort === 'date-asc' || sort === 'title-asc' || sort === 'title-desc'
        ? sort
        : DEFAULT_FILTERS.sort,
  };
}

function evidenceMatchesPerson(item: Evidence, person: Person): boolean {
  return (
    item.personIds.includes(person.id) || item.personIds.includes(person.name)
  );
}

function updateFilterParams(
  current: URLSearchParams,
  changes: Partial<EvidenceFilters>
): URLSearchParams {
  const next = new URLSearchParams(current);
  Object.entries(changes).forEach(([key, value]) => {
    if (!value || (key === 'sort' && value === DEFAULT_FILTERS.sort)) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
  });
  return next;
}

export function EvidencePage({
  evidence,
  people,
  locations,
  onToggleBookmark,
  onUpdateEvidence,
}: EvidencePageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = getFilters(searchParams);
  const selectedId = searchParams.get('item');
  const selectedItem = evidence.find((item) => item.id === selectedId);

  const types = useMemo(
    () => Array.from(new Set(evidence.map((item) => item.type.toLowerCase()))),
    [evidence]
  );

  const visibleEvidence = useMemo(() => {
    const search = filters.search.toLowerCase().trim();
    const filtered = evidence.filter((item) => {
      const haystack =
        `${item.title} ${item.summary} ${item.tags.join(' ')}`.toLowerCase();
      const person = people.find(
        (candidate) => candidate.id === filters.person
      );
      return (
        (!search || haystack.includes(search)) &&
        (!filters.type || item.type.toLowerCase() === filters.type) &&
        (!person || evidenceMatchesPerson(item, person)) &&
        (!filters.location || item.locationIds.includes(filters.location)) &&
        (!filters.status || item.status === filters.status) &&
        (!filters.relevance || item.relevance === filters.relevance)
      );
    });

    return filtered.sort((a, b) => {
      if (filters.sort === 'title-asc') return a.title.localeCompare(b.title);
      if (filters.sort === 'title-desc') return b.title.localeCompare(a.title);
      const difference =
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      return filters.sort === 'date-asc' ? difference : -difference;
    });
  }, [filters, evidence, people]);

  function updateFilters(changes: Partial<EvidenceFilters>) {
    setSearchParams(updateFilterParams(searchParams, changes));
  }

  function openItem(id: string) {
    const next = new URLSearchParams(searchParams);
    next.set('item', id);
    setSearchParams(next);
  }

  function closeDetail() {
    const next = new URLSearchParams(searchParams);
    next.delete('item');
    setSearchParams(next);
  }

  function updateSelected(changes: Partial<Evidence>) {
    if (!selectedId) return;
    onUpdateEvidence(selectedId, changes);
  }

  function clearFilters() {
    const next = new URLSearchParams();
    if (selectedId) next.set('item', selectedId);
    setSearchParams(next);
  }

  return (
    <PageSection title="Evidence">
      <Panel title="Evidence catalogue">
        <div className="toolbar">
          <div className="toolbar-row">
            <input
              type="text"
              placeholder="Search title, summary, or tags..."
              value={filters.search}
              onChange={(event) =>
                updateFilters({ search: event.target.value })
              }
              aria-label="Search evidence"
            />
            <select
              value={filters.sort}
              onChange={(event) =>
                updateFilters({
                  sort: event.target.value as EvidenceFilters['sort'],
                })
              }
              aria-label="Sort evidence"
            >
              <option value="date-desc">Newest first</option>
              <option value="date-asc">Oldest first</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
            </select>
          </div>
          <div className="toolbar-row">
            <select
              value={filters.type}
              onChange={(event) => updateFilters({ type: event.target.value })}
              aria-label="Filter by type"
            >
              <option value="">All types</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <select
              value={filters.person}
              onChange={(event) =>
                updateFilters({ person: event.target.value })
              }
              aria-label="Filter by person"
            >
              <option value="">All people</option>
              {people.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
            <select
              value={filters.location}
              onChange={(event) =>
                updateFilters({ location: event.target.value })
              }
              aria-label="Filter by location"
            >
              <option value="">All locations</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.id} - {location.name}
                </option>
              ))}
            </select>
            <select
              value={filters.status}
              onChange={(event) =>
                updateFilters({ status: event.target.value })
              }
              aria-label="Filter by status"
            >
              <option value="">All statuses</option>
              <option value="unreviewed">Unreviewed</option>
              <option value="reviewed">Reviewed</option>
              <option value="flagged">Flagged</option>
            </select>
            <select
              value={filters.relevance}
              onChange={(event) =>
                updateFilters({ relevance: event.target.value })
              }
              aria-label="Filter by relevance"
            >
              <option value="">All relevance</option>
              <option value="unknown">Unknown</option>
              <option value="relevant">Relevant</option>
              <option value="irrelevant">Irrelevant</option>
            </select>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          </div>
        </div>

        {visibleEvidence.length === 0 ? (
          <EmptyState message="No evidence matches the current filters." />
        ) : (
          <div className="evidence-grid">
            {visibleEvidence.map((item) => (
              <EvidenceCard
                key={item.id}
                item={item}
                onOpen={() => openItem(item.id)}
                onToggleBookmark={() => onToggleBookmark(item.id)}
              />
            ))}
          </div>
        )}
      </Panel>

      {selectedItem && (
        <EvidenceDetail
          key={selectedItem.id}
          item={selectedItem}
          people={people}
          locations={locations}
          onClose={closeDetail}
          onUpdate={updateSelected}
        />
      )}
    </PageSection>
  );
}
