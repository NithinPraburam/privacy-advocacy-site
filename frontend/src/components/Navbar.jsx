import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/learn', label: 'Learn' },
  { to: '/tools', label: 'Tools' },
  { to: '/advocacy', label: 'Advocacy' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    setOpen(false);
    navigate('/');
  }

  const linkClass = ({ isActive }) =>
    `text-sm font-bold uppercase tracking-wide transition-colors ${
      isActive ? 'text-signal' : 'text-ink-700 hover:text-ink-900'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-ink-200 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <img src="/shield.svg" alt="" className="h-8 w-8" />
          <span className="font-display text-lg uppercase tracking-tight text-ink-900">
            Reclaim<span className="text-signal">Your</span>Data
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass} end={link.to === '/'}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link to="/tools/tracker" className="text-sm font-bold uppercase tracking-wide text-ink-700 hover:text-ink-900">
                Hi, {user.name.split(' ')[0]}
              </Link>
              <button onClick={handleLogout} className="btn-secondary px-4 py-2 text-xs">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost px-4 py-2 text-xs">
                Log in
              </Link>
              <Link to="/signup" className="btn-primary px-4 py-2 text-xs">
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-md border border-ink-200 text-ink-900 md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          <span className="text-2xl leading-none">{open ? '×' : '☰'}</span>
        </button>
      </div>

      {open && (
        <nav className="border-t border-ink-200 bg-paper px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass} end={link.to === '/'} onClick={() => setOpen(false)}>
                {link.label}
              </NavLink>
            ))}
            <hr className="border-ink-200" />
            {user ? (
              <>
                <Link to="/tools/tracker" className="text-sm font-bold uppercase tracking-wide text-ink-700" onClick={() => setOpen(false)}>
                  My Tracker
                </Link>
                <button onClick={handleLogout} className="btn-secondary w-full">
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost w-full" onClick={() => setOpen(false)}>
                  Log in
                </Link>
                <Link to="/signup" className="btn-primary w-full" onClick={() => setOpen(false)}>
                  Sign up
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
