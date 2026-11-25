
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, ClipboardCheck } from 'lucide-react'

const questions = [
  {
    question: 'Which statement best describes communication?',
    options: [
      'The process of exchanging information and meaning.',
      'The act of speaking loudly.',
      'The process of memorising information.',
      'The ability to write long messages.',
    ],
    answer: 0,
  },
  {
    question: 'Which element allows a receiver to respond to a message?',
    options: ['Encoding', 'Feedback', 'Noise', 'Channel'],
    answer: 1,
  },
  {
    question: 'Which of the following is an example of non-verbal communication?',
    options: ['Writing an email', 'Giving a speech', 'Maintaining eye contact', 'Reading a book'],
    answer: 2,
  },
]

export default function AssessmentsPage() {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)

  const score = questions.reduce(
    (total, question, index) => total + (answers[index] === question.answer ? 1 : 0),
    0,
  )

  return (
    <main className="min-h-screen bg-vox-cream px-6 py-14">
      <div className="mx-auto max-w-4xl">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-vox-teal">
          Assessment area
        </Link>

        <div className="mt-7 rounded-3xl bg-vox-navy p-8 text-white md:p-10">
          <ClipboardCheck size={36} className="text-teal-300" />
          <h1 className="mt-5 text-3xl font-extrabold md:text-4xl">Communication Foundations Assessment</h1>
          <p className="mt-3 leading-7 text-slate-300">Test your understanding of the basic principles of effective communication.</p>
          <p className="mt-5 text-sm text-teal-200">{questions.length} questions · Sample assessment</p>
        </div>

        <div className="mt-8 space-y-6">
          {questions.map((question, index) => (
            <section key={question.question} className="rounded-2xl border border-slate-200 bg-white p-6">
              <p className="text-sm font-bold text-vox-teal">QUESTION {index + 1}</p>
              <h2 className="mt-3 text-lg font-extrabold text-vox-navy">{question.question}</h2>
              <div className="mt-5 space-y-3">
                {question.options.map((option, optionIndex) => (
                  <label key={option} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm ${answers[index] === optionIndex ? 'border-vox-teal bg-teal-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                    <input
                      type="radio"
                      name={`question-${index}`}
                      checked={answers[index] === optionIndex}
                      disabled={submitted}
                      onChange={() => setAnswers(previous => ({ ...previous, [index]: optionIndex }))}
                      className="accent-teal-700"
                    />
                    {option}
                  </label>
                ))}
              </div>
              {submitted && (
                <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-vox-teal">
                  <CheckCircle2 size={17} /> Correct answer: {question.options[question.answer]}
                </p>
              )}
            </section>
          ))}
        </div>

        {submitted ? (
          <div className="mt-8 rounded-2xl bg-teal-50 p-7">
            <h2 className="text-2xl font-extrabold text-vox-navy">Your result: {score}/{questions.length}</h2>
            <p className="mt-2 text-slate-700">You answered {score} questions correctly.</p>
            <Link to="/results/sample-assessment" className="mt-5 inline-flex items-center gap-2 font-bold text-vox-teal">
              View results <ArrowRight size={17} />
            </Link>
            <button onClick={() => { setAnswers({}); setSubmitted(false) }} className="ml-5 mt-5 font-bold text-vox-navy underline">
              Try again
            </button>
          </div>
        ) : (
          <button
            disabled={Object.keys(answers).length !== questions.length}
            onClick={() => setSubmitted(true)}
            className="mt-8 flex items-center gap-2 rounded-xl bg-vox-navy px-7 py-4 font-bold text-white hover:bg-vox-teal disabled:cursor-not-allowed disabled:opacity-40"
          >
            Submit assessment <ArrowRight size={18} />
          </button>
        )}
      </div>
    </main>
  )
}
