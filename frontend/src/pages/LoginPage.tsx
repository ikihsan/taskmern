import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { loginRequest } from '../services/auth';
import { useAuth } from '../hooks/useAuth';
import { extractErrorMessage } from '../utils/http';

const LoginPage = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: (payload) => {
      setAuth(payload);
      navigate('/tasks');
    },
    onError: (mutationError) => {
      setError(extractErrorMessage(mutationError, 'Unable to login'));
    }
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    loginMutation.mutate({ ...form });
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <p className="brandmark">Pulse Tasks</p>
        <h1 className="auth-card__title">Welcome back</h1>
        <p className="task-meta">Log in to keep overdue work under control.</p>
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label" htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              className="form-input"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              className="form-input"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button className="btn btn--primary" type="submit" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? 'Signing in...' : 'Login'}
          </button>
        </form>
        <p className="task-meta">
          Need an account?{' '}
          <Link className="link-text" to="/register">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
