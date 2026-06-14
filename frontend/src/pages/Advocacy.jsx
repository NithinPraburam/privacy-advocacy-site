import { useEffect, useState } from 'react';
import api from '../api';

const wallOfShame = [
  {
    company: 'Meta (Facebook/Instagram)',
    issue: 'Cambridge Analytica scandal, repeated FTC fines for privacy violations, and pervasive cross-app tracking via the Meta Pixel.',
    fine: '$5B FTC fine (2019)',
  },
  {
    company: 'Clearview AI',
    issue: 'Scraped billions of photos from social media without consent to build a facial recognition database sold to law enforcement.',
    fine: 'Banned from selling to most US companies (2022 settlement)',
  },
  {
    company: 'Equifax',
    issue: 'Failed to patch a known vulnerability, exposing the Social Security numbers and personal data of 147 million people.',
    fine: '$575M settlement (2019)',
  },
  {
    company: 'Google',
    issue: 'Tracked users\' location even after they disabled "Location History," and ran covert tracking in "Incognito" mode.',
    fine: '$391.5M multistate settlement (2022)',
  },
  {
    company: 'T-Mobile',
    issue: 'Suffered multiple major breaches exposing customer SSNs, IDs, and account PINs due to weak security practices.',
    fine: '$350M settlement (2022)',
  },
  {
    company: 'Amazon (Ring)',
    issue: 'Employees and contractors had broad, unsupervised access to customer camera feeds for years.',
    fine: '$5.8M FTC settlement (2023)',
  },
];

const representatives = [
  {
    title: 'Find your U.S. Senators',
    description: 'Look up and contact your Senators about federal privacy legislation.',
    href: 'https://www.senate.gov/senators/senators-contact.htm',
  },
  {
    title: 'Find your U.S. House Representative',
    description: 'Look up and contact your Representative about federal privacy legislation.',
    href: 'https://www.house.gov/representatives/find-your-representative',
  },
  {
    title: 'EFF Action Center',
    description: 'Take action on current digital rights campaigns organized by the EFF.',
    href: 'https://act.eff.org',
  },
  {
    title: 'ACLU Action Center',
    description: 'Sign petitions and contact lawmakers on privacy and civil liberties issues.',
    href: 'https://action.aclu.org',
  },
];

const sampleAsk = `Subject: Please support stronger federal data privacy legislation

Dear [Representative's name],

I'm a constituent writing to urge you to support comprehensive federal data privacy
legislation, such as the American Data Privacy and Protection Act (or its successor).

Specifically, I'd like to see:
- A federal right to access, correct, and delete personal data held by companies
- Restrictions on third-party data sales and sharing without explicit consent
- Meaningful enforcement, including a private right of action
- Limits on data retention and stronger security requirements for sensitive data

Thank you for representing our interests on this issue.

Sincerely,
[Your name]
[Your city, state]`;

export default function Advocacy() {
  const [news, setNews] = useState([]);
  const [newsError, setNewsError] = useState('');
  const [newsLoading, setNewsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api
      .get('/news')
      .then((res) => setNews(res.data.items))
      .catch(() => setNewsError('Could not load the latest privacy news right now.'))
      .finally(() => setNewsLoading(false));
  }, []);

  function copyTemplate() {
    navigator.clipboard?.writeText(sampleAsk).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="pill mb-3 inline-block border border-alarm text-alarm">Advocacy</p>
      <h1 className="section-heading">Privacy is a collective fight</h1>
      <p className="mt-3 max-w-2xl text-ink-500">
        Stay informed, know who's profiting from surveillance, and push for stronger
        legal protections.
      </p>

      {/* News feed */}
      <section className="mt-12">
        <h2 className="font-display text-2xl uppercase text-ink-900">Latest privacy news</h2>
        <p className="mt-1 text-sm text-ink-500">Live feed from the Electronic Frontier Foundation.</p>
        <div className="mt-4 space-y-4">
          {newsLoading && <p className="text-ink-500">Loading news...</p>}
          {newsError && <p className="text-alarm">{newsError}</p>}
          {!newsLoading && !newsError && news.length === 0 && (
            <p className="text-ink-500">No news items available right now.</p>
          )}
          {news.map((item) => (
            <a key={item.link} href={item.link} target="_blank" rel="noreferrer" className="card block transition-colors hover:border-signal">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-bold text-ink-900">{item.title}</h3>
                {item.publishedAt && (
                  <span className="text-xs text-ink-500">{new Date(item.publishedAt).toLocaleDateString()}</span>
                )}
              </div>
              {item.summary && <p className="mt-2 text-sm text-ink-500">{item.summary}</p>}
            </a>
          ))}
        </div>
      </section>

      {/* Wall of shame */}
      <section className="mt-16">
        <h2 className="font-display text-2xl uppercase text-alarm">Wall of Shame</h2>
        <p className="mt-1 text-sm text-ink-500">
          Companies with documented histories of privacy violations and data misuse.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wallOfShame.map((entry) => (
            <div key={entry.company} className="card border-l-4 border-l-alarm">
              <h3 className="font-display text-lg uppercase text-ink-900">{entry.company}</h3>
              <p className="mt-2 text-sm text-ink-500">{entry.issue}</p>
              <p className="mt-3 text-xs font-bold uppercase tracking-wide text-alarm">{entry.fine}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-ink-500">
          Sources: public FTC settlements, court filings, and reporting. Listed for
          educational/advocacy purposes.
        </p>
      </section>

      {/* Contact representatives */}
      <section className="mt-16">
        <h2 className="font-display text-2xl uppercase text-signal">Contact your representatives</h2>
        <p className="mt-1 max-w-2xl text-sm text-ink-500">
          Federal privacy legislation moves when lawmakers hear from constituents.
          Use the links below to find your representatives, and feel free to copy the
          message template to get started.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {representatives.map((rep) => (
            <a key={rep.href} href={rep.href} target="_blank" rel="noreferrer" className="card transition-colors hover:border-signal">
              <h3 className="font-bold text-ink-900">{rep.title}</h3>
              <p className="mt-1 text-sm text-ink-500">{rep.description}</p>
            </a>
          ))}
        </div>

        <div className="card mt-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-ink-900">Sample message template</h3>
            <button onClick={copyTemplate} className="btn-ghost text-xs">
              {copied ? 'Copied!' : 'Copy text'}
            </button>
          </div>
          <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap rounded-md bg-paper-200 p-4 text-xs text-ink-700">
            {sampleAsk}
          </pre>
        </div>
      </section>
    </div>
  );
}
