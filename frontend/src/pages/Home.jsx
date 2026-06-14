import { Link } from 'react-router-dom';

const stats = [
  { value: '3.2B+', label: 'records exposed in major breaches in 2024' },
  { value: '5,000+', label: 'data points the average broker holds on you' },
  { value: '$200B', label: 'annual revenue of the global data broker industry' },
  { value: '90%', label: 'of websites use third-party tracking cookies' },
];

const quickLinks = [
  {
    title: 'Privacy Checkup',
    description: 'Score your digital privacy across social media, browser, devices and apps.',
    to: '/tools/checkup',
    borderClass: 'hover:border-signal',
    linkClass: 'text-signal',
  },
  {
    title: 'Policy Analyzer',
    description: 'Paste a privacy policy and get an instant risk rating and plain-English summary.',
    to: '/tools/policy-analyzer',
    borderClass: 'hover:border-alarm',
    linkClass: 'text-alarm',
  },
  {
    title: 'Breach Checker',
    description: 'Find out if your email has been exposed in a known data breach.',
    to: '/tools/breach-checker',
    borderClass: 'hover:border-signal',
    linkClass: 'text-signal',
  },
  {
    title: 'Privacy Tracker',
    description: 'Log the privacy actions you take and watch your score improve over time.',
    to: '/tools/tracker',
    borderClass: 'hover:border-alarm',
    linkClass: 'text-alarm',
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink-200">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="pill mb-4 inline-block border border-alarm text-alarm">
            Your data. Your fight.
          </p>
          <h1 className="font-display text-4xl leading-tight text-ink-900 sm:text-6xl">
            Surveillance is the
            <span className="block text-signal">business model.</span>
            <span className="block text-alarm">Take it back.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-700">
            ReclaimYourData is an independent, cause-driven platform that helps you
            understand how your personal information is tracked, bought, and sold —
            and gives you free tools to fight back.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/tools" className="btn-primary">
              Explore the tools
            </Link>
            <Link to="/learn" className="btn-secondary">
              Learn how tracking works
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-ink-200 bg-paper-200">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
          <h2 className="section-heading">The numbers don't lie</h2>
          <div className="mx-auto mt-12 grid grid-cols-1 divide-y divide-ink-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="px-6 py-6 sm:py-2">
                <div className="font-display text-4xl text-signal sm:text-5xl">{stat.value}</div>
                <p className="mx-auto mt-3 max-w-[14rem] text-sm leading-snug text-ink-500">{stat.label}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-10 max-w-2xl text-xs text-ink-500">
            Figures are illustrative estimates compiled from public breach trackers and
            industry reporting, intended to illustrate the scale of the privacy problem.
          </p>
        </div>
      </section>

      {/* Quick links */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="section-heading">Tools built to fight back</h2>
        <p className="mt-2 max-w-2xl text-ink-500">
          Free, no-corporate-strings-attached tools to help you audit, understand,
          and improve your privacy posture.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {quickLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`card transition-transform hover:-translate-y-1 ${link.borderClass}`}
            >
              <h3 className="font-display text-xl uppercase text-ink-900">{link.title}</h3>
              <p className="mt-2 text-sm text-ink-500">{link.description}</p>
              <span className={`mt-4 inline-block text-sm font-bold uppercase tracking-wide ${link.linkClass}`}>
                Open tool →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="border-t border-ink-200 bg-gradient-to-r from-paper-200 via-paper to-paper-200">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
          <h2 className="font-display text-3xl text-ink-900 sm:text-4xl">
            Privacy isn't a setting. <span className="text-signal">It's a right.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-ink-500">
            Create a free account to track your progress as you lock down your
            digital life — and join the fight for stronger privacy laws.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/signup" className="btn-primary">
              Create your account
            </Link>
            <Link to="/advocacy" className="btn-ghost">
              Take action
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
