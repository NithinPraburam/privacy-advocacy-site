require('dotenv').config();
const pool = require('../db');

const trackerCatalog = [
  {
    title: 'Enable two-factor authentication on your email',
    description: 'Add an authenticator app or hardware key as a second factor for your primary email account.',
    category: 'accounts',
  },
  {
    title: 'Review and limit Facebook ad preferences',
    description: 'Turn off ad personalization based on your activity from partners and Facebook.',
    category: 'social media',
  },
  {
    title: 'Opt out of Google ad personalization',
    description: 'Disable ad personalization in your Google Account activity controls.',
    category: 'apps',
  },
  {
    title: 'Delete old or unused social media accounts',
    description: 'Deactivate or permanently delete accounts you no longer use to shrink your data footprint.',
    category: 'social media',
  },
  {
    title: 'Switch to a privacy-respecting browser',
    description: 'Move to a browser like Firefox or Brave and enable strict tracking protection.',
    category: 'browser',
  },
  {
    title: 'Install a tracker/ad blocker extension',
    description: 'Use an extension such as uBlock Origin to block third-party trackers and ads.',
    category: 'browser',
  },
  {
    title: 'Review app permissions on your phone',
    description: 'Audit location, microphone, camera, and contacts permissions for each installed app.',
    category: 'devices',
  },
  {
    title: 'Enable a passcode and encryption on your devices',
    description: 'Make sure your phone and laptop require a passcode and use full-disk encryption.',
    category: 'devices',
  },
  {
    title: 'Request data deletion from a data broker',
    description: 'Submit an opt-out / deletion request to a major data broker such as Acxiom or Spokeo.',
    category: 'data brokers',
  },
  {
    title: 'Use a password manager with unique passwords',
    description: 'Generate and store unique, strong passwords for every account using a password manager.',
    category: 'accounts',
  },
  {
    title: 'Turn on a VPN for public Wi-Fi',
    description: 'Use a reputable VPN whenever connecting to public or untrusted networks.',
    category: 'devices',
  },
  {
    title: 'Review third-party app access to your Google/Microsoft account',
    description: 'Remove apps and services you no longer use from your connected apps list.',
    category: 'apps',
  },
];

const demoBreaches = [
  {
    email: 'demo@example.com',
    name: 'Adobe',
    domain: 'adobe.com',
    breach_date: '2013-10-04',
    pwn_count: 152445165,
    data_classes: ['Email addresses', 'Password hints', 'Passwords', 'Usernames'],
    description: 'In October 2013, 153 million Adobe accounts were breached, each containing an internal ID, username, email, encrypted password and a password hint in plain text.',
  },
  {
    email: 'demo@example.com',
    name: 'LinkedIn',
    domain: 'linkedin.com',
    breach_date: '2012-05-05',
    pwn_count: 164611595,
    data_classes: ['Email addresses', 'Passwords'],
    description: 'In May 2012, LinkedIn suffered a data breach resulting in the exposure of 164 million email addresses and passwords.',
  },
  {
    email: 'test@test.com',
    name: 'Canva',
    domain: 'canva.com',
    breach_date: '2019-05-24',
    pwn_count: 137272116,
    data_classes: ['Email addresses', 'Geographic locations', 'Names', 'Passwords', 'Usernames'],
    description: 'In May 2019, the graphic design tool Canva suffered a data breach that exposed 137 million customer records.',
  },
];

async function seed() {
  for (const item of trackerCatalog) {
    await pool.query(
      `INSERT INTO tracker_catalog (title, description, category)
       SELECT $1::varchar, $2, $3
       WHERE NOT EXISTS (SELECT 1 FROM tracker_catalog WHERE title = $1::varchar)`,
      [item.title, item.description, item.category]
    );
  }

  for (const breach of demoBreaches) {
    await pool.query(
      `INSERT INTO demo_breaches (email, name, domain, breach_date, pwn_count, data_classes, description)
       SELECT $1::varchar, $2::varchar, $3, $4, $5, $6, $7
       WHERE NOT EXISTS (
         SELECT 1 FROM demo_breaches WHERE email = $1::varchar AND name = $2::varchar
       )`,
      [
        breach.email,
        breach.name,
        breach.domain,
        breach.breach_date,
        breach.pwn_count,
        breach.data_classes,
        breach.description,
      ]
    );
  }

  console.log(`Seeded ${trackerCatalog.length} tracker catalog items and ${demoBreaches.length} demo breach records.`);
  await pool.end();
}

seed().catch((err) => {
  console.error('Failed to seed database:', err);
  process.exit(1);
});
