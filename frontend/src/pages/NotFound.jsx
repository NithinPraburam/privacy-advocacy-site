import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <h1 className="font-display text-6xl text-alarm">404</h1>
      <p className="mt-4 text-lg text-ink-700">
        This page has been deleted — unlike your data, which companies keep forever.
      </p>
      <Link to="/" className="btn-primary mt-6">
        Back to safety
      </Link>
    </div>
  );
}
