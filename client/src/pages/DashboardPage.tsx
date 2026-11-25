import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Clock3,
  GraduationCap,
  Target,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../features/authentication/AuthContext'

interface Enrollment {
  id: string
  course_id: string
  status: string
}

interface Course {
  id: string
  slug: string
  title: string
  category: string
}

interface Lesson {
  id: string
  course_id: string
}

interface LessonProgress {
  course_id: string
  lesson_id: string
  is_completed: boolean
  time_spent_seconds: number | null
}

interface DashboardCourse extends Course {
  progress: number
  completedLessons: number
  totalLessons: number
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<DashboardCourse[]>([])
  const [lessonsCompleted, setLessonsCompleted] = useState(0)
  const [learningSeconds, setLearningSeconds] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadDashboard = useCallback(async () => {
    if (!user) return

    setLoading(true)
    setError('')

    try {
      const { data: enrollmentRows, error: enrollmentError } = await supabase
        .from('enrollments')
        .select('id, course_id, status')
        .eq('user_id', user.id)

      if (enrollmentError) throw enrollmentError

      const enrollments = (enrollmentRows ?? []) as Enrollment[]
      const courseIds = [...new Set(enrollments.map(item => item.course_id))]

      if (courseIds.length === 0) {
        setCourses([])
        setLessonsCompleted(0)
        setLearningSeconds(0)
        return
      }

      const [courseResult, lessonResult, progressResult] = await Promise.all([
        supabase
          .from('courses')
          .select('id, slug, title, category')
          .in('id', courseIds),
        supabase
          .from('lessons')
          .select('id, course_id')
          .in('course_id', courseIds)
          .eq('is_published', true),
        supabase
          .from('lesson_progress')
          .select('course_id, lesson_id, is_completed, time_spent_seconds')
          .eq('user_id', user.id)
          .in('course_id', courseIds),
      ])

      if (courseResult.error) throw courseResult.error
      if (lessonResult.error) throw lessonResult.error
      if (progressResult.error) throw progressResult.error

      const loadedCourses = (courseResult.data ?? []) as Course[]
      const loadedLessons = (lessonResult.data ?? []) as Lesson[]
      const progressRows = (progressResult.data ?? []) as LessonProgress[]

      const progressByLesson = new Map(
        progressRows.map(item => [item.lesson_id, item]),
      )

      const courseCards = loadedCourses.map(course => {
        const courseLessons = loadedLessons.filter(
          lesson => lesson.course_id === course.id,
        )
        const completed = courseLessons.filter(
          lesson => progressByLesson.get(lesson.id)?.is_completed,
        ).length

        return {
          ...course,
          completedLessons: completed,
          totalLessons: courseLessons.length,
          progress: courseLessons.length
            ? Math.round((completed / courseLessons.length) * 100)
            : 0,
        }
      })

      setCourses(courseCards)
      setLessonsCompleted(progressRows.filter(item => item.is_completed).length)
      setLearningSeconds(
        progressRows.reduce(
          (total, item) => total + (item.time_spent_seconds ?? 0),
          0,
        ),
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load your learning activity. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    const start = window.setTimeout(() => {
      void loadDashboard()
    }, 0)
    return () => window.clearTimeout(start)
  }, [loadDashboard])

  const completedCourses = courses.filter(
    course => course.totalLessons > 0 && course.progress === 100,
  ).length
  const learningHours = Math.floor(learningSeconds / 3600)
  const learningMinutes = Math.floor((learningSeconds % 3600) / 60)

  return (
    <main className="min-h-screen bg-vox-cream px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-vox-teal">Your learning space</p>
            <h1 className="mt-2 text-3xl font-extrabold text-vox-navy md:text-4xl">
              Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}!
            </h1>
            <p className="mt-2 text-vox-muted">Your learning activity, updated from your account.</p>
          </div>
          <Link to="/courses" className="flex items-center gap-2 rounded-xl bg-vox-navy px-5 py-3 font-bold text-white hover:bg-vox-teal">
            Explore courses <ArrowRight size={17} />
          </Link>
        </div>

        {loading ? (
          <div className="mt-10 flex min-h-56 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <RefreshCw size={30} className="animate-spin text-vox-teal" />
            <p className="mt-4 font-semibold text-slate-600">Loading your learning activity...</p>
          </div>
        ) : error ? (
          <div className="mt-10 rounded-2xl border border-red-200 bg-white p-7">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle size={22} />
              <h2 className="font-bold">Dashboard data could not be loaded</h2>
            </div>
            <p className="mt-3 break-words text-sm leading-6 text-slate-600">{error}</p>
            <button type="button" onClick={() => void loadDashboard()} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-vox-navy px-5 py-3 text-sm font-bold text-white hover:bg-vox-teal">
              <RefreshCw size={16} /> Try again
            </button>
          </div>
        ) : (
          <>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Enrolled courses', value: String(courses.length), icon: BookOpen },
                { label: 'Completed courses', value: String(completedCourses), icon: GraduationCap },
                { label: 'Lessons completed', value: String(lessonsCompleted), icon: CheckCircle2 },
                { label: 'Learning time', value: learningHours ? `${learningHours}h ${learningMinutes}m` : `${learningMinutes}m`, icon: Clock3 },
              ].map(item => (
                <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-6">
                  <item.icon className="text-vox-teal" size={25} />
                  <p className="mt-5 text-3xl font-extrabold text-vox-navy">{item.value}</p>
                  <p className="mt-1 text-sm text-vox-muted">{item.label}</p>
                </div>
              ))}
            </div>

            <section className="mt-12">
              <div className="mb-6 flex items-center justify-between gap-4">
                <h2 className="text-2xl font-extrabold text-vox-navy">Your courses</h2>
                <Link to="/courses" className="text-sm font-bold text-vox-teal hover:underline">View all courses</Link>
              </div>

              {courses.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center">
                  <BookOpen size={36} className="mx-auto text-vox-teal" />
                  <h3 className="mt-4 text-xl font-extrabold text-vox-navy">Your learning journey starts here</h3>
                  <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">
                    You have not enrolled in a course yet. Explore the course library and enrol in one to see your progress here.
                  </p>
                  <Link to="/courses" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-vox-navy px-5 py-3 font-bold text-white hover:bg-vox-teal">
                    Browse courses <ArrowRight size={17} />
                  </Link>
                </div>
              ) : (
                <div className="grid gap-5 lg:grid-cols-2">
                  {courses.map(course => (
                    <article key={course.id} className="rounded-2xl border border-slate-200 bg-white p-6">
                      <p className="text-xs font-bold uppercase tracking-wider text-vox-teal">{course.category}</p>
                      <h3 className="mt-3 text-xl font-extrabold text-vox-navy">{course.title}</h3>
                      <div className="mt-6 flex justify-between text-sm">
                        <span className="text-vox-muted">Lesson progress</span>
                        <span className="font-bold text-vox-navy">{course.completedLessons}/{course.totalLessons} · {course.progress}%</span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-vox-teal transition-all" style={{ width: `${course.progress}%` }} />
                      </div>
                      <Link to={`/courses/${course.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-vox-teal hover:underline">
                        {course.progress === 100 ? 'Review course' : course.totalLessons ? 'Continue course' : 'View course'} <ArrowRight size={16} />
                      </Link>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        <section className="mt-10 rounded-3xl bg-vox-navy p-8 text-white md:p-10">
          <Target size={34} className="text-teal-300" />
          <h2 className="mt-5 text-2xl font-extrabold">Your next communication goal</h2>
          <p className="mt-3 max-w-2xl leading-7 text-slate-300">Consistent practice is the foundation of confident communication. Keep learning, complete lessons and practise speaking regularly.</p>
          <Link to="/communication-lab" className="mt-6 inline-flex items-center gap-2 font-bold text-teal-200 hover:text-white">
            Open the Communication Lab <ArrowRight size={17} />
          </Link>
        </section>
      </div>
    </main>
  )
}
