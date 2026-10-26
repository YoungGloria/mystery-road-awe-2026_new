import type { Person } from '../../../modules/types';
import { Link } from 'react-router-dom';
import { paths } from '../../../shared/paths';

type PersonCardProps = {
  person: Person;
  evidenceCount: number;
};

export function PersonCard({ person, evidenceCount }: PersonCardProps) {
  return (
    <article className="person-card">
      <div className="person-card-header">
        <img
          className="person-avatar"
          src={person.avatar}
          alt={`Portrait of ${person.name}`}
        />
        <div>
          <h3>
            <Link to={paths.person(person.id)}>{person.name}</Link>
          </h3>
          <div className="person-role">{person.role}</div>
        </div>
      </div>

      <p>
        <strong>Speciality:</strong> {person.speciality}
      </p>
      <ul>
        {person.responsibilities.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <div className="person-statement">&ldquo;{person.statement}&rdquo;</div>

      <p>
        {evidenceCount} related evidence item{evidenceCount === 1 ? '' : 's'}{' '}
        &mdash;{' '}
        <Link
          className="evidence-count-link"
          to={paths.evidenceForPerson(person.id)}
        >
          view
        </Link>
      </p>
    </article>
  );
}
