import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AlertCircle, ArrowLeft, Award, CheckCircle2, RefreshCw, Target, XCircle } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../features/authentication/AuthContext'

interface Attempt {
  id: string
  assessment_id: string
  score: number
  total_questions: number
  percentage: number
  submitted_at: string
}

interface Assessment {
  title: string
  slug: string
}

interface Answer {
  question_id: string
  selected_option_index: number
  is_correct: boolean
}

interface Question {
  id: string
  prompt: string
  options: string[]
}

interface ReviewedAnswer extends Answer {
  question: Question
}

export default function ResultsPage() {
  const { assessmentId: attemptId } = useParams()
  const { user } = useAuth()
  const [attempt, setAttempt] = useState<Attempt | null>(null)
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [answers, setAnswers] = useState<ReviewedAnswer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const start = window.setTimeout(() => {
      if (!attemptId || !user) {
        setError('This assessment result could not be found.')
        setLoading(false)
        return
      }

      void (async () => {
        try {
          const { data: attemptData, error: attemptError } = await supabase
            .from('assessment_attempts')
            .select('id, assessment_id, score, total_questions, percentage, submitted_at')
            .eq('id', attemptId)
            .eq('user_id', user.id)
            .maybeSingle()

          if (attemptError) throw attemptError
          if (!attemptData) throw new Error('This result does not exist or does not belong to your account.')

          const [assessmentResult, answersResult] = await Promise.all([
            supabase
              .from('assessments')
              .select('title, slug')
              .eq('id', attemptData.assessment_id)
              .maybeSingle(),
            supabase
              .from('assessment_answers')
              .select('question_id, selected_option_index, is_correct')
              .eq('attempt_id', attemptId),
          ])

          if (assessmentResult.error) throw assessmentResult.error
          if (answersResult.error) throw answersResult.error

          const answerRows = (answersResult.data ?? []) as Answer[]
          const questionIds = answerRows.map(answer => answer.question_id)
          const { data: questionRows, error: questionError } = questionIds.length
            ? await supabase
                .from('assessment_questions')
                .select('id, prompt, options')
                .in('id', questionIds)
            : { data: [], error: null }

          if (questionError) throw questionError
          const questionMap = new Map(
            ((questionRows ?? []) as Question[]).map(question => [question.id, question]),
          )

          setAttempt(attemptData as Attempt)
          setAssessment(assessmentResult.data as Assessment | null)
          setAnswers(
            answerRows
              .map(answer => {
                const question = questionMap.get(answer.question_id)
                return question ? { ...answer, question } : null
              })
              .filter((answer): answer is ReviewedAnswer => answer !== null),
          )
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Unable to load your assessment result.')
        } finally {
          setLoading(false)
        }
      })()
    }, 0)

    return () => window.clearTimeout(start)
  }, [attemptId, user])

  if (loading) {
    return <main className="min-h-screen bg-vox-cream px-5 py-16"><div className="mx-auto flex max-w-3xl items-center justify-center gap-3 rounded-2xl bg-white p-12"><RefreshCw size={25} className="animate-spin text-vox-teal" /><p className="font-semibold text-slate-600">Loading your result...</p></div></main>
  }

  if (error || !attempt) {
    return <main className="min-h-screen bg-vox-cream px-5 py-16"><div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center"><AlertCircle size={30} className="mx-auto text-rose-500" /><h1 className="mt-4 text-2xl font-extrabold text-vox-navy">Result unavailable</h1><p className="mt-3 text-sm leading-6 text-slate-600">{error || 'No result was found.'}</p><Link to="/assessments" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-vox-navy px-5 py-3 font-bold text-white hover:bg-vox-teal"><ArrowLeft size={16} /> Back to assessments</Link></div></main>
  }

  return (
    <main className="min-h-screen bg-vox-cream px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <Link to="/assessments" className="inline-flex items-center gap-2 text-sm font-bold text-vox-teal"><ArrowLeft size={17} /> Back to assessments</Link>

        <section className="mt-7 rounded-3xl bg-vox-navy p-9 text-center text-white md:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-teal-200"><Award size={34} /></div>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-teal-200">Assessment completed</p>
          <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">{assessment?.title ?? 'Your assessment results'}</h1>
          <p className="mt-7 text-6xl font-extrabold tabular-nums">{attempt.percentage}%</p>
          <p className="mt-3 text-slate-300">{attempt.score} out of {attempt.total_questions} correct</p>
          <p className="mt-3 text-xs text-slate-400">Submitted {new Date(attempt.submitted_at).toLocaleString()}</p>
        </section>

        <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-7">
          <h2 className="text-xl font-extrabold text-vox-navy">Answer review</h2>
          <div className="mt-5 space-y-4">
            {answers.map((answer, index) => (
              <div key={answer.question_id} className="rounded-xl border border-slate-100 p-5">
                <div className="flex items-start gap-3">
                  {answer.is_correct ? <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-emerald-600" /> : <XCircle size={20} className="mt-0.5 shrink-0 text-rose-500" />}
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Question {index + 1}</p>
                    <h3 className="mt-1 font-bold leading-6 text-vox-navy">{answer.question.prompt}</h3>
                    <p className="mt-3 text-sm text-slate-600">Your answer: <span className="font-semibold text-slate-800">{answer.question.options[answer.selected_option_index] ?? 'Unavailable'}</span></p>
                    <p className={`mt-2 text-xs font-bold ${answer.is_correct ? 'text-emerald-700' : 'text-rose-600'}`}>{answer.is_correct ? 'Correct answer' : 'Review this topic'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-7 flex flex-wrap gap-4">
          <Link to={assessment?.slug ? `/assessments/${assessment.slug}` : '/assessments'} className="flex items-center gap-2 rounded-xl bg-vox-navy px-6 py-4 font-bold text-white hover:bg-vox-teal"><RefreshCw size={17} /> Try again</Link>
          <Link to="/dashboard" className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-4 font-bold text-vox-navy hover:border-vox-teal"><Target size={17} /> Dashboard</Link>
        </div>
      </div>
    </main>
  )
}
