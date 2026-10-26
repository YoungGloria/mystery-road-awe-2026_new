import type { Location } from '../modules/types';

type EventPlacesProps = { places: Location[] };

export function EventPlaces({ places }: EventPlacesProps) {
  if (places.length === 0) return null;

  return (
    <p className="evidence-meta">
      Location: {places.map((p) => `${p.id} - ${p.name}`).join(', ')}
    </p>
  );
}