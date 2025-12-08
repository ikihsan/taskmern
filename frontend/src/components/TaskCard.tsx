import dayjs from 'dayjs';
import AttachmentLink from './AttachmentLink';
import StatusBadge from './StatusBadge';
import type { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  deleting?: boolean;
}

const TaskCard = ({ task, onEdit, onDelete, deleting }: TaskCardProps) => {
  const dueDisplay = dayjs(task.dueDate).format('DD MMM YYYY');
  const overdue = task.status === 'overdue';

  return (
    <article className={`task-card ${overdue ? 'task-card--overdue' : ''}`}>
      <StatusBadge status={task.status} />
      <h3 className="task-card__title">{task.title}</h3>
      <p className="task-meta">Due {dueDisplay}</p>
      <AttachmentLink url={task.attachmentUrl} path={task.attachmentPath} />
      <div className="task-footer">
        <span className="task-meta">Created {dayjs(task.createdAt).format('DD MMM')}</span>
        <div className="task-actions">
          <button className="btn btn--ghost" onClick={() => onEdit(task)}>
            Edit
          </button>
          <button className="btn btn--ghost" onClick={() => onDelete(task)} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </article>
  );
};

export default TaskCard;
