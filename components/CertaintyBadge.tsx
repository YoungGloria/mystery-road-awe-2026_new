import type { TimelineCertainty } from '../modules/types';

const CERTAINTY_CLASS: Record<TimelineCertainty, string> = {
  confirmed: 'badge badge-reviewed',
  reported: 'badge badge-flagged',
  contradictory: 'badge badge-critical',
};

type CertaintyBadgeProps = { certainty: TimelineCertainty };

export function CertaintyBadge({ certainty }: CertaintyBadgeProps) {
  return <span className={CERTAINTY_CLASS[certainty]}>{certainty}</span>;
}