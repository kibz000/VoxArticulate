
import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, LockKeyhole, Mic2 } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { getSafeNextPath } from '../features/authentication/authUtils'

export default function ForgotPasswordPage() {
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const next = getSafeNextPath(searchParams.get('next'))

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setMessage('')
    setSubmitting(true)

    try {
      const redirectTo =
        `${window.location.origin}/auth/callback?next=${encodeURIComponent('/reset-password')}`

      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo,
        })

      if (resetError) {
        setError(resetError.message)
        return
      }

      setMessage(
        'If an account exists for this email, a password reset link will be sent. Check your inbox.',
      )
    } catch {
      setError('Unable to send the reset email. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-vox-cream px-5 py-14">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/5 sm:p-10">
        <Link
          to={`/login?next=${encodeURIComponent(next)}`}
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-vox-teal"
        >
          <ArrowLeft size={18} /> Back to sign in
        </Link>

        <Link to="/" className="mb-9 flex w-fit items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-vox-navy text-white">
            <Mic2 size={23} />
          </span>
          <span className="text-xl font-extrabold text-vox-navy">
            Vox<span className="text-vox-teal">Articulate</span>
          </span>
        </Link>

        <LockKeyhole size={30} className="text-vox-teal" />

        <h1 className="mt-5 text-3xl font-extrabold text-vox-navy">
          Reset your password
        </h1>

        <p className="mt-3 leading-7 text-vox-muted">
          Enter the email address connected to your learner account. We'll send you a password reset link.
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
            className="w-full rounded-xl bg-vox-navy px-5 py-4 font-bold text-white transition hover:bg-vox-teal disabled:opacity-60"
          >
            {submitting ? 'Sending...' : 'Send reset link'}
          </button>
        </form>
      </div>
    </main>
  )
}
