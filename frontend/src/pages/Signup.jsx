import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/signup', { name, email, password });
      login(res.data.token, res.data.user);
      navigate('/tools/tracker', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Could not create your account.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <p className="pill mb-3 inline-block self-start border border-alarm text-alarm">Join the fight</p>
      <h1 className="section-heading">Create your account</h1>

      {error && (
        <div className="card mt-4 border-l-4 border-l-alarm">
          <p className="text-alarm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label className="label">Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            placeholder="Jane Doe"
          />
        </div>
        <div>
          <label className="label">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="label">Password</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            placeholder="At least 8 characters"
          />
        </div>
        <button type="submit" className="btn-primary mt-2" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign up'}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink-500">
        Already have an account?{' '}
        <Link to="/login" className="text-signal underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
