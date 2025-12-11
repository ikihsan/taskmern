import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import type { Task, TaskInput } from '../types/task';
import { createTaskRequest, deleteTaskRequest, fetchTasks, updateTaskRequest } from '../services/tasks';
import { extractErrorMessage } from '../utils/http';

const TasksPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const tasksQuery = useQuery({ 
    queryKey: ['tasks', page, limit], 
    queryFn: () => fetchTasks({ page, limit })
  });

  const createMutation = useMutation({
    mutationFn: createTaskRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setPage(1); // Reset to first page after creating
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: TaskInput }) => updateTaskRequest(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] })
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTaskRequest,
    onError: (error) => {
      window.alert(extractErrorMessage(error, 'Failed to delete task'));
    },
    onSettled: () => {
      setDeletingId(null);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  const handleCreate = (payload: TaskInput) => createMutation.mutateAsync(payload);

  const handleUpdate = async (payload: TaskInput) => {
    if (!editingTask) return;
    await updateMutation.mutateAsync({ id: editingTask.id, input: payload });
    setEditingTask(null);
  };

  const handleDelete = (task: Task) => {
    const confirmed = window.confirm(`Delete "${task.title}"? This cannot be undone.`);
    if (!confirmed) return;
    setDeletingId(task.id);
    deleteMutation.mutate(task.id);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const tasks = tasksQuery.data?.data ?? [];
  const pagination = tasksQuery.data?.pagination;
  const overdueCount = tasks.filter((task) => task.status === 'overdue').length;
  const completedCount = tasks.filter((task) => task.status === 'completed').length;

  const handlePrevPage = () => {
    if (pagination?.hasPrevPage) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination?.hasNextPage) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="brandmark">Pulse Tasks</p>
          <p className="task-meta">Stay ahead, {user?.name?.split(' ')[0] || 'maker'}.</p>
        </div>
        <div className="app-header__actions">
          <div className="header-stats">
            <div className="stat-card">
              <div className="stat-label">Total</div>
              <div className="stat-value">{pagination?.totalTasks ?? 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Overdue</div>
              <div className="stat-value" style={{ color: 'var(--danger)' }}>
                {overdueCount}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Done</div>
              <div className="stat-value" style={{ color: 'var(--success)' }}>
                {completedCount}
              </div>
            </div>
          </div>
          <button className="btn btn--ghost" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="app-main">
        <section className="panel">
          <h2 className="section-title">Add a task</h2>
          <TaskForm mode="create" submitting={createMutation.isPending} onSubmit={handleCreate} />
        </section>

        <section className="panel panel--list">
          <h2 className="section-title">Your workflow</h2>
          {tasksQuery.isLoading && <p className="task-meta">Loading tasks...</p>}
          {tasksQuery.error && <p className="form-error">Failed to load tasks.</p>}
          {!tasksQuery.isLoading && !tasks.length && !tasksQuery.error && (
            <div className="empty-state">
              No tasks yet. Log something to start the overdue tracker.
            </div>
          )}
          {tasks.length > 0 && (
            <>
              <div className="task-grid">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={setEditingTask}
                    onDelete={handleDelete}
                    deleting={deletingId === task.id}
                  />
                ))}
              </div>
              {pagination && pagination.totalPages > 1 && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  marginTop: '2rem',
                  padding: '1rem'
                }}>
                  <button 
                    className="btn btn--ghost" 
                    onClick={handlePrevPage}
                    disabled={!pagination.hasPrevPage}
                    style={{ minWidth: '100px' }}
                  >
                    Previous
                  </button>
                  <span style={{ 
                    fontSize: '0.9rem', 
                    color: 'var(--text-muted)',
                    fontWeight: '500'
                  }}>
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button 
                    className="btn btn--ghost" 
                    onClick={handleNextPage}
                    disabled={!pagination.hasNextPage}
                    style={{ minWidth: '100px' }}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {editingTask && (
        <div className="sheet" role="dialog" aria-modal="true">
          <div className="sheet__body">
            <h3 className="section-title">Edit task</h3>
            <TaskForm
              mode="edit"
              initialValues={editingTask}
              submitting={updateMutation.isPending}
              onSubmit={handleUpdate}
              onCancel={() => setEditingTask(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;
