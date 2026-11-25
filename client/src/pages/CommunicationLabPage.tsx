
import { useState } from 'react'
import {
  ArrowRight,
  Bot,
  MessageCircle,
  Mic,
  Send,
  Sparkles,
  Volume2,
} from 'lucide-react'

const practiceModes = [
  {
    title: 'Speech Practice',
    description: 'Practise delivering a speech and work towards clearer, more confident expression.',
    icon: Mic,
  },
  {
    title: 'Conversation Simulator',
    description: 'Prepare for everyday, academic and professional conversations.',
    icon: MessageCircle,
  },
  {
    title: 'Articulation Coach',
    description: 'Develop fluency, vocabulary and structured expression.',
    icon: Volume2,
  },
]

export default function CommunicationLabPage() {
  const [mode, setMode] = useState('Speech Practice')
  const [prompt, setPrompt] = useState('')

  return (
    <main className="min-h-screen bg-vox-cream px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-3xl bg-vox-navy p-8 text-white md:p-12">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-teal-200">
            <Sparkles size={29} />
          </div>
          <p className="mt-6 text-sm font-bold uppercase tracking-widest text-teal-200">AI-powered practice environment</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold md:text-5xl">The Communication Lab</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Practise speaking, explore realistic conversations and develop the confidence to communicate effectively.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-extrabold text-vox-navy">Choose your practice environment</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {practiceModes.map(item => (
              <button
                type="button"
                key={item.title}
                onClick={() => setMode(item.title)}
                className={`rounded-2xl border p-6 text-left transition ${mode === item.title ? 'border-vox-teal bg-teal-50 shadow-sm' : 'border-slate-200 bg-white hover:border-vox-teal'}`}
              >
                <item.icon size={28} className="text-vox-teal" />
                <h3 className="mt-5 text-lg font-extrabold text-vox-navy">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-vox-muted">{item.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-vox-teal">
                  Select mode <ArrowRight size={15} />
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <div className="flex items-center gap-3 border-b border-slate-200 p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-vox-teal">
              <Bot size={24} />
            </div>
            <div>
              <h2 className="font-extrabold text-vox-navy">{mode}</h2>
              <p className="text-sm text-vox-muted">AI practice workspace preview</p>
            </div>
          </div>

          <div className="min-h-64 bg-slate-50 p-7">
            <div className="max-w-xl rounded-2xl rounded-tl-none border border-slate-200 bg-white p-5">
              <p className="text-sm font-bold text-vox-teal">VoxArticulate Coach</p>
              <p className="mt-2 leading-7 text-slate-700">
                Welcome to your practice space. What communication skill would you like to work on today?
              </p>
            </div>
          </div>

          <div className="border-t border-slate-200 p-5">
            <label className="mb-2 block text-sm font-bold text-vox-navy">Your practice topic</label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={prompt}
                onChange={event => setPrompt(event.target.value)}
                placeholder="E.g. Help me practise introducing myself..."
                className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-vox-teal"
              />
              <button
                type="button"
                disabled={!prompt.trim()}
                className="flex items-center justify-center gap-2 rounded-xl bg-vox-navy px-6 py-3 font-bold text-white hover:bg-vox-teal disabled:opacity-40"
              >
                <Send size={17} /> Practise
              </button>
            </div>
            <p className="mt-3 text-xs leading-5 text-vox-muted">
              This is an interface preview. AI responses, microphone access, speech analysis and personalised coaching will be connected in a later development phase.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
