
import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Menu,
  X,
  Mic2,
  ArrowRight,
  LayoutDashboard,
  UserRound,
  LogOut,
} from 'lucide-react'

import { useAuth } from '../features/authentication/AuthContext'
import { supabase } from '../lib/supabaseClient'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [error, setError] = useState('')

  const { user, loading } = useAuth()
  const navigate = useNavigate()

  const navigationLinks = [
    { label: 'Home', path: '/' },
    { label: 'Discover', path: '/about' },
    { label: 'Learning Hub', path: '/academy' },
    { label: 'Courses', path: '/courses' },
  ]

  function closeMobileMenu() {
    setMobileMenuOpen(false)
  }

  async function handleSignOut() {
    setError('')
    setSigningOut(true)

    const { error: signOutError } = await supabase.auth.signOut()

    setSigningOut(false)

    if (signOutError) {
      setError(signOutError.message)
      return
    }

    closeMobileMenu()
    navigate('/', { replace: true })
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-semibold transition-colors duration-200 ${
      isActive
        ? 'text-vox-teal'
        : 'text-slate-600 hover:text-vox-teal'
    }`

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 shadow-sm shadow-slate-900/[0.02] backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">

        {/* BRAND LOGO */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="flex shrink-0 items-center gap-3"
          aria-label="VoxArticulate home"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-vox-navy text-white shadow-lg shadow-vox-navy/15">
            <Mic2 size={23} strokeWidth={2.2} />
          </span>

          <span className="text-xl font-extrabold tracking-tight text-vox-navy sm:text-2xl">
            Vox<span className="text-vox-teal">Articulate</span>
          </span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-8 lg:flex"
        >
          {navigationLinks.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={navLinkClass}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* DESKTOP ACCOUNT ACTIONS */}
        <div className="hidden items-center gap-3 lg:flex">

          {!loading && !user && (
            <>
              <Link
                to="/login"
                className="rounded-xl px-4 py-3 text-sm font-bold text-vox-navy transition hover:bg-slate-50 hover:text-vox-teal"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-vox-navy px-5 py-3 text-sm font-bold text-white shadow-lg shadow-vox-navy/10 transition hover:-translate-y-0.5 hover:bg-vox-teal"
              >
                Start Learning
                <ArrowRight size={17} />
              </Link>
            </>
          )}

          {!loading && user && (
            <>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-vox-navy transition hover:bg-slate-50 hover:text-vox-teal"
              >
                <LayoutDashboard size={17} />
                Dashboard
              </Link>

              <Link
                to="/profile"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-vox-navy transition hover:border-vox-teal hover:text-vox-teal"
              >
                <UserRound size={17} />
                Profile
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="inline-flex items-center gap-2 rounded-xl bg-vox-navy px-4 py-3 text-sm font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LogOut size={16} />
                {signingOut ? 'Signing out...' : 'Sign Out'}
              </button>
            </>
          )}

        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-vox-navy transition hover:bg-slate-50 lg:hidden"
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          {mobileMenuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      {/* MOBILE NAVIGATION */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-slate-200 bg-white px-5 pb-6 pt-4 shadow-xl lg:hidden"
        >
          <nav
            aria-label="Mobile navigation"
            className="mx-auto flex max-w-7xl flex-col gap-1"
          >
            {navigationLinks.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-bold transition ${
                    isActive
                      ? 'bg-teal-50 text-vox-teal'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-vox-teal'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="mx-auto mt-5 flex max-w-7xl flex-col gap-3 border-t border-slate-100 pt-5">

            {!loading && !user && (
              <>
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="rounded-xl border border-slate-200 px-5 py-3.5 text-center text-sm font-bold text-vox-navy transition hover:border-vox-teal hover:text-vox-teal"
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center gap-2 rounded-xl bg-vox-navy px-5 py-3.5 text-sm font-bold text-white transition hover:bg-vox-teal"
                >
                  Start Learning
                  <ArrowRight size={17} />
                </Link>
              </>
            )}

            {!loading && user && (
              <>
                <Link
                  to="/dashboard"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3.5 text-sm font-bold text-vox-navy hover:text-vox-teal"
                >
                  <LayoutDashboard size={18} />
                  My Dashboard
                </Link>

                <Link
                  to="/profile"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3.5 text-sm font-bold text-vox-navy hover:text-vox-teal"
                >
                  <UserRound size={18} />
                  My Profile
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="flex items-center justify-center gap-2 rounded-xl bg-vox-navy px-5 py-3.5 text-sm font-bold text-white transition hover:bg-red-600 disabled:opacity-60"
                >
                  <LogOut size={17} />
                  {signingOut ? 'Signing out...' : 'Sign Out'}
                </button>
              </>
            )}

            {error && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}

          </div>
        </div>
      )}
    </header>
  )
}
