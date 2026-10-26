import { Link, useParams } from 'react-router-dom';
import { evidenceMentionsPerson } from '../../modules/states/evidenceState';
import type { Evidence, Person } from '../../modules/types';
import { Panel } from '../../shared/components/Panel';
import { paths } from '../../shared/paths';

type PersonDetailPageProps = {
  people: Person[];
  evidence: Evidence[];
};

export function PersonDetailPage({ people, evidence }: PersonDetailPageProps) {
  const { personId } = useParams<{ personId: string }>();
  const person = people.find((p) => p.id === personId);

  if (!person) {
    return (
      <Panel title="Person not found">
        <p>
          There is no person with the id &ldquo;{personId}&rdquo; in this case.
        </p>
        <Link to="/team/people">Back to all people</Link>
      </Panel>
    );
  }

  const related = evidence.filter((item) =>
    evidenceMentionsPerson(item, person)
  );

  return (
    <Panel title={person.name}>
      <p className="person-role">{person.role}</p>
      <p>
        <strong>Speciality:</strong> {person.speciality}
      </p>
      <ul>
        {person.responsibilities.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div className="person-statement">&ldquo;{person.statement}&rdquo;</div>

      {related.length > 0 && (
        <>
          <h4>Related evidence</h4>
          <ul>
            {related.map((item) => (
              <li key={item.id}>
                <strong>{item.id}</strong> &mdash; {item.title}
              </li>
            ))}
          </ul>
        </>
      )}

      <p>
        <Link to={paths.timelineForPerson(person.id)}>
          Events involving {person.name}
        </Link>
        {' · '}
        <Link to="/team/people">All people</Link>
      </p>
    </Panel>
  );
}
