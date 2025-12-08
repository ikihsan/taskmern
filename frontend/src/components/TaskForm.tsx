import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import dayjs from 'dayjs';
import { STATUS_OPTIONS } from '../utils/status';
import type { Task, TaskInput, TaskStatus } from '../types/task';

interface TaskFormProps {
  mode: 'create' | 'edit';
  initialValues?: Task;
  submitting?: boolean;
  onSubmit: (payload: TaskInput) => Promise<unknown>;
  onCancel?: () => void;
}

const normalizeDate = (value?: string) => (value ? dayjs(value).format('YYYY-MM-DD') : '');

const TaskForm = ({ mode, initialValues, submitting, onSubmit, onCancel }: TaskFormProps) => {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [status, setStatus] = useState<TaskStatus>(initialValues?.status ?? 'todo');
  const [dueDate, setDueDate] = useState(normalizeDate(initialValues?.dueDate));
  const [attachment, setAttachment] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const resetForm = () => {
    if (mode === 'create') {
      setTitle('');
      setStatus('todo');
      setDueDate('');
      setAttachment(null);
      if (fileRef.current) {
        fileRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) {
      setFormError('Title is required');
      return;
    }
    if (!dueDate) {
      setFormError('Select a due date');
      return;
    }

    setFormError(null);

    try {
      await onSubmit({
        title: title.trim(),
        dueDate,
        status,
        attachment
      });
      resetForm();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to save task');
    }
  };

  const handleFileChange = (files: FileList | null) => {
    if (!files?.length) {
      setAttachment(null);
      return;
    }
    setAttachment(files[0]);
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <div className="form-field">
        <label className="form-label" htmlFor={`${mode}-title`}>
          Title
        </label>
        <input
          id={`${mode}-title`}
          className="form-input"
          placeholder="Write a short summary"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor={`${mode}-due`}>
          Due date
        </label>
        <input
          id={`${mode}-due`}
          type="date"
          className="form-date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
        />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor={`${mode}-status`}>
          Status
        </label>
        <select
          id={`${mode}-status`}
          className="form-select"
          value={status}
          onChange={(event) => setStatus(event.target.value as TaskStatus)}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor={`${mode}-file`}>
          Attachment (PDF or image)
        </label>
        <input
          id={`${mode}-file`}
          ref={fileRef}
          className="form-file"
          type="file"
          accept="image/*,application/pdf"
          onChange={(event) => handleFileChange(event.target.files)}
        />
      </div>

      {formError && <p className="form-error">{formError}</p>}

      <div className="task-actions" style={{ justifyContent: 'flex-end' }}>
        {onCancel && (
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn--primary" disabled={submitting}>
          {submitting ? 'Saving...' : mode === 'create' ? 'Add Task' : 'Update Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
