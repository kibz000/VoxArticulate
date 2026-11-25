
import { Link } from 'react-router-dom'
import { ArrowLeft, Award, CheckCircle2, RotateCcw, Target } from 'lucide-react'

export default function ResultsPage() {
  const score = 2
  const total = 3
  const percentage = Math.round((score / total) * 100)

  return (
    <main className="min-h-screen bg-vox-cream px-6 py-14">
      <div className="mx-auto max-w-3xl">
        <Link to="/assessments" className="inline-flex items-center gap-2 text-sm font-bold text-vox-teal">
          <ArrowLeft size={17} /> Back to assessments
        </Link>

        <section className="mt-7 rounded-3xl bg-vox-navy p-9 text-center text-white md:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-teal-200">
            <Award size={34} />
          </div>
          <p className="mt-6 text-sm font-bold uppercase tracking-widest text-teal-200">Assessment completed</p>
          <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">Your learning results</h1>
          <p className="mt-7 text-6xl font-extrabold">{percentage}%</p>
          <p className="mt-3 text-slate-300">{score} out of {total} questions answered correctly</p>
        </section>

        <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-7">
          <h2 className="text-xl font-extrabold text-vox-navy">Performance overview</h2>
          <div className="mt-6 space-y-5">
            <div>
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-slate-700">Correct answers</span>
                <span className="font-bold text-vox-teal">{score}/{total}</span>
              </div>
              <div className="mt-2 h-3 rounded-full bg-slate-100">
                <div className="h-3 rounded-full bg-vox-teal" style={{ width: `${percentage}%` }} />
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl bg-teal-50 p-4">
              <CheckCircle2 className="mt-0.5 shrink-0 text-vox-teal" size={20} />
              <div>
                <p className="font-bold text-vox-navy">Keep building your skills</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">Review the concepts you found difficult and practise again to strengthen your understanding.</p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-7 flex flex-wrap gap-4">
          <Link to="/assessments" className="flex items-center gap-2 rounded-xl bg-vox-navy px-6 py-4 font-bold text-white hover:bg-vox-teal">
            <RotateCcw size={17} /> Try again
          </Link>
          <Link to="/dashboard" className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-4 font-bold text-vox-navy hover:border-vox-teal">
            <Target size={17} /> Dashboard
          </Link>
        </div>
      </div>
    </main>
  )
}
