
import { useState, type FormEvent } from 'react'
import { UserRound, Save } from 'lucide-react'

export default function ProfilePage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [bio, setBio] = useState('')
  const [message, setMessage] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('Profile saving will be connected to the learner account service.')
  }

  return (
    <main className="min-h-screen bg-vox-cream px-6 py-14">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-vox-teal">
            <UserRound size={32} />
          </div>
          <p className="mt-7 text-sm font-bold uppercase tracking-widest text-vox-teal">Learner account</p>
          <h1 className="mt-2 text-3xl font-extrabold text-vox-navy">Your profile</h1>
          <p className="mt-3 leading-7 text-vox-muted">Manage your personal information and how you present yourself in the learning community.</p>

          <form onSubmit={handleSubmit} className="mt-9 space-y-6">
            <div>
              <label className="mb-2 block text-sm font-bold text-vox-navy">Full name</label>
              <input value={fullName} onChange={event => setFullName(event.target.value)} required placeholder="Your full name" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-vox-teal" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-vox-navy">Email address</label>
              <input type="email" value={email} onChange={event => setEmail(event.target.value)} required placeholder="you@example.com" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-vox-teal" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-vox-navy">About me</label>
              <textarea value={bio} onChange={event => setBio(event.target.value)} rows={5} placeholder="Tell us about your communication goals..." className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-vox-teal" />
            </div>

            {message && <p role="status" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">{message}</p>}

            <button type="submit" className="flex items-center gap-2 rounded-xl bg-vox-navy px-6 py-4 font-bold text-white hover:bg-vox-teal">
              Save profile <Save size={17} />
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
