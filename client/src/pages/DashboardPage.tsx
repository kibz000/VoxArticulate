
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Clock3,
  GraduationCap,
  Target,
  Trophy,
} from 'lucide-react'

const activities = [
  { title: 'Foundations of Effective Communication', progress: 65, category: 'Communication Basics' },
  { title: 'Articulation and Eloquence', progress: 30, category: 'Articulation' },
  { title: 'The Art of Public Speaking', progress: 0, category: 'Public Speaking' },
]

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-vox-cream px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-vox-teal">Your learning space</p>
            <h1 className="mt-2 text-3xl font-extrabold text-vox-navy md:text-4xl">Welcome back!</h1>
            <p className="mt-2 text-vox-muted">Continue developing your communication abilities.</p>
          </div>
          <Link to="/courses" className="flex items-center gap-2 rounded-xl bg-vox-navy px-5 py-3 font-bold text-white hover:bg-vox-teal">
            Explore courses <ArrowRight size={17} />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Enrolled courses', value: '3', icon: BookOpen },
            { label: 'Completed courses', value: '0', icon: GraduationCap },
            { label: 'Learning hours', value: '0', icon: Clock3 },
            { label: 'Achievements', value: '0', icon: Trophy },
          ].map(item => (
            <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-6">
              <item.icon className="text-vox-teal" size={25} />
              <p className="mt-5 text-3xl font-extrabold text-vox-navy">{item.value}</p>
              <p className="mt-1 text-sm text-vox-muted">{item.label}</p>
            </div>
          ))}
        </div>

        <section className="mt-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-vox-navy">Continue learning</h2>
            <Link to="/courses" className="text-sm font-bold text-vox-teal">View all courses</Link>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {activities.map(course => (
              <div key={course.title} className="rounded-2xl border border-slate-200 bg-white p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-vox-teal">{course.category}</p>
                <h3 className="mt-3 text-xl font-extrabold text-vox-navy">{course.title}</h3>
                <div className="mt-6 flex justify-between text-sm">
                  <span className="text-vox-muted">Progress</span>
                  <span className="font-bold text-vox-navy">{course.progress}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-vox-teal" style={{ width: `${course.progress}%` }} />
                </div>
                <Link to="/courses" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-vox-teal">
                  {course.progress ? 'Continue course' : 'Start course'} <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl bg-vox-navy p-8 text-white md:p-10">
          <Target size={34} className="text-teal-300" />
          <h2 className="mt-5 text-2xl font-extrabold">Your next communication goal</h2>
          <p className="mt-3 max-w-2xl leading-7 text-slate-300">Consistent practice is the foundation of confident communication. Choose a course and take another step forward.</p>
          <Link to="/academy" className="mt-6 inline-flex items-center gap-2 font-bold text-teal-200 hover:text-white">
            Explore the Learning Hub <ArrowRight size={17} />
          </Link>
        </section>
      </div>
    </main>
  )
}
