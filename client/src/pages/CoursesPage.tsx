import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Clock3,
  Search,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'

import { supabase } from '../lib/supabaseClient'

interface Course {
  id: string
  slug: string
  title: string
  description: string | null
  category: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  access_tier: 'free' | 'premium'
  estimated_minutes: number
  is_featured: boolean
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All categories')
  const [level, setLevel] = useState('All levels')

  async function loadCourses(signal?: AbortSignal) {
    setLoading(true)
    setError('')

    try {
      const { data, error: queryError } = await supabase
        .from('courses')
        .select(
          'id, slug, title, description, category, level, access_tier, estimated_minutes, is_featured',
        )
        .eq('is_published', true)
        .order('is_featured', { ascending: false })
        .order('title', { ascending: true })
        .abortSignal(signal ?? new AbortController().signal)

      if (queryError) throw queryError
      setCourses((data ?? []) as Course[])
    } catch (err) {
      const message =
        signal?.aborted
          ? 'The course request took too long. Check your internet connection and try again.'
          : err instanceof Error
            ? err.message
            : 'Unknown error while loading courses.'

      setError(`We couldn't load the courses. ${message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 15000)

    void loadCourses(controller.signal)

    return () => {
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [])

  const categories = useMemo(
    () => [
      'All categories',
      ...Array.from(new Set(courses.map(course => course.category))).sort(),
    ],
    [courses],
  )

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase()

    return courses.filter(course => {
      const matchesSearch =
        !query ||
        course.title.toLowerCase().includes(query) ||
        (course.description ?? '').toLowerCase().includes(query) ||
        course.category.toLowerCase().includes(query)

      const matchesCategory =
        category === 'All categories' || course.category === category

      const matchesLevel = level === 'All levels' || course.level === level

      return matchesSearch && matchesCategory && matchesLevel
    })
  }, [courses, search, category, level])

  function duration(minutes: number) {
    if (minutes < 60) return `${minutes} min`

    const hours = Math.floor(minutes / 60)
    const remainder = minutes % 60

    return remainder ? `${hours} hr ${remainder} min` : `${hours} hr`
  }

  return (
    <main className="min-h-screen bg-vox-cream">
      <section className="bg-vox-navy px-5 py-16 text-white sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-300">
            Explore your potential
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-extrabold leading-tight sm:text-5xl">
            Courses that strengthen your voice and your impact.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
            Learn practical communication skills through structured lessons,
            guided practice and real-world application.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
        <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_220px_180px] md:p-5">
          <label className="relative block">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Search courses..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-vox-teal"
            />
          </label>

          <select
            value={category}
            onChange={event => setCategory(event.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-vox-teal"
          >
            {categories.map(item => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <select
            value={level}
            onChange={event => setLevel(event.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-vox-teal"
          >
            {['All levels', 'Beginner', 'Intermediate', 'Advanced'].map(
              item => (
                <option key={item}>{item}</option>
              ),
            )}
          </select>
        </div>

        {loading && (
          <div className="flex min-h-64 flex-col items-center justify-center text-center">
            <RefreshCw size={32} className="animate-spin text-vox-teal" />

            <p className="mt-4 font-semibold text-slate-600">
              Loading courses...
            </p>

            <p className="mt-2 text-sm text-slate-400">
              Connecting to the course library
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-red-200 bg-white p-7 text-center">
            <AlertCircle size={32} className="mx-auto text-red-500" />

            <h2 className="mt-4 text-xl font-extrabold text-vox-navy">
              Courses couldn't load
            </h2>

            <p className="mt-3 break-words text-sm leading-6 text-slate-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() => void loadCourses()}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-vox-navy px-5 py-3 font-bold text-white hover:bg-vox-teal"
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-500">
                {filteredCourses.length}{' '}
                {filteredCourses.length === 1 ? 'course' : 'courses'} found
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setCategory('All categories')
                  setLevel('All levels')
                }}
                className="text-sm font-bold text-vox-teal hover:underline"
              >
                Clear filters
              </button>
            </div>

            {filteredCourses.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center">
                <BookOpen size={34} className="mx-auto text-slate-300" />

                <h2 className="mt-4 text-xl font-extrabold text-vox-navy">
                  No courses found
                </h2>

                <p className="mt-2 text-slate-500">
                  Try a different search or filter.
                </p>
              </div>
            ) : (
              <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredCourses.map(course => (
                  <article
                    key={course.id}
                    className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="h-2 bg-gradient-to-r from-vox-teal to-cyan-400" />

                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-bold text-vox-teal">
                          {course.category}
                        </span>

                        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                          {course.level}
                        </span>
                      </div>

                      <h2 className="mt-5 text-xl font-extrabold leading-snug text-vox-navy">
                        {course.title}
                      </h2>

                      <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">
                        {course.description ||
                          'Build practical communication skills through guided learning and practice.'}
                      </p>

                      <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-slate-500">
                        <Clock3 size={15} />

                        {duration(course.estimated_minutes)}

                        <span className="mx-1">·</span>

                        {course.access_tier === 'free' ? 'Free' : 'Premium'}
                      </div>

                      <Link
                        to={`/courses/${course.slug}`}
                        className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-vox-navy px-5 py-3.5 text-sm font-bold text-white transition hover:bg-vox-teal"
                      >
                        View course
                        <ArrowRight size={17} />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  )
}