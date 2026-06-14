import { useState } from 'react';

const articles = [
  {
    id: 'tracking',
    title: 'What is data tracking?',
    summary: 'How companies follow you across the web, apps, and even the physical world.',
    body: [
      'Data tracking is the practice of collecting information about your behavior, such as what you click, where you go, how long you stay, and what you buy, and tying it back to you as an individual or device.',
      'Trackers exist nearly everywhere: on websites (via scripts and pixels), inside mobile apps (via embedded SDKs), in physical stores (via Wi-Fi and Bluetooth beacons), and even on smart TVs and connected devices.',
      'The data collected is often combined across sources to build a detailed profile: your interests, habits, location history, relationships, health conditions, and financial status can all be inferred from seemingly innocuous data points.',
      'This profile is valuable because it can be used to target advertising, set prices, score creditworthiness, or be resold entirely to other companies, often without your meaningful knowledge or consent.',
    ],
  },
  {
    id: 'cookies-fingerprinting',
    title: 'Cookies & fingerprinting',
    summary: 'The technical mechanisms that let sites recognize you across visits and devices.',
    body: [
      'Cookies are small text files a website stores in your browser. First-party cookies (set by the site you are visiting) often handle logins and preferences. Third-party cookies are set by other domains, usually ad and analytics companies, embedded on the page, letting them recognize you across many different sites.',
      'Browser fingerprinting goes further: it combines dozens of seemingly harmless signals (screen resolution, installed fonts, time zone, GPU details, battery status) into a near-unique "fingerprint" that can identify your device even if you block or clear cookies.',
      'Other tracking techniques include tracking pixels (tiny invisible images that report back when an email or page is opened), local storage and "supercookies" that survive normal cookie clearing, and cross-device tracking that links your phone, laptop, and smart TV to the same profile.',
      'Tools like tracker-blocking extensions, privacy-focused browsers, and "Do Not Track" / Global Privacy Control signals can reduce, but rarely eliminate, this kind of tracking.',
    ],
  },
  {
    id: 'data-brokers',
    title: 'Data brokers, explained',
    summary: 'The hidden industry that buys, aggregates, and resells your personal information.',
    body: [
      'Data brokers are companies that collect personal information from public records, online activity, purchase histories, and other data brokers, then package and sell it to advertisers, insurers, employers, and even government agencies.',
      'A single broker may hold thousands of data points per person: demographics, income estimates, health interests, political affiliations, location history, and behavioral predictions like "likely to be pregnant" or "financially vulnerable."',
      'Most people have never interacted with these companies directly, yet have detailed profiles sitting in their databases. In many jurisdictions, you can request access to or deletion of this data, but the process is often manual and must be repeated for each broker.',
      'Some well-known data brokers include Acxiom, Epsilon, Oracle (formerly Datalogix/BlueKai), LiveRamp, and consumer-facing "people search" sites like Spokeo and Whitepages.',
    ],
  },
  {
    id: 'selling-data',
    title: 'How companies sell your data',
    summary: 'The business model behind "free" apps and services.',
    body: [
      'Many "free" apps and websites are funded by advertising, and the most valuable input to targeted advertising is data about you. This creates a strong incentive to collect as much data as possible.',
      'Companies often share data with "partners" through real-time bidding ad exchanges: every time a webpage with an ad loads, your browsing context (and sometimes precise location) can be broadcast to hundreds of potential advertisers in a fraction of a second.',
      'Apps frequently bundle third-party SDKs (software development kits) for analytics, crash reporting, or advertising. Each of these can independently collect and transmit data to its own servers, often beyond what the app developer is even aware of.',
      'Data is also monetized through licensing deals: a retailer might sell aggregated purchase data to consumer goods companies, or a navigation app might sell anonymized, but often re-identifiable, location data to urban planners and hedge funds.',
    ],
  },
];

const glossary = [
  { term: 'Personally Identifiable Information (PII)', definition: 'Any data that can be used to identify a specific individual, such as a name, email address, or government ID number.' },
  { term: 'Third-party cookie', definition: 'A cookie set by a domain other than the one you are visiting, commonly used to track you across multiple sites.' },
  { term: 'Browser fingerprinting', definition: 'A technique that identifies a device using a combination of configuration details, without relying on cookies.' },
  { term: 'Data broker', definition: 'A company that collects and sells personal information about consumers, typically without a direct relationship with those consumers.' },
  { term: 'Opt-out', definition: 'A request to stop a company from collecting, using, or selling your personal data, usually must be initiated by the user.' },
  { term: 'Data minimization', definition: 'The principle of collecting only the data that is strictly necessary for a specific purpose.' },
  { term: 'End-to-end encryption (E2EE)', definition: 'A communication method where only the sender and recipient can read the content; even the service provider cannot access it.' },
  { term: 'GDPR', definition: 'The General Data Protection Regulation: an EU law giving individuals strong rights over their personal data.' },
  { term: 'CCPA/CPRA', definition: 'California privacy laws granting residents rights to know about, delete, and opt out of the sale of their personal information.' },
  { term: 'Targeted advertising', definition: 'Ads selected based on a profile of your interests, behavior, and demographics rather than the content you are currently viewing.' },
  { term: 'Data retention', definition: 'How long a company keeps your data after collection; "indefinite retention" means there is no defined deletion timeline.' },
  { term: 'Anonymization vs. pseudonymization', definition: 'Anonymized data cannot be linked back to an individual; pseudonymized data replaces identifiers with codes but can often still be re-identified.' },
];

