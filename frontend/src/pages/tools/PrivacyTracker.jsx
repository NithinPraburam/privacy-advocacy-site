import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';

export default function PrivacyTracker() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [checkupHistory, setCheckupHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [customCategory, setCustomCategory] = useState('general');

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const [itemsRes, catalogRes, checkupRes] = await Promise.all([
        api.get('/tracker'),
        api.get('/tracker/catalog'),
        api.get('/checkup'),
      ]);
      setItems(itemsRes.data.items);
      setCatalog(catalogRes.data.items);
      setCheckupHistory(checkupRes.data.results);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not load your privacy tracker.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function addItem(title, description, category) {
    try {
      const res = await api.post('/tracker', { title, description, category });
      setItems((prev) => [res.data.item, ...prev]);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not add this item.');
    }
  }

  async function toggleComplete(item) {
    try {
      const res = await api.patch(`/tracker/${item.id}`, { completed: !item.completed });
      setItems((prev) => prev.map((i) => (i.id === item.id ? res.data.item : i)));
    } catch (err) {
      setError(err.response?.data?.error || 'Could not update this item.');
    }
  }

  async function removeItem(item) {
    try {
      await api.delete(`/tracker/${item.id}`);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (err) {
      setError(err.response?.data?.error || 'Could not delete this item.');
    }
  }

  function handleAddCustom(e) {
    e.preventDefault();
    if (!customTitle.trim()) return;
    addItem(customTitle.trim(), '', customCategory);
    setCustomTitle('');
  }

  const completedCount = items.filter((i) => i.completed).length;
  const progress = items.length === 0 ? 0 : Math.round((completedCount / items.length) * 100);

  const addedTitles = new Set(items.map((i) => i.title));
  const suggestions = catalog.filter((c) => !addedTitles.has(c.title));

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center text-ink-500">Loading your tracker...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <p className="pill mb-3 inline-block border border-alarm text-alarm">Privacy Tracker</p>
      <h1 className="section-heading">Welcome back, {user?.name?.split(' ')[0]}</h1>
      <p className="mt-2 text-ink-500">Track the privacy actions you've taken and watch your progress build.</p>

      {error && (
        <div className="card mt-4 border-l-4 border-l-alarm">
          <p className="text-alarm">{error}</p>
        </div>
      )}

      <div className="card mt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-ink-900">Your progress</h2>
          <span className="font-display text-2xl text-signal">{progress}%</span>
        </div>
        <div className="mt-2 h-3 w-full rounded-full bg-ink-100">
          <div className="h-3 rounded-full bg-signal transition-all" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-2 text-sm text-ink-500">
          {completedCount} of {items.length} actions completed
        </p>
      </div>

      {/* Privacy Checkup history */}
      <div className="card mt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-ink-900">Privacy Checkup history</h2>
          <Link to="/tools/checkup" className="text-xs font-bold uppercase tracking-wide text-signal hover:underline">
            Retake the quiz
          </Link>
        </div>
        {checkupHistory.length === 0 ? (
          <p className="mt-2 text-sm text-ink-500">
            You haven't taken the Privacy Checkup yet. Take it to start tracking your score over time.
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {checkupHistory.map((result, idx) => {
              const prev = checkupHistory[idx + 1];
              const delta = prev ? result.total_score - prev.total_score : null;
              return (
                <div key={result.id} className="flex items-center justify-between border-b border-ink-100 pb-2 last:border-b-0 last:pb-0">
                  <span className="text-sm text-ink-500">
                    {new Date(result.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="font-display text-lg text-ink-900">{result.total_score}/100</span>
                    {delta !== null && delta !== 0 && (
                      <span className={`text-xs font-bold ${delta > 0 ? 'text-signal' : 'text-alarm'}`}>
                        {delta > 0 ? `+${delta}` : delta}
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add custom item */}
      <form onSubmit={handleAddCustom} className="card mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="label">Add a privacy action</label>
          <input
            type="text"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            placeholder='e.g. "Deleted old Twitter account"'
            className="input"
          />
        </div>
        <div>
          <label className="label">Category</label>
          <select value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} className="input">
            <option value="general">General</option>
            <option value="social media">Social Media</option>
            <option value="browser">Browser</option>
            <option value="devices">Devices</option>
            <option value="apps">Apps</option>
            <option value="data brokers">Data Brokers</option>
            <option value="accounts">Accounts</option>
          </select>
        </div>
        <button type="submit" className="btn-primary">
          Add
        </button>
      </form>

      {/* Tracker items */}
      <div className="mt-6 space-y-3">
        {items.length === 0 && (
          <p className="text-sm text-ink-500">
            You haven't added any privacy actions yet. Add one above or pick from the suggestions below.
          </p>
        )}
        {items.map((item) => (
          <div key={item.id} className="card flex items-start gap-4">
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => toggleComplete(item)}
              className="mt-1 h-5 w-5 accent-signal"
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className={`font-bold ${item.completed ? 'text-ink-500 line-through' : 'text-ink-900'}`}>{item.title}</h3>
                <span className="pill border border-ink-200 text-ink-500">{item.category}</span>
              </div>
              {item.description && <p className="mt-1 text-sm text-ink-500">{item.description}</p>}
              {item.completed && item.completed_at && (
                <p className="mt-1 text-xs text-signal">Completed {new Date(item.completed_at).toLocaleDateString()}</p>
              )}
            </div>
            <button onClick={() => removeItem(item)} className="text-xs font-bold uppercase text-ink-500 hover:text-alarm">
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-xl uppercase text-ink-900">Suggested actions</h2>
          <p className="mt-1 text-sm text-ink-500">Add these common privacy wins to your tracker.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {suggestions.map((s) => (
              <div key={s.id} className="card flex flex-col">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-ink-900">{s.title}</h3>
                  <span className="pill border border-ink-200 text-ink-500">{s.category}</span>
                </div>
                <p className="mt-1 flex-1 text-sm text-ink-500">{s.description}</p>
                <button onClick={() => addItem(s.title, s.description, s.category)} className="btn-ghost mt-3 self-start text-xs">
                  + Add to tracker
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
