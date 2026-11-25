
import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, LockKeyhole, Mic2 } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { getSafeNextPath } from '../features/authentication/authUtils'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
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
    setMessage('')

    if (password.length < 8) {
      setError('Your password must contain at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Your passwords do not match.')
      return
    }

    setSubmitting(true)

    try {
      const redirectTo =
        `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: name.trim(),
          },
          emailRedirectTo: redirectTo,
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      if (data.session) {
        navigate(next, { replace: true })
        return
      }

      setMessage(
        'Your account has been created. Please check your email and click the verification link to activate your account.',
      )
    } catch {
      setError('Something went wrong. Please try again.')
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
          Free learner account
        </p>

        <h1 className="mt-3 text-3xl font-extrabold text-vox-navy sm:text-4xl">
          Start your journey
        </h1>

        <p className="mt-3 leading-7 text-vox-muted">
          Create your account and begin developing communication skills that make an impact.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-bold text-vox-navy">
              Full name
            </label>
            <input
              required
              autoComplete="name"
              value={name}
              onChange={event => setName(event.target.value)}
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-vox-teal"
            />
          </div>

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
              minLength={8}
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-vox-teal"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-vox-navy">
              Confirm password
            </label>
            <input
              required
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={event => setConfirmPassword(event.target.value)}
              placeholder="Enter your password again"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-vox-teal"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          {message && (
            <p role="status" className="rounded-xl bg-teal-50 p-3 text-sm text-teal-800">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-vox-navy px-5 py-4 font-bold text-white transition hover:bg-vox-teal disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Creating account...' : 'Create free account'}
            {!submitting && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-vox-muted">
          <LockKeyhole size={15} />
          Your account will keep your learning progress.
        </div>

        <p className="mt-7 text-center text-sm text-vox-muted">
          Already registered?{' '}
          <Link
            to={`/login?next=${encodeURIComponent(next)}`}
            className="font-bold text-vox-teal hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
