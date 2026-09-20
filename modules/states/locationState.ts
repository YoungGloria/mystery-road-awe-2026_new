import type { Location } from '../types.js';

let allLocations: Location[] = [];

async function loadLocations(): Promise<Location[]> {
  try {
    const locationsRes = await fetch('data/locations.json');

    if (!locationsRes.ok) {
      throw new Error(
        'Error fetching locations.json: ' + locationsRes.statusText
      );
    }

    const data = (await locationsRes.json()) as Location[];
    allLocations = data;
    return allLocations;
  } catch (err) {
    console.error('Failed to load locations.json', err);
    alert('Locations could not be loaded. Some views may be incomplete.');
    return [];
  }
}

function findLocationById(id: string): Location | null {
  for (let i = 0; i < allLocations.length; i++) {
    const location = allLocations[i];
    if (location?.id === id) return location;
  }
  return null;
}

export { allLocations, loadLocations, findLocationById };
