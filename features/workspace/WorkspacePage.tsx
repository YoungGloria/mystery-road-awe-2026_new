import { PageSection } from '../../shared/components/PageSection';
import type { Evidence, Person } from '../../modules/types';
import { notesStore } from '../../modules/states/evidenceState';
import { HypothesisForm } from './components/HypothesisForm';
import { WorkspaceLists } from './components/WorkspaceLists';

type WorkspacePageProps = {
  evidence: Evidence[];
  people: Person[];
};

export function WorkspacePage({ evidence, people }: WorkspacePageProps) {
  const bookmarkedEvidence = evidence.filter((item) => item.bookmarked);
  const notes = evidence.filter((item) => Boolean(notesStore[item.id]));

  return (
    <PageSection title="Workspace">
      <WorkspaceLists bookmarkedEvidence={bookmarkedEvidence} notes={notes} />
      <HypothesisForm evidence={evidence} people={people} />
    </PageSection>
  );
}
