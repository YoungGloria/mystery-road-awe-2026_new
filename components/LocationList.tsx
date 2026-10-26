import type { Location } from '../modules/types';
import { LocationCard } from './LocationCard';

type LocationListProps = { locations: Location[] };

export function LocationList({ locations }: LocationListProps) {
  return (
    <div className="locations-grid">
      {locations.map((location) => (
        <LocationCard key={location.id} location={location} />
      ))}
    </div>
  );
}