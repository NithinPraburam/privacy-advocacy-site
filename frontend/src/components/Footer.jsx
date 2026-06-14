import { Link } from 'react-router-dom';

const resourceLinks = [
  { label: 'Electronic Frontier Foundation (EFF)', href: 'https://www.eff.org' },
  { label: 'ACLU: Privacy & Technology', href: 'https://www.aclu.org/issues/privacy-technology' },
  { label: 'Privacy Rights Clearinghouse', href: 'https://privacyrights.org' },
  { label: 'Have I Been Pwned', href: 'https://haveibeenpwned.com' },
];

const siteLinks = [
  { label: 'Learn', to: '/learn' },
  { label: 'Tools', to: '/tools' },
  { label: 'Advocacy', to: '/advocacy' },
  { label: 'Privacy Tracker', to: '/tools/tracker' },
];

export default function Footer() {
  return (
    <footer className="border-t border-ink-200 bg-paper-200">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <img src="/shield.svg" alt="" className="h-7 w-7" />
            <span className="font-display text-base uppercase tracking-tight text-ink-900">
              Reclaim<span className="text-signal">Your</span>Data
            </span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-ink-500">
            Independent education and tools to help everyday people understand
            and fight back against surveillance capitalism.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-ink-500">Site</h3>
          <ul className="space-y-2 text-sm">
            {siteLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-ink-700 hover:text-signal">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-ink-500">Privacy resources</h3>
          <ul className="space-y-2 text-sm">
            {resourceLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noreferrer" className="text-ink-700 hover:text-alarm">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-200 px-4 py-6 text-center text-xs text-ink-500 sm:px-6">
        © {new Date().getFullYear()} ReclaimYourData. Built for the cause, not for profit.
      </div>
    </footer>
  );
}
