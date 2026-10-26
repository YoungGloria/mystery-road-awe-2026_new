import { evidenceMentionsPerson } from '../modules/states/evidenceState';
import type { Evidence, Person } from '../modules/types';
import { PersonCard } from './PersonCard';

type PeopleListProps = {
  people: Person[];
  evidence: Evidence[];
};

export function PeopleList({ people, evidence }: PeopleListProps) {
  return (
    <div className="people-grid">
      {people.map((person) => (
        <PersonCard
          key={person.id}
          person={person}
          evidenceCount={evidence.filter((item) => evidenceMentionsPerson(item, person)).length}
        />
      ))}
    </div>
  );
}