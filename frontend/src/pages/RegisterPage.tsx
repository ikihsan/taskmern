import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { registerRequest } from '../services/auth';
import { useAuth } from '../hooks/useAuth';
import { extractErrorMessage } from '../utils/http';

const RegisterPage = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const MIN_PASSWORD_LENGTH = 6;

  const registerMutation = useMutation({
    mutationFn: registerRequest,
    onSuccess: (payload) => {
      setAuth(payload);
      navigate('/tasks');
    },
    onError: (mutationError) => {
      setError(extractErrorMessage(mutationError, 'Unable to register'));
    }
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (form.password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password should be at least ${MIN_PASSWORD_LENGTH} characters long.`);
      return;
    }
    registerMutation.mutate({ ...form });
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <p className="brandmark">Pulse Tasks</p>
        <h1 className="auth-card__title">Create your workspace</h1>
        <p className="task-meta">Register to manage tasks, attachments, and overdue alerts.</p>
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label" htmlFor="register-name">
              Full name
            </label>
            <input
              id="register-name"
              className="form-input"
              autoComplete="name"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="register-email">
              Email
            </label>
            <input
              id="register-email"
              className="form-input"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="register-password">
              Password
            </label>
            <input
              id="register-password"
              className="form-input"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button className="btn btn--primary" type="submit" disabled={registerMutation.isPending}>
            {registerMutation.isPending ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className="task-meta">
          Already onboard?{' '}
          <Link className="link-text" to="/login">
            Log in instead
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
