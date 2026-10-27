import { formatDate } from '../../../modules/helpers';
import type { Evidence } from '../../../modules/types';
import { Badge } from '../../../shared/components/Badge';
import { StatusBadge } from '../../../shared/components/StatusBadge';

type EvidenceCardProps = {
  item: Evidence;
  onOpen: () => void;
  onToggleBookmark: () => void;
};

export function EvidenceCard({
  item,
  onOpen,
  onToggleBookmark,
}: EvidenceCardProps) {
  const relevanceVariant =
    item.relevance === 'relevant' ? 'relevant' : 'unreviewed';

  return (
    <article
      className="evidence-card"
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') onOpen();
      }}
      role="button"
      tabIndex={0}
    >
      <button
        type="button"
        className={`bookmark-btn${item.bookmarked ? ' active' : ''}`}
        aria-label={`Toggle bookmark for ${item.title}`}
        onClick={(event) => {
          event.stopPropagation();
          onToggleBookmark();
        }}
      >
        <span className="bookmark-icon" aria-hidden="true">
          {item.bookmarked ? '★' : '☆'}
        </span>
      </button>
      <h3>{item.title}</h3>
      <div className="evidence-meta">
        {item.id} &middot; {item.type} &middot; {formatDate(item.timestamp)}
      </div>
      <div className="evidence-summary">{item.summary}</div>
      {item.tags.includes('critical') && (
        <Badge variant="critical">Critical</Badge>
      )}
      <StatusBadge status={item.status} />
      <Badge variant={relevanceVariant}>{item.relevance}</Badge>
      <div>
        {item.tags.map((tag) => (
          <span key={tag} className="tag-chip">
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
