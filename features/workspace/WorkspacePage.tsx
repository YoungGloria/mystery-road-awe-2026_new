import { PageSection } from '../../shared/components/PageSection';
import type { Evidence, Person } from '../../modules/types';
import { HypothesisForm } from './components/HypothesisForm';
import { WorkspaceLists } from './components/WorkspaceLists';

type WorkspacePageProps = {
  evidence: Evidence[];
  people: Person[];
  notes: Record<string, string>;
};

export function WorkspacePage({ evidence, people, notes }: WorkspacePageProps) {
  const bookmarkedEvidence = evidence.filter((item) => item.bookmarked);
  const notedEvidence = evidence.filter((item) => Boolean(notes[item.id]));

  return (
    <PageSection title="Workspace">
      <WorkspaceLists
        bookmarkedEvidence={bookmarkedEvidence}
        notes={notedEvidence}
        noteValues={notes}
      />
      <HypothesisForm evidence={evidence} people={people} />
    </PageSection>
  );
}
