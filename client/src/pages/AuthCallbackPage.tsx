
import { useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../features/authentication/AuthContext'
import { getSafeNextPath } from '../features/authentication/authUtils'

export default function AuthCallbackPage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const next = getSafeNextPath(searchParams.get('next'))

  useEffect(() => {
    if (!loading && user) {
      navigate(next, { replace: true })
    }
  }, [loading, user, next, navigate])

  if (loading || user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-vox-cream px-5">
        <div className="text-center">
          <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-vox-teal" />
          <h1 className="text-xl font-extrabold text-vox-navy">
            Verifying your account
          </h1>
          <p className="mt-2 text-sm text-vox-muted">
            Please wait while we securely complete your authentication.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-vox-cream px-5">
      <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
        <h1 className="text-2xl font-extrabold text-vox-navy">
          Verification could not be completed
        </h1>
        <p className="mt-3 text-sm leading-6 text-vox-muted">
          The link may have expired, already been used, or could not be verified. Please try signing in or request a new link.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-block rounded-xl bg-vox-navy px-6 py-3 font-bold text-white hover:bg-vox-teal"
        >
          Return to sign in
        </Link>
      </div>
    </main>
  )
}
