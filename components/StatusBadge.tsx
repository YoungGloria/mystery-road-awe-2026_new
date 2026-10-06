import { getStatusBadgeClass } from '../modules/helpers';
import type { EvidenceStatus } from '../modules/types';

type StatusBadgeProps = {
  status: EvidenceStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`badge ${getStatusBadgeClass(status)}`}>{status}</span>
  );
}