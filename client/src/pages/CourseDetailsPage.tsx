import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  GraduationCap,
  LockKeyhole,
  PlayCircle,
  RefreshCw,
} from 'lucide-react'

import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../features/authentication/AuthContext'

interface Course {
  id: string
  slug: string
  title: string
  description: string | null
  category: string
  level: string
  access_tier: string
  estimated_minutes: number
  is_featured: boolean
}

interface CourseModule {
  id: string
  course_id: string
  title: string
  description: string | null
  position: number
}

interface Lesson {
  id: string
  course_id: string
  module_id: string
  title: string
  description: string | null
  estimated_minutes: number
  position: number
}

export default function CourseDetailsPage() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()

  const [course, setCourse] = useState<Course | null>(null)
  const [modules, setModules] = useState<CourseModule[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [enrolling, setEnrolling] = useState(false)
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    if (authLoading) return

    let cancelled = false

    async function loadCourse() {
      setLoading(true)
      setError('')
      setCourse(null)
      setModules([])
      setLessons([])
      setIsEnrolled(false)

      if (!courseId) {
        setError('The course address is missing a course slug.')
        setLoading(false)
        return
      }

      try {
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select(
            'id, slug, title, description, category, level, access_tier, estimated_minutes, is_featured',
          )
          .eq('slug', courseId)
          .eq('is_published', true)
          .maybeSingle()

        if (courseError) throw courseError

        if (!courseData) {
          throw new Error('This course was not found or is not published.')
        }

        if (cancelled) return
        setCourse(courseData as Course)

        const { data: moduleData, error: moduleError } = await supabase
          .from('course_modules')
          .select('id, course_id, title, description, position')
          .eq('course_id', courseData.id)
          .order('position', { ascending: true })

        if (moduleError) throw moduleError
        if (cancelled) return

        const loadedModules = (moduleData ?? []) as CourseModule[]
        setModules(loadedModules)

        if (user) {
          const { data: enrollment, error: enrollmentError } =
            await supabase
              .from('enrollments')
              .select('id, status')
              .eq('course_id', courseData.id)
              .eq('user_id', user.id)
              .maybeSingle()

          if (enrollmentError) throw enrollmentError
          if (cancelled) return

          const active = enrollment?.status === 'active'
          setIsEnrolled(active)

          if (active) {
            const { data: lessonData, error: lessonError } = await supabase
              .from('lessons')
              .select(
                'id, course_id, module_id, title, description, estimated_minutes, position',
              )
              .eq('course_id', courseData.id)
              .eq('is_published', true)
              .order('position', { ascending: true })

            if (lessonError) throw lessonError
            if (cancelled) return

            setLessons((lessonData ?? []) as Lesson[])
          }
        }
      } catch (err) {
        if (cancelled) return

        setError(
          err instanceof Error
            ? err.message
            : 'Could not load course information. Please try again.',
        )
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadCourse()

    return () => {
      cancelled = true
    }
  }, [courseId, user, authLoading])

  const orderedLessons = useMemo(() => {
    return [...lessons].sort((a, b) => {
      const moduleA =
        modules.find(item => item.id === a.module_id)?.position ?? 0
      const moduleB =
        modules.find(item => item.id === b.module_id)?.position ?? 0

      return moduleA - moduleB || a.position - b.position
    })
  }, [lessons, modules])

  function formatDuration(minutes: number) {
    if (minutes < 60) return `${minutes} minutes`

    const hours = Math.floor(minutes / 60)
    const remaining = minutes % 60

    return remaining
      ? `${hours} hr ${remaining} min`
      : `${hours} hr`
  }

  async function handleStartLearning() {
    if (!course) return

    if (!user) {
      navigate(
        `/register?next=${encodeURIComponent(`/courses/${course.slug}`)}`,
      )
      return
    }

    setActionError('')

    if (course.access_tier !== 'free') {
      setActionError(
        'This course will be available in a future premium release.',
      )
      return
    }

    setEnrolling(true)

    try {
      if (!isEnrolled) {
        const { error: enrollmentError } = await supabase
          .from('enrollments')
          .insert({
            user_id: user.id,
            course_id: course.id,
            status: 'active',
          })

        if (enrollmentError) throw enrollmentError
      }

      const { data: lessonData, error: lessonError } = await supabase
        .from('lessons')
        .select(
          'id, course_id, module_id, title, description, estimated_minutes, position',
        )
        .eq('course_id', course.id)
        .eq('is_published', true)

      if (lessonError) throw lessonError

      const availableLessons = (lessonData ?? []) as Lesson[]

      const sorted = [...availableLessons].sort((a, b) => {
        const moduleA =
          modules.find(item => item.id === a.module_id)?.position ?? 0
        const moduleB =
          modules.find(item => item.id === b.module_id)?.position ?? 0

        return moduleA - moduleB || a.position - b.position
      })

      setIsEnrolled(true)

      if (sorted.length === 0) {
        setActionError(
          'You are enrolled, but this course has no published lessons yet.',
        )
        return
      }

      navigate(`/lessons/${sorted[0].id}`)
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : 'Could not start the course. Please try again.',
      )
    } finally {
      setEnrolling(false)
    }
  }

  if (loading || authLoading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-vox-cream">
        <div className="text-center">
          <RefreshCw
            size={34}
            className="mx-auto animate-spin text-vox-teal"
          />
          <p className="mt-4 font-semibold text-slate-600">
            Loading course information...
          </p>
        </div>
      </main>
    )
  }

  if (error || !course) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-vox-cream px-5">
        <div className="max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <h1 className="text-2xl font-extrabold text-vox-navy">
            Unable to open course
          </h1>
          <p className="mt-3 break-words text-sm leading-7 text-slate-600">
            {error || 'Course unavailable.'}
          </p>
          <Link
            to="/courses"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-vox-navy px-5 py-3 font-bold text-white hover:bg-vox-teal"
          >
            <ArrowLeft size={17} />
            Back to courses
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-vox-cream">
      <section className="relative overflow-hidden bg-vox-navy px-5 py-16 text-white sm:px-8 lg:px-12 lg:py-24">
        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-vox-teal/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <Link
            to="/courses"
            className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white"
          >
            <ArrowLeft size={17} />
            All courses
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-teal-300/15 px-4 py-2 text-xs font-bold text-teal-200">
              {course.category}
            </span>
            <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-slate-200">
              {course.level}
            </span>
            <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-slate-200">
              {course.access_tier === 'free' ? 'Free course' : 'Premium course'}
            </span>
          </div>

          <h1 className="mt-7 max-w-4xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            {course.title}
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            {course.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-300">
            <span className="flex items-center gap-2">
              <BookOpen size={18} className="text-teal-300" />
              {modules.length} modules
            </span>
            <span className="flex items-center gap-2">
              <Clock3 size={18} className="text-teal-300" />
              {formatDuration(course.estimated_minutes)}
            </span>
            <span className="flex items-center gap-2">
              <GraduationCap size={18} className="text-teal-300" />
              {course.level} level
            </span>
          </div>

          {isEnrolled && (
            <div className="mt-7 inline-flex items-center gap-2 rounded-xl border border-teal-300/30 bg-teal-300/10 px-4 py-3 text-sm font-bold text-teal-200">
              <CheckCircle2 size={18} />
              You are enrolled
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_350px] lg:px-12">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-vox-teal">
            Course curriculum
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-vox-navy">
            What you will learn
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            Follow a structured learning path designed to build your knowledge
            progressively.
          </p>

          <div className="mt-8 space-y-5">
            {modules.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-7 text-slate-600">
                Modules are being prepared for this course.
              </div>
            )}

            {modules.map((module, index) => {
              const moduleLessons = orderedLessons.filter(
                lesson => lesson.module_id === module.id,
              )

              return (
                <article
                  key={module.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="flex items-start gap-4 border-b border-slate-100 p-5 sm:p-6">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 font-extrabold text-vox-teal">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-extrabold text-vox-navy">
                        {module.title}
                      </h3>
                      {module.description && (
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {module.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {isEnrolled && moduleLessons.length > 0 ? (
                      moduleLessons.map(lesson => (
                        <Link
                          key={lesson.id}
                          to={`/lessons/${lesson.id}`}
                          className="flex items-center gap-3 px-5 py-4 transition hover:bg-slate-50 sm:px-6"
                        >
                          <PlayCircle
                            size={19}
                            className="shrink-0 text-vox-teal"
                          />
                          <span className="flex-1 text-sm font-semibold text-slate-700">
                            {lesson.title}
                          </span>
                          <span className="text-xs text-slate-400">
                            {lesson.estimated_minutes} min
                          </span>
                          <ArrowRight size={16} className="text-slate-400" />
                        </Link>
                      ))
                    ) : (
                      <div className="flex items-center gap-3 px-5 py-4 sm:px-6">
                        <LockKeyhole
                          size={17}
                          className="shrink-0 text-slate-400"
                        />
                        <span className="flex-1 text-sm text-slate-500">
                          Enrol to access lessons in this module.
                        </span>
                      </div>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        <aside className="h-fit lg:sticky lg:top-28">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-vox-teal">
              <GraduationCap size={29} />
            </div>

            <h2 className="mt-5 text-2xl font-extrabold text-vox-navy">
              {isEnrolled ? 'Continue learning' : 'Start learning'}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {isEnrolled
                ? 'Your enrolment is active. Continue with your course lessons.'
                : 'Registration is free. Enrol to access lessons and track your progress.'}
            </p>

            <div className="my-6 space-y-4 border-y border-slate-100 py-5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Access</span>
                <span className="font-bold text-vox-teal">
                  {course.access_tier === 'free' ? 'Free' : 'Premium'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Modules</span>
                <span className="font-bold text-vox-navy">{modules.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Lessons</span>
                <span className="font-bold text-vox-navy">
                  {isEnrolled ? lessons.length : 'Locked'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Duration</span>
                <span className="font-bold text-vox-navy">
                  {formatDuration(course.estimated_minutes)}
                </span>
              </div>
            </div>

            {actionError && (
              <p
                role="alert"
                className="mb-4 break-words rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                {actionError}
              </p>
            )}

            {!user && (
              <div className="space-y-3">
                <Link
                  to={`/register?next=${encodeURIComponent(`/courses/${course.slug}`)}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-vox-navy px-5 py-4 text-sm font-bold text-white hover:bg-vox-teal"
                >
                  Create free account
                  <ArrowRight size={17} />
                </Link>
                <Link
                  to={`/login?next=${encodeURIComponent(`/courses/${course.slug}`)}`}
                  className="block rounded-xl border border-slate-200 px-5 py-3.5 text-center text-sm font-bold text-vox-navy hover:border-vox-teal hover:text-vox-teal"
                >
                  Already have an account? Sign in
                </Link>
              </div>
            )}

            {user && (
              <button
                type="button"
                onClick={() => void handleStartLearning()}
                disabled={enrolling}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-vox-navy px-5 py-4 text-sm font-bold text-white hover:bg-vox-teal disabled:opacity-60"
              >
                {enrolling ? (
                  <>
                    <RefreshCw size={17} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {isEnrolled ? 'Continue course' : 'Enrol for free'}
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            )}

            <p className="mt-4 text-center text-xs leading-5 text-slate-400">
              Your learning progress is associated with your learner account.
            </p>
          </div>
        </aside>
      </section>
    </main>
  )
}