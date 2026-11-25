import { useEffect, useState, type FormEvent } from 'react'
import { Save, UserRound, RefreshCw, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../features/authentication/AuthContext'

interface Profile {
  full_name: string
  country: string
  preferred_language: string
  interests: string
  goals: string
  bio: string
}

const emptyProfile: Profile = {
  full_name: '',
  country: '',
  preferred_language: 'English',
  interests: '',
  goals: '',
  bio: '',
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile>(emptyProfile)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!user) return
    let active = true

    async function loadProfile() {
      setLoading(true)
      setError('')
      try {
        const { data, error: queryError } = await supabase
          .from('profiles')
          .select('full_name, country, preferred_language, interests, goals, bio')
          .eq('id', user.id)
          .maybeSingle()
        if (queryError) throw queryError
        if (!active) return

        if (data) {
          setProfile({ ...emptyProfile, ...data } as Profile)
        } else {
          const initial = {
            ...emptyProfile,
            full_name: String(user.user_metadata?.full_name ?? ''),
          }
          const { error: insertError } = await supabase
            .from('profiles')
            .upsert({ id: user.id, ...initial }, { onConflict: 'id' })
          if (insertError) throw insertError
          if (active) setProfile(initial)
        }
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Unable to load your profile.')
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadProfile()
    return () => { active = false }
  }, [user])

  function updateField(field: keyof Profile, value: string) {
    setProfile(current => ({ ...current, [field]: value }))
    setMessage('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user) return
    setSaving(true)
    setError('')
    setMessage('')
    try {
      const { error: saveError } = await supabase
        .from('profiles')
        .upsert({ id: user.id, ...profile }, { onConflict: 'id' })
      if (saveError) throw saveError

      const { error: metadataError } = await supabase.auth.updateUser({
        data: { full_name: profile.full_name.trim() },
      })
      if (metadataError) throw metadataError
      setMessage('Your profile has been saved.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save your profile.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <main className="min-h-screen bg-vox-cream px-6 py-14"><div className="mx-auto flex max-w-3xl items-center justify-center gap-3 rounded-3xl bg-white p-12"><RefreshCw size={22} className="animate-spin text-vox-teal" /><p className="font-semibold text-slate-600">Loading your profile...</p></div></main>
  }

  const fields: { key: keyof Profile; label: string; placeholder: string; rows: number }[] = [
    { key: 'interests', label: 'Communication interests', placeholder: 'Public speaking, interviews, everyday conversation...', rows: 3 },
    { key: 'goals', label: 'Learning goals', placeholder: 'What would you like to improve?', rows: 3 },
    { key: 'bio', label: 'About me', placeholder: 'Tell us a little about yourself...', rows: 4 },
  ]

  return (
    <main className="min-h-screen bg-vox-cream px-6 py-14">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-vox-teal"><UserRound size={32} /></div>
          <p className="mt-7 text-sm font-bold uppercase tracking-widest text-vox-teal">Learner account</p>
          <h1 className="mt-2 text-3xl font-extrabold text-vox-navy">Your profile</h1>
          <p className="mt-3 leading-7 text-vox-muted">Your information is saved to your learner account and follows you across devices.</p>

          <form onSubmit={handleSubmit} className="mt-9 space-y-6">
            <div>
              <label htmlFor="profile-name" className="mb-2 block text-sm font-bold text-vox-navy">Full name</label>
              <input id="profile-name" value={profile.full_name} onChange={event => updateField('full_name', event.target.value)} required maxLength={100} placeholder="Your full name" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-vox-teal" />
            </div>
            <div>
              <label htmlFor="profile-email" className="mb-2 block text-sm font-bold text-vox-navy">Account email</label>
              <input id="profile-email" type="email" value={user?.email ?? ''} readOnly className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500 outline-none" />
              <p className="mt-2 text-xs text-slate-500">Your sign-in email is managed by your authentication account.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="profile-country" className="mb-2 block text-sm font-bold text-vox-navy">Country</label>
                <input id="profile-country" value={profile.country} onChange={event => updateField('country', event.target.value)} maxLength={80} placeholder="Your country" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-vox-teal" />
              </div>
              <div>
                <label htmlFor="profile-language" className="mb-2 block text-sm font-bold text-vox-navy">Preferred language</label>
                <input id="profile-language" value={profile.preferred_language} onChange={event => updateField('preferred_language', event.target.value)} maxLength={80} placeholder="e.g. English" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-vox-teal" />
              </div>
            </div>
            {fields.map(field => (
              <div key={field.key}>
                <label htmlFor={field.key} className="mb-2 block text-sm font-bold text-vox-navy">{field.label}</label>
                <textarea id={field.key} value={profile[field.key]} onChange={event => updateField(field.key, event.target.value)} rows={field.rows} maxLength={1500} placeholder={field.placeholder} className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-vox-teal" />
              </div>
            ))}
            {error && <p role="alert" className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700"><AlertCircle size={17} className="mt-0.5 shrink-0" />{error}</p>}
            {message && <p role="status" className="rounded-xl bg-teal-50 p-3 text-sm text-teal-800">{message}</p>}
            <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-xl bg-vox-navy px-6 py-4 font-bold text-white transition hover:bg-vox-teal disabled:cursor-not-allowed disabled:opacity-60">{saving ? 'Saving profile...' : 'Save profile'} <Save size={17} /></button>
          </form>
        </div>
      </div>
    </main>
  )
}
