import type { TimelineCertainty } from '../../../modules/types';
import { Badge, type BadgeVariant } from '../../../shared/components/Badge';

const CERTAINTY_VARIANT: Record<TimelineCertainty, BadgeVariant> = {
  confirmed: 'reviewed',
  reported: 'flagged',
  contradictory: 'critical',
};

type CertaintyBadgeProps = { certainty: TimelineCertainty };

export function CertaintyBadge({ certainty }: CertaintyBadgeProps) {
  return <Badge variant={CERTAINTY_VARIANT[certainty]}>{certainty}</Badge>;
}
