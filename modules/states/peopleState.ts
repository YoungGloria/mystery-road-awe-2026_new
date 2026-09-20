import { evidenceMentionsPerson, allEvidence } from './evidenceState.js';
import type { Person } from '../types.js';

let allPeople: Person[] = [];

async function loadPeople(): Promise<Person[]> {
  try {
    const peopleRes = await fetch('data/people.json');

    if (!peopleRes.ok) {
      throw new Error('Error fetching people.json: ' + peopleRes.statusText);
    }

    const data = (await peopleRes.json()) as Person[];
    allPeople = data;
    return allPeople;
  } catch (err) {
    console.error('Failed to load people.json', err);
    alert('People could not be loaded. Some views may be incomplete.');
    return [];
  }
}

function countEvidenceForPerson(person: Person): number {
  let count = 0;
  for (let i = 0; i < allEvidence.length; i++) {
    const evidence = allEvidence[i];
    if (evidence && evidenceMentionsPerson(evidence, person)) count++;
  }
  return count;
}

function findPersonById(id: string): Person | null {
  for (let i = 0; i < allPeople.length; i++) {
    const person = allPeople[i];
    if (person?.id === id) return person;
  }
  return null;
}

export { allPeople, loadPeople, findPersonById, countEvidenceForPerson };
