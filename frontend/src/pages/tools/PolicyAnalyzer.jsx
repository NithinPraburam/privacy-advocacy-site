import { useState } from 'react';

// Keyword-based red flag rules. Each rule has a regex, a severity weight, and a plain-English explanation.
const rules = [
  {
    id: 'sells-data',
    label: 'Sells your data',
    weight: 25,
    pattern: /\b(sell|sale|sold)s?\b.{0,40}\b(personal (information|data)|your data|user data)\b|\b(personal (information|data))\b.{0,40}\b(sell|sale|sold)s?\b/i,
    explanation: 'The policy mentions selling personal information or user data to third parties.',
  },
  {
    id: 'third-party-sharing',
    label: 'Broad third-party sharing',
    weight: 15,
    pattern: /\b(third[\s-]?part(y|ies)|business partners|affiliates)\b.{0,60}\b(share|shared|sharing|disclose|provide|transfer)\b/i,
    explanation: 'Personal data may be shared or disclosed with third parties, partners, or affiliates.',
  },
  {
    id: 'indefinite-retention',
    label: 'Indefinite data retention',
    weight: 15,
    pattern: /\b(indefinite(ly)?|as long as (necessary|needed)|no longer (necessary|needed)|retain.{0,40}(necessary|required by law))\b/i,
    explanation: 'Data may be retained indefinitely or for a vague, undefined period.',
  },
  {
    id: 'advertising-tracking',
    label: 'Advertising / cross-site tracking',
    weight: 10,
    pattern: /\b(targeted advertising|interest-based ads?|ad(s)? personalization|tracking pixels?|cross-(site|device) tracking|advertising partners)\b/i,
    explanation: 'Your data may be used for targeted advertising or cross-site/device tracking.',
  },
  {
    id: 'location-tracking',
    label: 'Precise location collection',
    weight: 10,
    pattern: /\b(precise location|gps|geolocation)\b/i,
    explanation: 'The policy mentions collecting your precise location (e.g. GPS).',
  },
  {
    id: 'sensitive-data',
    label: 'Sensitive data collection',
    weight: 10,
    pattern: /\b(biometric|health (data|information)|genetic|racial|ethnic origin|sexual orientation|religious belief)\b/i,
    explanation: 'The policy refers to collecting sensitive categories of data (health, biometric, etc.).',
  },
  {
    id: 'policy-changes',
    label: 'Unilateral policy changes',
    weight: 5,
    pattern: /\b(change|update|modify|revise)[\w\s]{0,30}\b(this (privacy )?policy|these terms)\b.{0,60}\b(at any time|without notice|sole discretion)\b/i,
    explanation: 'The company can change this policy at any time, sometimes without direct notice.',
  },
  {
    id: 'no-opt-out',
    label: 'Limited opt-out options',
    weight: 5,
    pattern: /\b(cannot opt out|no opt-out|unable to opt out|not (able|possible) to opt.?out)\b/i,
    explanation: 'The policy suggests limited or no ability to opt out of certain data uses.',
  },
  {
    id: 'data-brokers',
    label: 'Data broker involvement',
    weight: 5,
    pattern: /\b(data broker|data aggregator)\b/i,
    explanation: 'The policy references data brokers or aggregators.',
  },
];

const goodSigns = [
  {
    id: 'no-sale',
    label: 'States data is not sold',
    pattern: /\b(do not|does not|never)\b.{0,30}\bsell\b.{0,40}\b(personal (information|data)|your data)\b/i,
  },
  {
    id: 'encryption',
    label: 'Mentions encryption',
    pattern: /\bencrypt(ed|ion)?\b/i,
  },
  {
    id: 'deletion-rights',
    label: 'Describes data deletion rights',
    pattern: /\b(delete|erase|removal)\b.{0,40}\b(your (data|account|information)|personal (data|information))\b/i,
  },
  {
    id: 'minimal-retention',
    label: 'Defines a specific retention period',
    pattern: /\bretain(ed|s)?\b.{0,40}\b(\d+\s?(day|month|year)s?)\b/i,
  },
];

