import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertCircle,
  Bot,
  Clock3,
  Headphones,
  History,
  Mic,
  MicOff,
  MessageCircle,
  RotateCcw,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  Waves,
} from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../features/authentication/AuthContext'

type PracticeMode = 'Speech Practice' | 'Conversation Simulator' | 'Articulation Coach'

interface SpeechRecognitionAlternativeLike {
  transcript: string
}

interface SpeechRecognitionResultLike {
  isFinal: boolean
  length: number
  [index: number]: SpeechRecognitionAlternativeLike
}

interface SpeechRecognitionEventLike {
  resultIndex: number
  results: ArrayLike<SpeechRecognitionResultLike>
}

interface SpeechRecognitionErrorLike {
  error: string
  message?: string
}

interface SpeechRecognitionLike {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: ((event: SpeechRecognitionErrorLike) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
  abort(): void
}

interface SpeechWindow extends Window {
  SpeechRecognition?: new () => SpeechRecognitionLike
  webkitSpeechRecognition?: new () => SpeechRecognitionLike
}

interface ConversationTurn {
  role: 'user' | 'assistant'
  content: string
}

interface SavedSession {
  id: string
  mode: PracticeMode
  transcript: string
  duration_seconds: number
  word_count: number
  filler_word_count: number
  created_at: string
}

const modes: { title: PracticeMode; description: string; icon: typeof Mic }[] = [
  {
    title: 'Speech Practice',
    description: 'Deliver a short talk and review your structure, pace and clarity.',
    icon: Mic,
  },
  {
    title: 'Conversation Simulator',
    description: 'Practise answering questions in realistic everyday situations.',
    icon: MessageCircle,
  },
  {
    title: 'Articulation Coach',
    description: 'Work on concise expression, vocabulary and reducing filler words.',
    icon: Waves,
  },
]

const fillerPattern = /\b(um+|uh+|erm|ah+|you know|like|basically|actually)\b/gi

function analyseSpeech(transcript: string, durationSeconds: number) {
  const words = transcript.trim().match(/[\p{L}\p{N}']+/gu) ?? []
  const fillers = transcript.match(fillerPattern) ?? []
  const sentences = transcript
    .split(/[.!?]+/)
    .map(sentence => sentence.trim())
    .filter(Boolean)
  const wordsPerMinute = durationSeconds > 0
    ? Math.round((words.length / durationSeconds) * 60)
    : 0

  return {
    wordCount: words.length,
    fillerCount: fillers.length,
    sentenceCount: sentences.length,
    averageSentenceLength: sentences.length
      ? Math.round(words.length / sentences.length)
      : 0,
    wordsPerMinute,
  }
}

export default function CommunicationLabPage() {
  const { user } = useAuth()
  const [mode, setMode] = useState<PracticeMode>('Speech Practice')
  const [transcript, setTranscript] = useState('')
  const [interim, setInterim] = useState('')
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [coachMessage, setCoachMessage] = useState('Choose a practice mode, then start speaking. I will show your transcript and give you practical speaking pointers.')
  const [conversation, setConversation] = useState<ConversationTurn[]>([])
  const [coachThinking, setCoachThinking] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [savedMessage, setSavedMessage] = useState('')
  const [history, setHistory] = useState<SavedSession[]>([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const transcriptRef = useRef('')
  const lastTurnTranscriptLengthRef = useRef(0)
  const startedAtRef = useRef<number | null>(null)

  const metrics = useMemo(
    () => analyseSpeech(transcript, elapsedSeconds),
    [transcript, elapsedSeconds],
  )

  const loadHistory = useCallback(async () => {
    if (!user) {
      setHistoryLoading(false)
      return
    }
    const { data, error: queryError } = await supabase
      .from('communication_sessions')
      .select('id, mode, transcript, duration_seconds, word_count, filler_word_count, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)

    if (queryError) {
      console.error('Unable to load speaking practice history:', queryError)
    } else {
      setHistory((data ?? []) as SavedSession[])
    }
    setHistoryLoading(false)
  }, [user])

  useEffect(() => {
    const start = window.setTimeout(() => void loadHistory(), 0)
    return () => window.clearTimeout(start)
  }, [loadHistory])

  useEffect(() => {
    if (!listening) return
    const timer = window.setInterval(() => {
      if (startedAtRef.current !== null) {
        setElapsedSeconds(Math.floor((Date.now() - startedAtRef.current) / 1000))
      }
    }, 1000)
    return () => window.clearInterval(timer)
  }, [listening])

  useEffect(() => () => {
    recognitionRef.current?.abort()
    window.speechSynthesis?.cancel()
  }, [])

  function speak(text: string) {
    if (!voiceEnabled || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.96
    utterance.pitch = 1
    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }

  function startListening() {
    setError('')
    setSavedMessage('')
    setInterim('')

    const speechWindow = window as SpeechWindow
    const Recognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition

    if (!Recognition) {
      setError('Speech recognition is not available in this browser. Open VoxArticulate in the latest Chrome or Edge, or type your response in the transcript box below.')
      return
    }

    const recognition = new Recognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-KE'
    recognition.onresult = event => {
      let finalText = ''
      let interimText = ''
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index]
        const phrase = result[0]?.transcript ?? ''
        if (result.isFinal) finalText += phrase
        else interimText += phrase
      }
      if (finalText) {
        transcriptRef.current = `${transcriptRef.current} ${finalText}`.trim()
        setTranscript(transcriptRef.current)
      }
      setInterim(interimText)
    }
    recognition.onerror = event => {
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        setError(event.error === 'not-allowed'
          ? 'Microphone access was blocked. Allow microphone permission in your browser settings and try again.'
          : `Speech recognition stopped: ${event.error}.`)
      }
      setListening(false)
    }
    recognition.onend = () => {
      setListening(false)
      setInterim('')
    }

    try {
      recognitionRef.current = recognition
      startedAtRef.current = Date.now()
      setElapsedSeconds(0)
      setListening(true)
      recognition.start()
    } catch {
      setListening(false)
      setError('The microphone could not be started. Check browser permissions and try again.')
    }
  }

  function stopListening() {
    recognitionRef.current?.stop()
    setListening(false)
    setInterim('')
  }

  async function finishPractice() {
    if (listening) stopListening()
    const fullTranscript = transcriptRef.current.trim()
    const newTurn = fullTranscript.slice(lastTurnTranscriptLengthRef.current).trim()

    if (!newTurn) {
      setError('Speak or type a new response before asking the coach.')
      return
    }

    setCoachThinking(true)
    setError('')
    try {
      const { data, error: invokeError } = await supabase.functions.invoke(
        'communication-coach',
        {
          body: {
            mode,
            transcript: newTurn,
            history: conversation,
          },
        },
      )

      if (invokeError) throw invokeError
      const reply = typeof data?.reply === 'string' ? data.reply : ''
      if (!reply) throw new Error(data?.error || 'The speaking coach returned no response.')

      setConversation(previous => [
        ...previous,
        { role: 'user', content: newTurn },
        { role: 'assistant', content: reply },
      ])
      lastTurnTranscriptLengthRef.current = transcriptRef.current.length
      setCoachMessage(reply)
      speak(reply)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'The AI speaking coach is not available. Check that its Supabase Edge Function and API secret have been configured.',
      )
    } finally {
      setCoachThinking(false)
    }
  }

  function resetPractice() {
    recognitionRef.current?.abort()
    recognitionRef.current = null
    transcriptRef.current = ''
    lastTurnTranscriptLengthRef.current = 0
    setConversation([])
    startedAtRef.current = null
    setListening(false)
    setInterim('')
    setTranscript('')
    setElapsedSeconds(0)
    setCoachMessage('Ready for another attempt? Start speaking whenever you are ready.')
    setError('')
    setSavedMessage('')
    window.speechSynthesis?.cancel()
    setSpeaking(false)
  }

  function updateTranscript(value: string) {
    transcriptRef.current = value
    setTranscript(value)
    setSavedMessage('')
  }

  async function saveSession() {
    if (!user || !transcript.trim()) return
    setSaving(true)
    setError('')
    setSavedMessage('')

    try {
      const { error: saveError } = await supabase
        .from('communication_sessions')
        .insert({
          user_id: user.id,
          mode,
          transcript: transcript.trim(),
          duration_seconds: elapsedSeconds,
          word_count: metrics.wordCount,
          filler_word_count: metrics.fillerCount,
        })
      if (saveError) throw saveError
      setSavedMessage('Practice session saved to your account.')
      await loadHistory()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save this practice session.')
    } finally {
      setSaving(false)
    }
  }

  const formattedTime = `${Math.floor(elapsedSeconds / 60).toString().padStart(2, '0')}:${(elapsedSeconds % 60).toString().padStart(2, '0')}`

  return (
    <main className="min-h-screen bg-vox-cream px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <section className="relative overflow-hidden rounded-[2rem] bg-vox-navy px-7 py-10 text-white md:px-12 md:py-14">
          <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full border-[40px] border-white/5" />
          <div className="pointer-events-none absolute -bottom-40 right-40 h-72 w-72 rounded-full bg-teal-400/10 blur-3xl" />
          <div className="relative max-w-3xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-teal-200">
              <Sparkles size={28} />
            </div>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.24em] text-teal-200">Your voice practice studio</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">Speak. Listen. Improve.</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
              Practise out loud, review what you said and build a record of your speaking sessions.
            </p>
          </div>
          <div className="relative mt-9 flex flex-wrap gap-3 text-xs font-semibold text-slate-300">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Live speech-to-text</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Audible coach feedback</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Saved practice history</span>
          </div>
        </section>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-7">
            <section>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-xl font-extrabold text-vox-navy">Choose your practice mode</h2>
                <span className="text-xs font-semibold text-slate-500">Step 1 of 2</span>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {modes.map(item => (
                  <button
                    type="button"
                    key={item.title}
                    onClick={() => setMode(item.title)}
                    className={`rounded-2xl border p-5 text-left transition ${mode === item.title ? 'border-vox-teal bg-teal-50 shadow-sm ring-1 ring-vox-teal/20' : 'border-slate-200 bg-white hover:border-vox-teal'}`}
                  >
                    <item.icon size={24} className="text-vox-teal" />
                    <h3 className="mt-4 text-sm font-extrabold text-vox-navy">{item.title}</h3>
                    <p className="mt-2 text-xs leading-5 text-slate-500">{item.description}</p>
                  </button>
                ))}
              </div>
            </section>

            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-vox-teal"><Headphones size={22} /></div>
                  <div>
                    <h2 className="font-extrabold text-vox-navy">{mode}</h2>
                    <p className="text-xs text-slate-500">Step 2 · Your speaking session</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-bold tabular-nums text-slate-700">
                  <Clock3 size={15} /> {formattedTime}
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="rounded-2xl bg-gradient-to-br from-vox-navy to-slate-800 p-6 text-white md:p-8">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-teal-200">VoxArticulate Coach</p>
                      <p className="mt-2 text-lg font-bold">Tell me what you would like to practise.</p>
                    </div>
                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 ${speaking ? 'bg-teal-400/20 text-teal-200' : 'bg-white/10 text-slate-300'}`}>
                      {speaking ? <Volume2 size={25} className="animate-pulse" /> : <Bot size={25} />}
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-300">{coachMessage}</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button type="button" onClick={() => speak(coachMessage)} className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/10">
                      <Volume2 size={15} /> Hear feedback
                    </button>
                    <button type="button" onClick={() => { window.speechSynthesis?.cancel(); setSpeaking(false) }} className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/10">
                      <VolumeX size={15} /> Stop audio
                    </button>
                  </div>
                </div>

                {conversation.length > 0 && (
                  <div className="mt-6 space-y-3">
                    {conversation.map((turn, index) => (
                      <div key={index} className={`max-w-[90%] rounded-2xl p-4 text-sm leading-6 ${turn.role === 'user' ? 'ml-auto rounded-br-sm bg-teal-50 text-slate-700' : 'rounded-bl-sm border border-slate-200 bg-white text-slate-700'}`}>
                        <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-vox-teal">{turn.role === 'user' ? 'You' : 'VoxArticulate Coach'}</p>
                        {turn.content}
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-7 flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
                  <div className={`relative flex h-24 w-24 items-center justify-center rounded-full ${listening ? 'bg-rose-100 text-rose-600' : 'bg-teal-50 text-vox-teal'}`}>
                    {listening && <span className="absolute inset-0 animate-ping rounded-full border-2 border-rose-300 opacity-40" />}
                    {listening ? <Waves size={34} /> : <Mic size={34} />}
                  </div>
                  <p className="mt-5 font-extrabold text-vox-navy">{listening ? 'Listening to you...' : 'Your microphone is ready'}</p>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                    {listening ? 'Speak naturally. Your recognised words will appear in the transcript below.' : 'Allow microphone access when your browser asks. You can also type directly into the transcript.'}
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    {!listening ? (
                      <button type="button" onClick={startListening} className="inline-flex items-center gap-2 rounded-xl bg-vox-navy px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition hover:bg-vox-teal">
                        <Mic size={17} /> Start speaking
                      </button>
                    ) : (
                      <button type="button" onClick={stopListening} className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-3.5 text-sm font-bold text-white hover:bg-rose-700">
                        <MicOff size={17} /> Stop recording
                      </button>
                    )}
                    <button type="button" onClick={resetPractice} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 hover:border-vox-teal">
                      <RotateCcw size={16} /> Reset
                    </button>
                  </div>
                  <label className="mt-5 flex items-center gap-2 text-xs font-medium text-slate-500">
                    <input type="checkbox" checked={voiceEnabled} onChange={event => setVoiceEnabled(event.target.checked)} className="accent-teal-700" />
                    Enable spoken coach responses
                  </label>
                </div>

                {error && <div role="alert" className="mt-5 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"><AlertCircle size={18} className="mt-0.5 shrink-0" />{error}</div>}

                <div className="mt-7">
                  <div className="flex items-center justify-between gap-3">
                    <label htmlFor="speech-transcript" className="text-sm font-extrabold text-vox-navy">Your transcript</label>
                    <span className="text-xs text-slate-400">{metrics.wordCount} words</span>
                  </div>
                  <textarea
                    id="speech-transcript"
                    value={transcript}
                    onChange={event => updateTranscript(event.target.value)}
                    rows={7}
                    placeholder="Your spoken words will appear here. You can edit the transcript or type your response if speech recognition is unavailable."
                    className="mt-3 w-full resize-y rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-vox-teal focus:ring-4 focus:ring-teal-500/10"
                  />
                  {interim && <p className="mt-2 text-sm italic text-slate-500">Hearing: {interim}</p>}
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button type="button" onClick={() => void finishPractice()} disabled={!transcript.trim() || coachThinking} className="inline-flex items-center gap-2 rounded-xl bg-vox-teal px-5 py-3 text-sm font-bold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40">
                      <Send size={16} /> {coachThinking ? 'Coach is thinking...' : 'Send to AI coach'}
                    </button>
                    <button type="button" onClick={saveSession} disabled={!user || !transcript.trim() || saving} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-vox-navy hover:border-vox-teal disabled:cursor-not-allowed disabled:opacity-40">
                      {saving ? 'Saving...' : 'Save session'}
                    </button>
                  </div>
                  {!user && <p className="mt-3 text-xs text-slate-500">Sign in to save practice sessions to your account.</p>}
                  {savedMessage && <p role="status" className="mt-3 text-sm font-semibold text-emerald-700">{savedMessage}</p>}
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6">
              <h2 className="font-extrabold text-vox-navy">Session snapshot</h2>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  { label: 'Words', value: metrics.wordCount },
                  { label: 'Possible fillers', value: metrics.fillerCount },
                  { label: 'Sentences', value: metrics.sentenceCount },
                  { label: 'Avg. words / sentence', value: metrics.averageSentenceLength },
                ].map(item => (
                  <div key={item.label} className="rounded-xl bg-slate-50 p-4">
                    <p className="text-2xl font-extrabold tabular-nums text-vox-navy">{item.value}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{item.label}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs leading-5 text-slate-500">These are basic transcript indicators, not a validated pronunciation, accent or confidence score.</p>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-2">
                <History size={19} className="text-vox-teal" />
                <h2 className="font-extrabold text-vox-navy">Recent practice</h2>
              </div>
              {historyLoading ? (
                <p className="mt-4 text-sm text-slate-500">Loading your sessions...</p>
              ) : history.length === 0 ? (
                <p className="mt-4 text-sm leading-6 text-slate-500">Your saved speaking sessions will appear here.</p>
              ) : (
                <div className="mt-4 space-y-4">
                  {history.map(item => (
                    <div key={item.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                      <p className="text-sm font-bold text-vox-navy">{item.mode}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.word_count} words · {Math.floor(item.duration_seconds / 60)}m {item.duration_seconds % 60}s</p>
                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{item.transcript}</p>
                      <p className="mt-2 text-[11px] text-slate-400">{new Date(item.created_at).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-3xl bg-teal-50 p-6">
              <div className="flex items-center gap-2 text-vox-teal"><Sparkles size={18} /><h2 className="font-extrabold">A useful practice tip</h2></div>
              <p className="mt-3 text-sm leading-7 text-slate-700">Record a one-minute response to the same prompt several times. Compare how clearly you organise your ideas and how often you rely on filler words.</p>
            </section>
          </aside>
        </div>

        <p className="mt-8 text-center text-xs leading-6 text-slate-500">
          Current phase: browser-based speech recognition and spoken feedback. The next phase will connect a secure AI conversation service; this browser coach does not yet generate live AI dialogue.
        </p>
      </div>
    </main>
  )
}
