
import { Link, Outlet } from 'react-router-dom'
import { ArrowRight, Mic2 } from 'lucide-react'

export default function InnerPageLayout() {
  return (
    <div className="min-h-screen bg-vox-cream text-vox-navy">
      <header className="sticky top-0 z-50 border-b border-vox-border bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-vox-navy text-white">
              <Mic2 size={22} />
            </div>

            <span className="text-xl font-extrabold tracking-tight">
              Vox<span className="text-vox-teal">Articulate</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-semibold md:flex">
            <Link to="/about" className="hover:text-vox-teal">
              About
            </Link>

            <Link to="/academy" className="hover:text-vox-teal">
              Academy
            </Link>

            <Link to="/courses" className="hover:text-vox-teal">
              Courses
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden text-sm font-bold hover:text-vox-teal sm:block"
            >
              Log in
            </Link>

            <Link
              to="/register"
              className="flex items-center gap-2 rounded-full bg-vox-navy px-5 py-3 text-sm font-bold text-white transition hover:bg-vox-teal"
            >
              Get Started
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </header>

      <Outlet />

      <footer className="mt-20 bg-vox-dark px-6 py-12 text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row">

          <div>
            <Link to="/" className="flex items-center gap-2 text-xl font-extrabold">
              <Mic2 size={22} />
              VoxArticulate
            </Link>

            <p className="mt-3 max-w-sm text-sm leading-7 text-slate-300">
              Your voice. Your confidence. Your impact.
              Develop the skills to communicate effectively in every setting.
            </p>
          </div>

          <div className="flex flex-col gap-3 text-sm text-slate-300">
            <Link to="/about" className="hover:text-white">About us</Link>
            <Link to="/academy" className="hover:text-white">Academy</Link>
            <Link to="/courses" className="hover:text-white">Courses</Link>
            <Link to="/register" className="hover:text-white">Join VoxArticulate</Link>
          </div>

        </div>

        <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-xs text-slate-400">
          © {new Date().getFullYear()} VoxArticulate. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
