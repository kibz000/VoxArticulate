import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock3,
  LoaderCircle,
  BookOpen,
  AlertCircle,
} from 'lucide-react'

import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../features/authentication/AuthContext'

interface Course {
  id: string
  slug: string
  title: string
}

interface CourseModule {
  id: string
  title: string
  position: number
}

interface Lesson {
  id: string
  course_id: string
  module_id: string
  title: string
  position: number
  content?: string | null
  description?: string | null
  duration_minutes?: number | null
  is_published?: boolean
}

interface Progress {
  user_id: string
  course_id: string
  lesson_id: string
  is_completed: boolean
  time_spent_seconds: number
  last_accessed_at: string | null
  completed_at: string | null
}

export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [course, setCourse] = useState<Course | null>(null)
  const [modules, setModules] = useState<CourseModule[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [progress, setProgress] = useState<Progress | null>(null)

  const [loading, setLoading] = useState(true)
  const [markingComplete, setMarkingComplete] = useState(false)
  const [error, setError] = useState('')

  const loadLesson = useCallback(async () => {
    if (!lessonId || !user) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    try {
      const lessonResult = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .eq('is_published', true)
        .maybeSingle()

      if (lessonResult.error) {
        throw lessonResult.error
      }

      if (!lessonResult.data) {
        setError('This lesson could not be found or is not published.')
        setLoading(false)
        return
      }

      const loadedLesson = lessonResult.data as Lesson
      setLesson(loadedLesson)

      const [
        courseResult,
        modulesResult,
        lessonsResult,
        progressResult,
      ] = await Promise.all([
        supabase
          .from('courses')
          .select('id, slug, title')
          .eq('id', loadedLesson.course_id)
          .maybeSingle(),

        supabase
          .from('course_modules')
          .select('id, title, position')
          .eq('course_id', loadedLesson.course_id)
          .order('position', { ascending: true }),

        supabase
          .from('lessons')
          .select('id, course_id, module_id, title, position')
          .eq('course_id', loadedLesson.course_id)
          .eq('is_published', true)
          .order('position', { ascending: true }),

        supabase
          .from('lesson_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('lesson_id', loadedLesson.id)
          .limit(1),
      ])

      if (courseResult.error) {
        throw courseResult.error
      }

      if (modulesResult.error) {
        throw modulesResult.error
      }

      if (lessonsResult.error) {
        throw lessonsResult.error
      }

      if (progressResult.error) {
        throw progressResult.error
      }

      setCourse(courseResult.data as Course | null)
      setModules((modulesResult.data ?? []) as CourseModule[])
      setLessons((lessonsResult.data ?? []) as Lesson[])

      setProgress(
        (progressResult.data?.[0] as Progress | undefined) ?? null,
      )
    } catch (err) {
      console.error('Error loading lesson:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong while loading this lesson.',
      )
    } finally {
      setLoading(false)
    }
  }, [lessonId, user])

  useEffect(() => {
    void loadLesson()
  }, [loadLesson])

  const sortedLessons = [...lessons].sort(
    (a, b) => a.position - b.position,
  )

  const currentLessonIndex = sortedLessons.findIndex(
    (item) => item.id === lessonId,
  )

  const previousLesson =
    currentLessonIndex > 0
      ? sortedLessons[currentLessonIndex - 1]
      : null

  const nextLesson =
    currentLessonIndex >= 0 &&
    currentLessonIndex < sortedLessons.length - 1
      ? sortedLessons[currentLessonIndex + 1]
      : null

  const handleMarkComplete = async () => {
    if (!lesson || !course || !user) {
      return
    }

    setMarkingComplete(true)
    setError('')

    const completedAt = new Date().toISOString()

    try {
      const { error: upsertError } = await supabase
        .from('lesson_progress')
        .upsert(
          {
            user_id: user.id,
            course_id: course.id,
            lesson_id: lesson.id,
            is_completed: true,
            completed_at: completedAt,
            last_accessed_at: completedAt,
          },
          {
            onConflict: 'user_id,lesson_id',
          },
        )

      if (upsertError) {
        throw upsertError
      }

      setProgress((previous) => ({
        user_id: user.id,
        course_id: course.id,
        lesson_id: lesson.id,
        is_completed: true,
        time_spent_seconds: previous?.time_spent_seconds ?? 0,
        last_accessed_at: completedAt,
        completed_at: completedAt,
      }))
    } catch (err) {
      console.error('Error marking lesson complete:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to mark this lesson as complete.',
      )
    } finally {
      setMarkingComplete(false)
    }
  }

  const handleNextLesson = () => {
    if (nextLesson) {
      navigate(`/lessons/${nextLesson.id}`)
    }
  }

  const handlePreviousLesson = () => {
    if (previousLesson) {
      navigate(`/lessons/${previousLesson.id}`)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-vox-cream px-4 py-16">
        <div className="mx-auto flex max-w-3xl items-center justify-center gap-3">
          <LoaderCircle className="h-6 w-6 animate-spin text-vox-teal" />
          <p className="text-slate-600">Loading lesson...</p>
        </div>
      </main>
    )
  }

  if (error && !lesson) {
    return (
      <main className="min-h-screen bg-vox-cream px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-white p-8">
          <div className="mb-4 flex items-center gap-3 text-red-600">
            <AlertCircle className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Unable to load lesson</h1>
          </div>

          <p className="mb-6 text-slate-600">{error}</p>

          <button
            type="button"
            onClick={() => void loadLesson()}
            className="rounded-xl bg-vox-teal px-5 py-3 font-semibold text-white transition hover:opacity-90"
          >
            Try again
          </button>
        </div>
      </main>
    )
  }

  if (!lesson) {
    return (
      <main className="min-h-screen bg-vox-cream px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8">
          <h1 className="mb-3 text-2xl font-bold text-vox-navy">
            Lesson not found
          </h1>

          <p className="mb-6 text-slate-600">
            This lesson may have been removed or is no longer available.
          </p>

          <Link
            to="/courses"
            className="inline-flex items-center gap-2 font-semibold text-vox-teal"
          >
            <ArrowLeft className="h-4 w-4" />
            Browse courses
          </Link>
        </div>
      </main>
    )
  }

  const lessonContent =
    lesson.content ||
    lesson.description ||
    'The content for this lesson has not been added yet.'

  return (
    <main className="min-h-screen bg-vox-cream">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            to={course ? `/courses/${course.slug}` : '/courses'}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-vox-teal"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to course
          </Link>

          {course && (
            <p className="text-sm font-medium text-slate-500">
              {course.title}
            </p>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* Lesson navigation */}
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-vox-teal/10 text-vox-teal">
                <BookOpen className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-bold text-vox-navy">Course lessons</h2>
                <p className="text-xs text-slate-500">
                  {sortedLessons.length} lessons
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {modules.map((courseModule) => {
                const moduleLessons = sortedLessons.filter(
                  (item) => item.module_id === courseModule.id,
                )

                if (moduleLessons.length === 0) {
                  return null
                }

                return (
                  <section key={courseModule.id}>
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                      {courseModule.title}
                    </h3>

                    <div className="space-y-1">
                      {moduleLessons.map((moduleLesson) => {
                        const isCurrent =
                          moduleLesson.id === lesson.id

                        const isCompleted =
                          isCurrent && progress?.is_completed

                        return (
                          <Link
                            key={moduleLesson.id}
                            to={`/lessons/${moduleLesson.id}`}
                            className={`flex items-start gap-3 rounded-xl px-3 py-3 text-sm transition ${
                              isCurrent
                                ? 'bg-vox-teal/10 font-semibold text-vox-teal'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-vox-teal" />
                            ) : (
                              <Circle className="mt-0.5 h-4 w-4 shrink-0" />
                            )}

                            <span>{moduleLesson.title}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </section>
                )
              })}
            </div>
          </aside>

          {/* Lesson content */}
          <article className="min-w-0">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10">
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-vox-teal/10 px-3 py-1 text-xs font-bold text-vox-teal">
                  Lesson {Math.max(currentLessonIndex + 1, 1)}
                  {sortedLessons.length > 0
                    ? ` of ${sortedLessons.length}`
                    : ''}
                </span>

                {lesson.duration_minutes && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
                    <Clock3 className="h-4 w-4" />
                    {lesson.duration_minutes} min
                  </span>
                )}
              </div>

              <h1 className="mb-6 text-3xl font-bold leading-tight text-vox-navy sm:text-4xl">
                {lesson.title}
              </h1>

              {error && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="prose prose-slate max-w-none whitespace-pre-wrap leading-8 text-slate-700">
                {lessonContent}
              </div>

              <div className="mt-10 border-t border-slate-200 pt-6">
                {progress?.is_completed ? (
                  <div className="mb-6 flex items-center gap-2 rounded-xl bg-vox-teal/10 p-4 text-sm font-semibold text-vox-teal">
                    <CheckCircle2 className="h-5 w-5" />
                    Lesson completed
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleMarkComplete}
                    disabled={markingComplete}
                    className="mb-6 inline-flex items-center justify-center gap-2 rounded-xl bg-vox-teal px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {markingComplete ? (
                      <>
                        <LoaderCircle className="h-5 w-5 animate-spin" />
                        Saving progress...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-5 w-5" />
                        Mark as complete
                      </>
                    )}
                  </button>
                )}

                <div className="flex flex-col justify-between gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handlePreviousLesson}
                    disabled={!previousLesson}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous lesson
                  </button>

                  <button
                    type="button"
                    onClick={handleNextLesson}
                    disabled={!nextLesson}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-vox-navy px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next lesson
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </main>
  )
}