function getRiskRating(score) {
  if (score >= 50) return { label: 'High Risk', color: 'text-alarm', border: 'border-alarm' };
  if (score >= 25) return { label: 'Moderate Risk', color: 'text-amber-600', border: 'border-amber-500' };
  if (score > 0) return { label: 'Low Risk', color: 'text-signal', border: 'border-signal' };
  return { label: 'Minimal Concerns Found', color: 'text-signal', border: 'border-signal' };
}

export default function PolicyAnalyzer() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);

  function getExcerpt(pattern, source) {
    const match = source.match(pattern);
    if (!match) return null;
    const start = Math.max(0, match.index - 60);
    const end = Math.min(source.length, match.index + match[0].length + 60);
    const prefix = start > 0 ? '...' : '';
    const suffix = end < source.length ? '...' : '';
    return `${prefix}${source.slice(start, end).trim().replace(/\s+/g, ' ')}${suffix}`;
  }

  function analyze() {
    if (!text.trim()) {
      setResult(null);
      return;
    }

    const flags = rules
      .filter((rule) => rule.pattern.test(text))
      .map((rule) => ({ ...rule, excerpt: getExcerpt(rule.pattern, text) }));
    const positives = goodSigns.filter((sign) => sign.pattern.test(text));
    const score = Math.min(100, flags.reduce((sum, f) => sum + f.weight, 0));

    setResult({ flags, positives, score, wordCount: text.trim().split(/\s+/).length });
  }

  function reset() {
    setText('');
    setResult(null);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <p className="pill mb-3 inline-block border border-alarm text-alarm">Policy Analyzer</p>
      <h1 className="section-heading">Decode the fine print</h1>
      <p className="mt-2 max-w-2xl text-ink-500">
        Paste a privacy policy below. We'll scan it for common red flags, like data
        selling, broad third-party sharing, and indefinite retention, and give you a
        plain-English summary and risk rating. Everything runs in your browser; no text
        is sent anywhere.
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste the full text of a privacy policy here..."
        className="input mt-6 h-64 resize-y font-mono text-xs"
      />

      <div className="mt-4 flex gap-3">
        <button onClick={analyze} className="btn-primary" disabled={!text.trim()}>
          Analyze policy
        </button>
        <button onClick={reset} className="btn-ghost">
          Clear
        </button>
      </div>

      {result && (
        <div className="mt-10">
          <div className={`card border-2 ${getRiskRating(result.score).border}`}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-500">Risk rating</p>
                <p className={`font-display text-3xl ${getRiskRating(result.score).color}`}>
                  {getRiskRating(result.score).label}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-ink-500">Risk score</p>
                <p className="font-display text-3xl text-ink-900">{result.score}/100</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-ink-500">
              Analyzed {result.wordCount.toLocaleString()} words. {result.flags.length} red flag
              {result.flags.length === 1 ? '' : 's'} found, {result.positives.length} positive
              signal{result.positives.length === 1 ? '' : 's'} detected.
            </p>
          </div>

          {result.flags.length > 0 && (
            <div className="mt-6">
              <h2 className="font-display text-xl uppercase text-alarm">Red flags</h2>
              <div className="mt-3 space-y-3">
                {result.flags.map((flag) => (
                  <div key={flag.id} className="card border-l-4 border-l-alarm">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-ink-900">{flag.label}</h3>
                      <span className="pill bg-alarm-light text-alarm">+{flag.weight}</span>
                    </div>
                    <p className="mt-1 text-sm text-ink-500">{flag.explanation}</p>
                    {flag.excerpt && (
                      <p className="mt-2 rounded-md bg-paper-200 p-2 text-xs italic text-ink-700">
                        "{flag.excerpt}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.positives.length > 0 && (
            <div className="mt-6">
              <h2 className="font-display text-xl uppercase text-signal">Positive signals</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {result.positives.map((sign) => (
                  <div key={sign.id} className="card border-l-4 border-l-signal">
                    <h3 className="font-bold text-ink-900">{sign.label}</h3>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.flags.length === 0 && (
            <p className="mt-6 text-sm text-ink-500">
              No common red-flag patterns were detected. This is a good sign, but a
              keyword scan can't catch everything. When in doubt, read the full policy
              or look for an independent review.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
