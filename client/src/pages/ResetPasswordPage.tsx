
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LockKeyhole, Mic2 } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../features/authentication/AuthContext'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!user) {
      setError('Your password reset session is missing or has expired. Request a new reset link.')
      return
    }

    if (password.length < 8) {
      setError('Your new password must contain at least 8 characters.')
      return
    }

    if (password !== confirmation) {
      setError('Your passwords do not match.')
      return
    }

    setSubmitting(true)

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      })

      if (updateError) {
        setError(updateError.message)
        return
      }

      navigate('/dashboard', { replace: true })
    } catch {
      setError('Unable to update your password. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-vox-cream">
        <p className="font-semibold text-vox-muted">Checking your reset session...</p>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-vox-cream px-5 py-14">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/5 sm:p-10">
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
          Choose a new password
        </h1>

        <p className="mt-3 leading-7 text-vox-muted">
          Create a new password for your VoxArticulate learner account.
        </p>

        {!user ? (
          <div className="mt-7 space-y-4">
            <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
              No valid password reset session was found. Request a fresh reset link.
            </p>
            <Link
              to="/forgot-password"
              className="block rounded-xl bg-vox-navy px-5 py-4 text-center font-bold text-white hover:bg-vox-teal"
            >
              Request another reset link
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-vox-navy">
                New password
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
                Confirm new password
              </label>
              <input
                required
                type="password"
                autoComplete="new-password"
                value={confirmation}
                onChange={event => setConfirmation(event.target.value)}
                placeholder="Enter your password again"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-vox-teal"
              />
            </div>

            {error && (
              <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-vox-navy px-5 py-4 font-bold text-white hover:bg-vox-teal disabled:opacity-60"
            >
              {submitting ? 'Updating password...' : 'Update password'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
