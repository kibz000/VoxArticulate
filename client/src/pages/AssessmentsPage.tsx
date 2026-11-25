import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AlertCircle, ArrowRight, ClipboardCheck, RefreshCw } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

interface Assessment {
  id: string
  slug: string
  title: string
  description: string
}

interface Question {
  id: string
  prompt: string
  options: string[]
  position: number
}

export default function AssessmentsPage() {
  const { assessmentId } = useParams()
  const navigate = useNavigate()
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const loadAssessment = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      let assessmentQuery = supabase
        .from('assessments')
        .select('id, slug, title, description')
        .eq('is_published', true)

      assessmentQuery = assessmentId
        ? assessmentQuery.eq('slug', assessmentId)
        : assessmentQuery.eq('slug', 'communication-foundations')

      const { data: assessmentData, error: assessmentError } = await assessmentQuery.maybeSingle()
      if (assessmentError) throw assessmentError
      if (!assessmentData) throw new Error('No published assessment is available yet.')

      const { data: questionData, error: questionError } = await supabase
        .from('assessment_questions')
        .select('id, prompt, options, position')
        .eq('assessment_id', assessmentData.id)
        .eq('is_published', true)
        .order('position', { ascending: true })

      if (questionError) throw questionError
      if (!questionData?.length) throw new Error('This assessment has no published questions.')

      setAssessment(assessmentData as Assessment)
      setQuestions(questionData as Question[])
      setAnswers({})
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load this assessment.')
    } finally {
      setLoading(false)
    }
  }, [assessmentId])

  useEffect(() => {
    const start = window.setTimeout(() => void loadAssessment(), 0)
    return () => window.clearTimeout(start)
  }, [loadAssessment])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!assessment || Object.keys(answers).length !== questions.length) return

    setSubmitting(true)
    setError('')
    try {
      const submittedAnswers = questions.map(question => ({
        question_id: question.id,
        selected_option_index: answers[question.id],
      }))

      const { data, error: submitError } = await supabase.rpc('submit_assessment', {
        p_assessment_id: assessment.id,
        p_answers: submittedAnswers,
      })

      if (submitError) throw submitError
      const result = data as { attempt_id?: string } | null
      if (!result?.attempt_id) throw new Error('The assessment was submitted but no result ID was returned.')
      navigate(`/results/${result.attempt_id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit your assessment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <main className="min-h-screen bg-vox-cream px-5 py-16"><div className="mx-auto flex max-w-3xl items-center justify-center gap-3 rounded-2xl bg-white p-12"><RefreshCw size={25} className="animate-spin text-vox-teal" /><p className="font-semibold text-slate-600">Loading assessment...</p></div></main>
  }

  if (error && !assessment) {
    return <main className="min-h-screen bg-vox-cream px-5 py-16"><div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center"><AlertCircle size={30} className="mx-auto text-rose-500" /><h1 className="mt-4 text-2xl font-extrabold text-vox-navy">Assessment unavailable</h1><p className="mt-3 text-sm leading-6 text-slate-600">{error}</p><button type="button" onClick={() => void loadAssessment()} className="mt-6 rounded-xl bg-vox-navy px-5 py-3 font-bold text-white hover:bg-vox-teal">Try again</button></div></main>
  }

  if (!assessment) return null

  return (
    <main className="min-h-screen bg-vox-cream px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-vox-teal">Assessment area</Link>

        <section className="mt-7 rounded-3xl bg-vox-navy p-8 text-white md:p-10">
          <ClipboardCheck size={36} className="text-teal-300" />
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-teal-200">Knowledge check</p>
          <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">{assessment.title}</h1>
          <p className="mt-3 max-w-2xl leading-7 text-slate-300">{assessment.description}</p>
          <p className="mt-5 text-sm text-teal-200">{questions.length} questions · Your result is saved to your account</p>
        </section>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {questions.map((question, index) => (
            <section key={question.id} className="rounded-2xl border border-slate-200 bg-white p-6 md:p-7">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-bold tracking-widest text-vox-teal">QUESTION {index + 1}</p>
                <p className="text-xs text-slate-400">{Object.prototype.hasOwnProperty.call(answers, question.id) ? 'Answered' : 'Not answered'}</p>
              </div>
              <h2 className="mt-3 text-lg font-extrabold leading-7 text-vox-navy">{question.prompt}</h2>
              <div className="mt-5 space-y-3">
                {question.options.map((option, optionIndex) => (
                  <label key={optionIndex} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm transition ${answers[question.id] === optionIndex ? 'border-vox-teal bg-teal-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                    <input
                      type="radio"
                      name={question.id}
                      checked={answers[question.id] === optionIndex}
                      onChange={() => setAnswers(previous => ({ ...previous, [question.id]: optionIndex }))}
                      className="accent-teal-700"
                    />
                    <span className="text-slate-700">{option}</span>
                  </label>
                ))}
              </div>
            </section>
          ))}

          {error && <p role="alert" className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"><AlertCircle size={18} className="mt-0.5 shrink-0" />{error}</p>}

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">{Object.keys(answers).length} of {questions.length} answered</p>
            <button type="submit" disabled={submitting || Object.keys(answers).length !== questions.length} className="inline-flex items-center gap-2 rounded-xl bg-vox-navy px-6 py-3.5 text-sm font-bold text-white hover:bg-vox-teal disabled:cursor-not-allowed disabled:opacity-40">
              {submitting ? 'Submitting...' : 'Submit assessment'} <ArrowRight size={17} />
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
