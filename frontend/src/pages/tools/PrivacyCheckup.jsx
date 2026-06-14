import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';

// Each category has a max of 25 points, for a total possible score of 100.
const categories = [
  {
    key: 'socialMedia',
    title: 'Social Media',
    questions: [
      {
        prompt: 'Are your social media profiles set to private / friends-only?',
        options: [
          { label: 'Yes, all of them', points: 9 },
          { label: 'Some of them', points: 5 },
          { label: 'No, mostly public', points: 0 },
        ],
      },
      {
        prompt: 'Have you reviewed and limited ad personalization settings (e.g. Facebook ad preferences)?',
        options: [
          { label: 'Yes, recently', points: 8 },
          { label: 'A while ago', points: 4 },
          { label: 'Never', points: 0 },
        ],
      },
      {
        prompt: 'Do you limit how much personal info (location, birthday, employer) you share on social profiles?',
        options: [
          { label: 'I share very little', points: 8 },
          { label: 'I share some details', points: 4 },
          { label: 'My profile is an open book', points: 0 },
        ],
      },
    ],
  },
  {
    key: 'browser',
    title: 'Browser',
    questions: [
      {
        prompt: 'Do you use a privacy-focused browser or strict tracking protection?',
        options: [
          { label: 'Yes', points: 9 },
          { label: 'Somewhat (default settings)', points: 4 },
          { label: 'No / not sure', points: 0 },
        ],
      },
      {
        prompt: 'Do you use a tracker or ad blocker extension?',
        options: [
          { label: 'Yes, always', points: 8 },
          { label: 'Sometimes', points: 4 },
          { label: 'No', points: 0 },
        ],
      },
      {
        prompt: 'How often do you clear cookies / browsing data?',
        options: [
          { label: 'Regularly or automatically', points: 8 },
          { label: 'Occasionally', points: 4 },
          { label: 'Never', points: 0 },
        ],
      },
    ],
  },
  {
    key: 'devices',
    title: 'Devices',
    questions: [
      {
        prompt: 'Do your phone and laptop require a passcode/password and use encryption?',
        options: [
          { label: 'Yes, both', points: 9 },
          { label: 'Only one device', points: 4 },
          { label: 'Neither', points: 0 },
        ],
      },
      {
        prompt: 'Have you reviewed app permissions (location, mic, camera, contacts) on your devices?',
        options: [
          { label: 'Yes, recently', points: 8 },
          { label: 'A long time ago', points: 4 },
          { label: 'Never', points: 0 },
        ],
      },
      {
        prompt: 'Do you use a VPN on public or untrusted Wi-Fi?',
        options: [
          { label: 'Always', points: 8 },
          { label: 'Sometimes', points: 4 },
          { label: 'Never', points: 0 },
        ],
      },
    ],
  },
  {
    key: 'apps',
    title: 'Apps & Accounts',
    questions: [
      {
        prompt: 'Do you use unique, strong passwords (e.g. via a password manager)?',
        options: [
          { label: 'Yes, for everything', points: 9 },
          { label: 'For some accounts', points: 4 },
          { label: 'I reuse passwords', points: 0 },
        ],
      },
      {
        prompt: 'Is two-factor authentication (2FA) enabled on your important accounts (email, bank)?',
        options: [
          { label: 'Yes, everywhere important', points: 8 },
          { label: 'On a few accounts', points: 4 },
          { label: 'No', points: 0 },
        ],
      },
      {
        prompt: 'Do you periodically remove unused apps and revoke third-party app access?',
        options: [
          { label: 'Yes, regularly', points: 8 },
          { label: 'Rarely', points: 4 },
          { label: 'Never', points: 0 },
        ],
      },
    ],
  },
];

const recommendations = {
  socialMedia: [
    'Set all social media profiles to private or friends-only.',
    'Turn off ad personalization in your social media account settings.',
    'Remove sensitive details (birthday, employer, location) from public profile fields.',
  ],
  browser: [
    'Switch to a privacy-respecting browser (e.g. Firefox with strict protection, or Brave).',
    'Install a tracker/ad blocker extension such as uBlock Origin.',
    'Set your browser to clear cookies automatically when it closes.',
  ],
  devices: [
    'Enable a passcode and full-disk encryption on all your devices.',
    'Audit app permissions and revoke access to location, mic, and camera where unnecessary.',
    'Use a reputable VPN when connecting to public Wi-Fi.',
  ],
  apps: [
    'Adopt a password manager and generate unique passwords for every account.',
    'Enable two-factor authentication on your email, bank, and other critical accounts.',
    'Review connected third-party apps and remove ones you no longer use.',
  ],
};

function getRating(score) {
  if (score >= 85) return { label: 'Excellent', color: 'text-signal' };
  if (score >= 65) return { label: 'Good', color: 'text-signal' };
  if (score >= 40) return { label: 'At Risk', color: 'text-amber-600' };
  return { label: 'Exposed', color: 'text-alarm' };
}

