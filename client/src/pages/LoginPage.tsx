
import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, LockKeyhole, Mic2 } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { getSafeNextPath } from '../features/authentication/authUtils'

export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const next = getSafeNextPath(searchParams.get('next'))

  function goBack() {
    if (window.history.state?.idx > 0) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })

      if (loginError) {
        setError(loginError.message)
        return
      }

      navigate(next, { replace: true })
    } catch {
      setError('Unable to sign in. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-vox-cream px-5 py-14">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/5 sm:p-10">
        <button
          type="button"
          onClick={goBack}
          className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-vox-teal"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <Link to="/" className="mb-9 flex w-fit items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-vox-navy text-white">
            <Mic2 size={23} />
          </span>
          <span className="text-xl font-extrabold text-vox-navy">
            Vox<span className="text-vox-teal">Articulate</span>
          </span>
        </Link>

        <p className="text-sm font-bold uppercase tracking-widest text-vox-teal">
          Welcome back
        </p>

        <h1 className="mt-3 text-3xl font-extrabold text-vox-navy sm:text-4xl">
          Sign in to continue
        </h1>

        <p className="mt-3 leading-7 text-vox-muted">
          Return to your learning journey and keep building your communication skills.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-bold text-vox-navy">
              Email address
            </label>
            <input
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-vox-teal"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-vox-navy">
              Password
            </label>
            <input
              required
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-vox-teal"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="flex justify-end">
            <Link
              to={`/forgot-password?next=${encodeURIComponent(next)}`}
              className="text-sm font-bold text-vox-teal hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-vox-navy px-5 py-4 font-bold text-white transition hover:bg-vox-teal disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Signing in...' : 'Sign in'}
            {!submitting && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-vox-muted">
          <LockKeyhole size={15} />
          Your learning progress stays connected to your account.
        </div>

        <p className="mt-7 text-center text-sm text-vox-muted">
          New to VoxArticulate?{' '}
          <Link
            to={`/register?next=${encodeURIComponent(next)}`}
            className="font-bold text-vox-teal hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </main>
  )
}
