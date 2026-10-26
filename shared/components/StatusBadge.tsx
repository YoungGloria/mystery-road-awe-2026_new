import type { EvidenceStatus } from '../../modules/types';
import { Badge, type BadgeVariant } from './Badge';

const STATUS_VARIANT: Record<EvidenceStatus, BadgeVariant> = {
  unreviewed: 'unreviewed',
  reviewed: 'reviewed',
  flagged: 'flagged',
};

type StatusBadgeProps = { status: EvidenceStatus };

export function StatusBadge({ status }: StatusBadgeProps) {
  return <Badge variant={STATUS_VARIANT[status]}>{status}</Badge>;
}
