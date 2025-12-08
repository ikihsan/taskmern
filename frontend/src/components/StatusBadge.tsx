import type { TaskStatus } from '../types/task';
import { formatStatusLabel } from '../utils/status';

interface StatusBadgeProps {
  status: TaskStatus;
}

const StatusBadge = ({ status }: StatusBadgeProps) => (
  <span className={`status-pill status-pill--${status}`}>
    {formatStatusLabel(status)}
  </span>
);

export default StatusBadge;