export default function PrivacyCheckup() {
  const { user } = useAuth();
  const [saveStatus, setSaveStatus] = useState('idle');

  const allQuestions = useMemo(
    () => categories.flatMap((cat) => cat.questions.map((q) => ({ ...q, categoryKey: cat.key, categoryTitle: cat.title }))),
    []
  );

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);

  const total = allQuestions.length;
  const current = allQuestions[step];

  function selectAnswer(points) {
    setAnswers((prev) => ({ ...prev, [step]: points }));
  }

  function next() {
    if (step < total - 1) {
      setStep(step + 1);
    } else {
      setFinished(true);
    }
  }

  function prev() {
    if (step > 0) setStep(step - 1);
  }

  function restart() {
    setStep(0);
    setAnswers({});
    setFinished(false);
    setSaveStatus('idle');
  }

  const categoryScores = useMemo(() => {
    const scores = {};
    categories.forEach((cat) => {
      scores[cat.key] = 0;
    });
    allQuestions.forEach((q, idx) => {
      if (answers[idx] !== undefined) {
        scores[q.categoryKey] += answers[idx];
      }
    });
    return scores;
  }, [answers, allQuestions]);

  const totalScore = Object.values(categoryScores).reduce((sum, val) => sum + val, 0);

  useEffect(() => {
    if (!finished || !user) return;
    setSaveStatus('saving');
    api
      .post('/checkup', { totalScore, categoryScores })
      .then(() => setSaveStatus('saved'))
      .catch(() => setSaveStatus('error'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished, user]);

  if (finished) {
    const rating = getRating(totalScore);
    const weakestCategories = categories
      .map((cat) => ({ ...cat, score: categoryScores[cat.key] }))
      .sort((a, b) => a.score - b.score)
      .slice(0, 2);

    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p className="pill mb-3 inline-block border border-signal text-signal">Privacy Checkup</p>
        <h1 className="section-heading">Your results</h1>

        <div className="card mt-6 text-center">
          <div className="font-display text-6xl text-ink-900">{totalScore}<span className="text-2xl text-ink-500">/100</span></div>
          <div className={`mt-2 text-xl font-bold uppercase tracking-wide ${rating.color}`}>{rating.label}</div>
          {user ? (
            <p className="mt-3 text-xs text-ink-500">
              {saveStatus === 'saving' && 'Saving your result...'}
              {saveStatus === 'saved' && (
                <>
                  Saved to your{' '}
                  <Link to="/tools/tracker" className="text-signal underline">
                    Privacy Tracker
                  </Link>
                  .
                </>
              )}
              {saveStatus === 'error' && 'Could not save this result — please try again later.'}
            </p>
          ) : (
            <p className="mt-3 text-xs text-ink-500">
              <Link to="/signup" className="text-signal underline">
                Create a free account
              </Link>{' '}
              to save your results and track your progress over time.
            </p>
          )}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {categories.map((cat) => (
            <div key={cat.key} className="card">
              <h3 className="font-bold text-ink-900">{cat.title}</h3>
              <div className="mt-2 h-2 w-full rounded-full bg-ink-100">
                <div
                  className="h-2 rounded-full bg-signal"
                  style={{ width: `${(categoryScores[cat.key] / 25) * 100}%` }}
                />
              </div>
              <p className="mt-1 text-sm text-ink-500">{categoryScores[cat.key]} / 25</p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <h2 className="section-heading text-2xl">Recommended next steps</h2>
          <p className="mt-2 text-ink-500">
            Based on your weakest areas — {weakestCategories.map((c) => c.title).join(' and ')} — start here:
          </p>
          <div className="mt-4 space-y-4">
            {weakestCategories.map((cat) => (
              <div key={cat.key} className="card">
                <h3 className="font-bold text-alarm">{cat.title}</h3>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-ink-700">
                  {recommendations[cat.key].map((rec) => (
                    <li key={rec}>{rec}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <button onClick={restart} className="btn-secondary mt-10">
          Retake the quiz
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <p className="pill mb-3 inline-block border border-signal text-signal">Privacy Checkup</p>
      <h1 className="section-heading">How exposed are you?</h1>
      <p className="mt-2 text-ink-500">Answer honestly — there's no judgment, only better defaults.</p>

      <div className="mt-6 h-2 w-full rounded-full bg-ink-100">
        <div className="h-2 rounded-full bg-signal transition-all" style={{ width: `${((step + 1) / total) * 100}%` }} />
      </div>
      <p className="mt-2 text-xs uppercase tracking-wide text-ink-500">
        Question {step + 1} of {total} — {current.categoryTitle}
      </p>

      <div className="card mt-6">
        <h2 className="text-lg font-bold text-ink-900">{current.prompt}</h2>
        <div className="mt-4 flex flex-col gap-3">
          {current.options.map((opt) => (
            <button
              key={opt.label}
              onClick={() => selectAnswer(opt.points)}
              className={`rounded-md border px-4 py-3 text-left text-sm font-semibold transition-colors ${
                answers[step] === opt.points
                  ? 'border-signal bg-ink-100 text-signal'
                  : 'border-ink-200 text-ink-700 hover:border-ink-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button onClick={prev} disabled={step === 0} className="btn-ghost disabled:cursor-not-allowed disabled:opacity-40">
          Back
        </button>
        <button onClick={next} disabled={answers[step] === undefined} className="btn-primary disabled:cursor-not-allowed disabled:opacity-40">
          {step === total - 1 ? 'See results' : 'Next'}
        </button>
      </div>
    </div>
  );
}