const breachExamples = [
  { name: 'Yahoo (2013–2014)', impact: '3 billion accounts', details: 'Names, emails, phone numbers, hashed passwords, and security question answers were stolen in what remains one of the largest breaches ever disclosed.' },
  { name: 'Equifax (2017)', impact: '147 million people', details: 'Social Security numbers, birth dates, addresses, and in some cases driver\'s license numbers were exposed due to an unpatched web application vulnerability.' },
  { name: 'Facebook / Cambridge Analytica (2018)', impact: '87 million users', details: 'A personality quiz app harvested data from users and their friends, which was later used for political ad targeting without consent.' },
  { name: 'Marriott / Starwood (2018)', impact: '500 million guests', details: 'Passport numbers, payment card details, and travel itineraries were exposed after attackers had access to the reservation system for years.' },
  { name: 'T-Mobile (2021)', impact: '76+ million customers', details: 'Social Security numbers, driver\'s license info, and account PINs were stolen in an attack on customer and prospect records.' },
  { name: '23andMe (2023)', impact: '6.9 million users', details: 'Genetic ancestry and relative-matching data was accessed via credential-stuffing attacks against reused passwords, exposing sensitive family data.' },
];

export default function Learn() {
  const [activeArticle, setActiveArticle] = useState(articles[0].id);
  const current = articles.find((a) => a.id === activeArticle);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="pill mb-3 inline-block border border-signal text-signal">Privacy 101</p>
      <h1 className="section-heading">Understand how you're being watched</h1>
      <p className="mt-3 max-w-2xl text-ink-500">
        Start here. These guides break down the systems that profit from your
        personal data, in plain language, no jargon required.
      </p>

      {/* Articles */}
      <section className="mt-10 grid gap-6 lg:grid-cols-[260px_1fr]">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {articles.map((article) => (
            <button
              key={article.id}
              onClick={() => setActiveArticle(article.id)}
              className={`whitespace-nowrap rounded-md border px-4 py-3 text-left text-sm font-bold uppercase tracking-wide transition-colors ${
                activeArticle === article.id
                  ? 'border-signal bg-ink-100 text-signal'
                  : 'border-ink-200 text-ink-500 hover:border-ink-300 hover:text-ink-900'
              }`}
            >
              {article.title}
            </button>
          ))}
        </nav>

        <article className="card">
          <h2 className="font-display text-2xl uppercase text-ink-900">{current.title}</h2>
          <p className="mt-1 text-sm text-ink-500">{current.summary}</p>
          <div className="mt-4 space-y-4 text-ink-700">
            {current.body.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </article>
      </section>

      {/* Glossary */}
      <section className="mt-16">
        <h2 className="section-heading">Glossary of key terms</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {glossary.map((entry) => (
            <div key={entry.term} className="card">
              <h3 className="font-bold text-signal">{entry.term}</h3>
              <p className="mt-1 text-sm text-ink-500">{entry.definition}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Breach examples */}
      <section className="mt-16">
        <h2 className="section-heading">Real-world breach examples</h2>
        <p className="mt-2 max-w-2xl text-ink-500">
          These incidents show how even large, well-resourced companies fail to protect data,
          and why minimizing what you share matters.
        </p>
        <div className="mt-6 overflow-hidden rounded-xl border border-ink-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-ink-100 text-xs uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">People affected</th>
                <th className="px-4 py-3">What happened</th>
              </tr>
            </thead>
            <tbody>
              {breachExamples.map((breach, idx) => (
                <tr key={breach.name} className={idx % 2 === 0 ? 'bg-paper-200' : 'bg-ink-100/60'}>
                  <td className="px-4 py-3 font-bold text-ink-900">{breach.name}</td>
                  <td className="px-4 py-3 font-mono text-alarm">{breach.impact}</td>
                  <td className="px-4 py-3 text-ink-500">{breach.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
