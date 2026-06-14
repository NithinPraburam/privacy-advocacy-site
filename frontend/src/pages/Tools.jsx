import { Link } from 'react-router-dom';

const tools = [
  {
    title: 'Privacy Checkup',
    description: 'A short quiz that scores your digital privacy from 0–100 across social media, browser, devices, and apps, with personalized recommendations.',
    to: '/tools/checkup',
    cta: 'Take the quiz',
  },
  {
    title: 'Privacy Policy Analyzer',
    description: 'Paste any privacy policy and get an instant plain-English summary with a risk rating and flagged red flags.',
    to: '/tools/policy-analyzer',
    cta: 'Analyze a policy',
  },
  {
    title: 'Data Breach Checker',
    description: "Check whether your email address has appeared in a known data breach, powered by Have I Been Pwned.",
    to: '/tools/breach-checker',
    cta: 'Check my email',
  },
  {
    title: 'Privacy Tracker',
    description: 'Log the privacy actions you take, mark them complete, and watch your progress build over time. Requires a free account.',
    to: '/tools/tracker',
    cta: 'Open my tracker',
  },
];

export default function Tools() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="pill mb-3 inline-block border border-alarm text-alarm">Tools</p>
      <h1 className="section-heading">Take action, not just notes</h1>
      <p className="mt-3 max-w-2xl text-ink-500">
        Four free tools to help you understand and improve your privacy posture,
        no account needed except for the tracker.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {tools.map((tool) => (
          <div key={tool.to} className="card flex flex-col">
            <h2 className="font-display text-2xl uppercase text-ink-900">{tool.title}</h2>
            <p className="mt-2 flex-1 text-sm text-ink-500">{tool.description}</p>
            <Link to={tool.to} className="btn-primary mt-6 self-start">
              {tool.cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
