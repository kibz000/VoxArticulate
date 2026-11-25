import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { getSafeNextPath } from '../features/authentication/authUtils'

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'checking' | 'success' | 'error'>('checking')
  const [errorMessage, setErrorMessage] = useState('')

  const next = getSafeNextPath(searchParams.get('next'))
  const authError = searchParams.get('error_description') ?? searchParams.get('error')

  useEffect(() => {
    let active = true

    async function completeAuthentication() {
      if (authError) {
        setErrorMessage(authError.replace(/\+/g, ' '))
        setStatus('error')
        return
      }

      try {
        // Supabase's client is configured with detectSessionInUrl=true. Its
        // auth listener processes the PKCE/hash callback and persists the
        // resulting session for this browser/device.
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error

        if (!active) return

        if (data.session?.user) {
          setStatus('success')
          navigate(next, { replace: true })
          return
        }

        setErrorMessage(
          'The link may have expired or already been used. If you opened it on another device, verification can succeed there, but this browser still needs you to sign in.',
        )
        setStatus('error')
      } catch (error) {
        if (!active) return
        setErrorMessage(
          error instanceof Error ? error.message : 'We could not complete authentication. Please try again.',
        )
        setStatus('error')
      }
    }

    void completeAuthentication()
    return () => {
      active = false
    }
  }, [authError, navigate, next])

  if (status !== 'error') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-vox-cream px-5">
        <div className="text-center">
          <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-vox-teal" />
          <h1 className="text-xl font-extrabold text-vox-navy">
            Completing account verification
          </h1>
          <p className="mt-2 text-sm text-vox-muted">
            Checking the secure sign-in session in this browser.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-vox-cream px-5">
      <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
        <h1 className="text-2xl font-extrabold text-vox-navy">
          Verification needs another step
        </h1>
        <p className="mt-3 text-sm leading-6 text-vox-muted">{errorMessage}</p>
        <p className="mt-3 text-sm leading-6 text-vox-muted">
          Once verified, return here and sign in with your email and password. Your account and progress remain linked to the same learner identity.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-block rounded-xl bg-vox-navy px-6 py-3 font-bold text-white hover:bg-vox-teal"
        >
          Sign in to VoxArticulate
        </Link>
      </div>
    </main>
  )
}
