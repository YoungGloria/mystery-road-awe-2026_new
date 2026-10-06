import { formatDate } from '../modules/helpers';
import type {
  CaseData,
  Evidence,
  Location,
  Person,
  TimelineEvent,
} from '../modules/types';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';

type DashboardPageProps = {
  caseData: CaseData | null;
  evidence: Evidence[];
  people: Person[];
  locations: Location[];
  timeline: TimelineEvent[];
  bookmarkCount: number;
};

export function DashboardPage({
  caseData,
  evidence,
  people,
  locations,
  timeline,
  bookmarkCount,
}: DashboardPageProps) {
  // Derived values: calculated on every render, not stored in state.
  const reviewedCount = evidence.filter(
    (item) => item.status === 'reviewed'
  ).length;
  const progressPct =
    evidence.length === 0
      ? 0
      : Math.round((reviewedCount / evidence.length) * 100);
  const recentEvidence = evidence.slice(-5).reverse();
  const recentTimeline = timeline.slice(-5).reverse();

  return (
    <section className="view active">
      <h2>Case Dashboard</h2>

      <div className="case-summary-card">
        <h3>{caseData?.title ?? 'Case'}</h3>
        <p>
          <span className="badge badge-flagged">
            {(caseData?.status ?? 'unknown').toUpperCase()}
          </span>
        </p>
        <p>{caseData?.summary ?? ''}</p>
      </div>

      <div className="stat-grid">
        <StatCard value={evidence.length} label="Evidence items" />
        <StatCard value={people.length} label="People" />
        <StatCard value={locations.length} label="Locations" />
        <StatCard value={bookmarkCount} label="Bookmarked" />
        <StatCard value={reviewedCount} label="Reviewed" />
      </div>

      <div className="dashboard-panel">
        <h3>Review progress</h3>
        <div className="progress-bar-outer">
          <div
            className="progress-bar-inner"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p>{progressPct}% of evidence reviewed</p>
      </div>

      <div className="dashboard-columns">
        <div className="dashboard-panel">
          <h3>Recent evidence</h3>
          {recentEvidence.length === 0 && <p>No evidence loaded yet.</p>}
          {recentEvidence.map((item) => (
            <div key={item.id} className="mini-list-item">
              <strong>{item.id}</strong> &mdash; {item.title}{' '}
              <StatusBadge status={item.status} />
            </div>
          ))}
        </div>

        <div className="dashboard-panel">
          <h3>Recent timeline events</h3>
          {recentTimeline.length === 0 && <p>No timeline events loaded yet.</p>}
          {recentTimeline.map((event) => (
            <div key={event.id} className="mini-list-item">
              <strong>{formatDate(event.time)}</strong>
              <br />
              {event.title}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}