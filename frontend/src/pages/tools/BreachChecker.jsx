import { useState } from 'react';
import api from '../../api';

export default function BreachChecker() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!email.trim()) return;

    setLoading(true);
    try {
      const res = await api.get('/breach-check', { params: { email: email.trim() } });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong checking this email.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="pill mb-3 inline-block border border-signal text-signal">Breach Checker</p>
      <h1 className="section-heading">Have you been pwned?</h1>
      <p className="mt-2 max-w-2xl text-ink-500">
        Enter an email address to check it against known data breaches via the{' '}
        <a href="https://haveibeenpwned.com" target="_blank" rel="noreferrer" className="text-signal underline">
          Have I Been Pwned
        </a>{' '}
        database. We never store the email you enter.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="input flex-1"
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Checking...' : 'Check email'}
        </button>
      </form>

      {result?.source === 'demo' && (
        <p className="mt-3 text-xs text-amber-600">
          Demo mode: no HaveIBeenPwned API key configured on the server, so results are
          drawn from seeded sample data. Try <code className="font-mono">demo@example.com</code> or{' '}
          <code className="font-mono">test@test.com</code>.
        </p>
      )}

      {error && (
        <div className="card mt-6 border-l-4 border-l-alarm">
          <p className="text-alarm">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-8">
          {result.breaches.length === 0 ? (
            <div className="card border-l-4 border-l-signal text-center">
              <h2 className="font-display text-2xl text-signal">Good news</h2>
              <p className="mt-2 text-ink-700">
                No breaches were found for <span className="font-mono">{result.email}</span> in this database.
                That doesn't guarantee your data has never been exposed. Keep using strong, unique passwords.
              </p>
            </div>
          ) : (
            <>
              <div className="card border-l-4 border-l-alarm">
                <h2 className="font-display text-2xl text-alarm">
                  Found in {result.breaches.length} breach{result.breaches.length === 1 ? '' : 'es'}
                </h2>
                <p className="mt-2 text-ink-700">
                  <span className="font-mono">{result.email}</span> appeared in the following known data breaches.
                </p>
              </div>
              <div className="mt-4 space-y-4">
                {result.breaches.map((breach) => (
                  <div key={breach.Name} className="card">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-display text-xl uppercase text-ink-900">{breach.Name}</h3>
                      {breach.BreachDate && (
                        <span className="pill border border-ink-300 text-ink-500">{breach.BreachDate}</span>
                      )}
                    </div>
                    {breach.Domain && <p className="mt-1 text-sm text-ink-500">{breach.Domain}</p>}
                    {breach.Description && (
                      <p className="mt-3 text-sm text-ink-700">
                        {breach.Description.replace(/<[^>]*>/g, '')}
                      </p>
                    )}
                    {breach.PwnCount && (
                      <p className="mt-2 text-xs text-ink-500">
                        {breach.PwnCount.toLocaleString()} accounts affected
                      </p>
                    )}
                    {breach.DataClasses && breach.DataClasses.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {breach.DataClasses.map((dc) => (
                          <span key={dc} className="pill border border-ink-200 text-ink-500">
                            {dc}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
