import { Link } from 'react-router-dom';
import type { Evidence } from '../../../modules/types';
import { EmptyState } from '../../../shared/components/EmptyState';
import { Panel } from '../../../shared/components/Panel';
import { paths } from '../../../shared/paths';

type WorkspaceListsProps = {
  bookmarkedEvidence: Evidence[];
  notes: Evidence[];
  noteValues: Record<string, string>;
};

export function WorkspaceLists({
  bookmarkedEvidence,
  notes,
  noteValues,
}: WorkspaceListsProps) {
  return (
    <div className="workspace-grid">
      <Panel title="Bookmarked evidence">
        <div className="bookmarks-list">
          {bookmarkedEvidence.length === 0 ? (
            <EmptyState message="No bookmarked evidence yet. Bookmark items from the Evidence view." />
          ) : (
            bookmarkedEvidence.map((item) => (
              <div key={item.id} className="mini-list-item">
                <strong>{item.id}</strong> &mdash; {item.title}{' '}
                <Link
                  className="btn btn-small btn-secondary"
                  to={paths.evidenceItem(item.id)}
                >
                  Open
                </Link>
              </div>
            ))
          )}
        </div>
      </Panel>
      <Panel title="Notes">
        <div className="notes-list">
          {notes.length === 0 ? (
            <EmptyState message="No notes yet. Add one from an evidence item's detail view." />
          ) : (
            notes.map((item) => (
              <div key={item.id} className="mini-list-item">
                <strong>{item.id}</strong> &mdash; {item.title}
                <div>{noteValues[item.id]}</div>
              </div>
            ))
          )}
        </div>
      </Panel>
    </div>
  );
}
