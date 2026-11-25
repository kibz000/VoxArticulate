
import { useState } from 'react'
import {
  ArrowRight,
  Mic2,
  Users,
  BriefcaseBusiness,
  Presentation,
  MessageCircle,
  Sparkles,
  Play,
  CheckCircle2,
  BookOpen,
  Target,
  Brain,
  GraduationCap,
  Quote,
  Star,
} from 'lucide-react'

const categories = [
  {
    icon: Mic2,
    title: 'Articulation & Eloquence',
    description:
      'Express your thoughts clearly, expand your vocabulary and develop a powerful speaking style.',
    image:
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=900&q=85',
    lessons: '12 learning modules',
  },
  {
    icon: Presentation,
    title: 'Public Speaking',
    description:
      'Overcome stage fright, command attention and deliver presentations with confidence.',
    image:
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=900&q=85',
    lessons: '10 learning modules',
  },
  {
    icon: Users,
    title: 'Social Intelligence',
    description:
      'Understand people, build meaningful connections and navigate different social situations.',
    image:
      'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=85',
    lessons: '14 learning modules',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Professional Communication',
    description:
      'Improve workplace conversations, interviews, negotiation and professional presence.',
    image:
      'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=85',
    lessons: '11 learning modules',
  },
]

const benefits = [
  {
    icon: BookOpen,
    title: 'Structured Learning',
    description:
      'Follow carefully organized learning paths that take you from foundational principles to advanced communication skills.',
  },
  {
    icon: Target,
    title: 'Practical Development',
    description:
      'Apply what you learn through exercises, scenarios, activities and real-world communication challenges.',
  },
  {
    icon: Brain,
    title: 'Think More Effectively',
    description:
      'Develop critical thinking, emotional awareness and the ability to organize your thoughts before speaking.',
  },
  {
    icon: GraduationCap,
    title: 'Learn at Your Pace',
    description:
      'Build your skills progressively with learning experiences designed for different levels and abilities.',
  },
]

const goals = [
  {
    id: 'confidence',
    icon: Sparkles,
    title: 'Build my confidence',
    description: 'Become more comfortable expressing myself.',
  },
  {
    id: 'speaking',
    icon: Mic2,
    title: 'Become a better speaker',
    description: 'Improve articulation, clarity and delivery.',
  },
  {
    id: 'social',
    icon: MessageCircle,
    title: 'Improve my social skills',
    description: 'Connect and communicate more effectively.',
  },
  {
    id: 'professional',
    icon: BriefcaseBusiness,
    title: 'Grow professionally',
    description: 'Communicate confidently in professional settings.',
  },
]

export default function App() {
  const [selectedGoal, setSelectedGoal] = useState('confidence')

  return (
    <div className="min-h-screen overflow-hidden bg-vox-cream">

      {/* HERO SECTION */}
      <section
        id="home"
        className="hero-section relative overflow-hidden"
      >
        <div className="hero-background-grid pointer-events-none absolute inset-0 opacity-40" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 md:py-28 lg:grid-cols-2 lg:px-8">

          <div className="hero-content">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-bold text-teal-800">
              <Sparkles size={16} />
              Your journey to confident communication starts here
            </div>

            <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.12] tracking-tight text-vox-navy sm:text-6xl lg:text-7xl">
              Your voice.
              <br />
              Your confidence.
              <br />
              <span className="text-vox-teal">Your impact.</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
              Communication is more than speaking. It is the ability to
              express ideas, connect with people, influence perspectives
              and make yourself understood.
            </p>

            <p className="mt-3 max-w-xl text-base leading-7 text-slate-500">
              Develop the skills to communicate with clarity, confidence
              and purpose through practical, structured learning.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="/academy"
                className="interactive-button inline-flex items-center gap-3 rounded-full bg-vox-navy px-7 py-4 font-bold text-white shadow-xl shadow-slate-900/10 transition hover:bg-vox-teal"
              >
                Explore the learning hub
                <ArrowRight size={18} />
              </a>

              <a
                href="#how-it-works"
                className="inline-flex items-center gap-3 rounded-full border border-slate-300 bg-white px-7 py-4 font-bold text-vox-navy transition hover:border-vox-teal hover:text-vox-teal"
              >
                <Play size={17} />
                How it works
              </a>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-vox-teal" size={19} />
                <span className="text-sm font-semibold text-slate-600">
                  Free to get started
                </span>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-vox-teal" size={19} />
                <span className="text-sm font-semibold text-slate-600">
                  Learn at your pace
                </span>
              </div>
            </div>
          </div>

          <div className="hero-image relative">
            <div className="absolute -left-8 top-12 h-40 w-40 rounded-full bg-teal-200/50 blur-3xl" />
            <div className="absolute -right-8 bottom-0 h-48 w-48 rounded-full bg-blue-200/50 blur-3xl" />

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=90"
                alt="Speaker addressing an audience at an event"
                className="h-[420px] w-full rounded-[2rem] object-cover shadow-2xl md:h-[540px]"
              />

              <div className="absolute -bottom-7 -left-4 max-w-xs rounded-2xl border border-white/70 bg-white/95 p-5 shadow-xl backdrop-blur-md md:-left-10">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-vox-teal">
                    <Mic2 size={21} />
                  </span>

                  <div>
                    <p className="text-sm font-extrabold text-vox-navy">
                      Find your voice
                    </p>
                    <p className="text-xs text-slate-500">
                      Develop your communication
                    </p>
                  </div>
                </div>

                <p className="text-sm leading-6 text-slate-600">
                  Every great communicator starts somewhere. Your journey
                  begins with one conversation.
                </p>
              </div>

              <div className="absolute -right-3 top-8 rounded-2xl bg-white p-4 shadow-xl md:-right-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <Star size={20} fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-vox-navy">
                      Growth starts here
                    </p>
                    <p className="text-xs text-slate-500">
                      One skill at a time
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* INTRODUCTION STRIP */}
      <section className="border-y border-slate-200 bg-white py-10">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 text-center sm:grid-cols-3 lg:px-8">

          <div>
            <p className="text-3xl font-extrabold text-vox-navy">
              Clarity
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Say what you mean, effectively.
            </p>
          </div>

          <div>
            <p className="text-3xl font-extrabold text-vox-navy">
              Confidence
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Express yourself without hesitation.
            </p>
          </div>

          <div>
            <p className="text-3xl font-extrabold text-vox-navy">
              Connection
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Create meaningful human interactions.
            </p>
          </div>

        </div>
      </section>

      {/* CATEGORIES */}
      <section id="explore" className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.2em] text-vox-teal">
              Explore your potential
            </p>

            <h2 className="text-4xl font-extrabold tracking-tight text-vox-navy md:text-5xl">
              Master the art of communication
            </h2>

            <p className="mt-5 leading-8 text-slate-500">
              Develop essential communication abilities across different
              areas of life, from everyday conversations to professional
              environments.
            </p>
          </div>

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => {
              const Icon = category.icon

              return (
                <a
                  href="/courses"
                  key={category.title}
                  className="interactive-card group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-vox-dark/70 to-transparent" />

                    <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-vox-teal shadow-lg">
                      <Icon size={23} />
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-extrabold text-vox-navy">
                      {category.title}
                    </h3>

                    <p className="mt-3 min-h-20 text-sm leading-6 text-slate-500">
                      {category.description}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-xs font-semibold text-slate-400">
                        {category.lessons}
                      </span>

                      <ArrowRight
                        size={18}
                        className="text-vox-teal transition group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </a>
              )
            })}
          </div>

          <div className="mt-12 text-center">
            <a
              href="/courses"
              className="inline-flex items-center gap-2 font-bold text-vox-teal hover:text-vox-navy"
            >
              Explore all courses
              <ArrowRight size={18} />
            </a>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="bg-vox-navy py-24 text-white"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.2em] text-teal-300">
              Your learning journey
            </p>

            <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">
              Progress with purpose
            </h2>

            <p className="mt-5 leading-8 text-slate-300">
              A structured approach that helps you turn communication
              knowledge into practical ability.
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-3">

            {[
              {
                number: '01',
                title: 'Discover',
                description:
                  'Identify your communication goals and explore the skills you want to develop.',
                icon: Target,
              },
              {
                number: '02',
                title: 'Learn',
                description:
                  'Build your knowledge through structured lessons, examples and guided activities.',
                icon: BookOpen,
              },
              {
                number: '03',
                title: 'Practise',
                description:
                  'Apply your learning through practical exercises and real-life communication scenarios.',
                icon: Mic2,
              },
            ].map((step) => {
              const Icon = step.icon

              return (
                <div key={step.number} className="relative text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/10 text-teal-300">
                    <Icon size={34} />
                  </div>

                  <p className="mb-3 text-sm font-extrabold tracking-widest text-teal-300">
                    STEP {step.number}
                  </p>

                  <h3 className="text-2xl font-extrabold">
                    {step.title}
                  </h3>

                  <p className="mx-auto mt-4 max-w-sm leading-7 text-slate-300">
                    {step.description}
                  </p>
                </div>
              )
            })}

          </div>
        </div>
      </section>

      {/* WHY VOXARTICULATE */}
      <section id="about" className="py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:px-8">

          <div>
            <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.2em] text-vox-teal">
              Why VoxArticulate?
            </p>

            <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-vox-navy md:text-5xl">
              Communication is a skill.
              <span className="text-vox-teal">
                {' '}Make it your strength.
              </span>
            </h2>

            <p className="mt-6 leading-8 text-slate-500">
              Effective communication influences how we learn, work,
              build relationships and participate in society. Yet these
              skills are rarely developed systematically.
            </p>

            <p className="mt-4 leading-8 text-slate-500">
              VoxArticulate is designed to make communication development
              accessible through structured learning, practical application
              and continuous improvement.
            </p>

            <a
              href="/about"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-vox-navy px-7 py-4 font-bold text-white transition hover:bg-vox-teal"
            >
              Discover our approach
              <ArrowRight size={18} />
            </a>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {benefits.map((benefit) => {
              const Icon = benefit.icon

              return (
                <div
                  key={benefit.title}
                  className="interactive-card rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-vox-teal">
                    <Icon size={24} />
                  </div>

                  <h3 className="text-lg font-extrabold text-vox-navy">
                    {benefit.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {benefit.description}
                  </p>
                </div>
              )
            })}
          </div>

        </div>
      </section>

      {/* PERSONAL LEARNING GOAL */}
      <section className="bg-slate-100 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2 lg:px-8">

          <div>
            <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.2em] text-vox-teal">
              Make it personal
            </p>

            <h2 className="text-4xl font-extrabold leading-tight text-vox-navy md:text-5xl">
              What would you like to improve?
            </h2>

            <p className="mt-5 max-w-lg leading-8 text-slate-500">
              Everyone has a different communication journey. Start by
              identifying the area you would most like to develop.
            </p>

            <div className="mt-8 space-y-3">
              {goals.map((goal) => {
                const Icon = goal.icon
                const selected = selectedGoal === goal.id

                return (
                  <button
                    type="button"
                    key={goal.id}
                    onClick={() => setSelectedGoal(goal.id)}
                    className={`goal-option flex w-full items-center gap-4 rounded-2xl border p-5 text-left transition ${
                      selected
                        ? 'border-vox-teal bg-white shadow-md'
                        : 'border-slate-200 bg-white/60 hover:border-teal-300 hover:bg-white'
                    }`}
                  >
                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                        selected
                          ? 'bg-vox-teal text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      <Icon size={22} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block font-extrabold text-vox-navy">
                        {goal.title}
                      </span>

                      <span className="mt-1 block text-sm text-slate-500">
                        {goal.description}
                      </span>
                    </span>

                    {selected && (
                      <CheckCircle2
                        className="shrink-0 text-vox-teal"
                        size={22}
                      />
                    )}
                  </button>
                )
              })}
            </div>

            <a
              href={`/register?goal=${selectedGoal}`}
              className="mt-7 inline-flex items-center gap-3 rounded-full bg-vox-navy px-7 py-4 font-bold text-white shadow-lg transition hover:bg-vox-teal"
            >
              Begin my journey
              <ArrowRight size={18} />
            </a>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1100&q=85"
              alt="People enjoying a conversation together"
              className="h-[480px] w-full rounded-[2rem] object-cover shadow-xl"
            />

            <div className="absolute -bottom-6 -left-5 max-w-xs rounded-2xl bg-white p-6 shadow-xl">
              <Quote size={27} className="mb-3 text-vox-teal" />

              <p className="text-sm font-semibold leading-7 text-vox-navy">
                The way you communicate can change the way the world
                experiences your ideas.
              </p>

              <p className="mt-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                The VoxArticulate philosophy
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="relative overflow-hidden bg-vox-teal py-24 text-white">
        <div className="pointer-events-none absolute -right-20 -top-32 h-96 w-96 rounded-full border-[60px] border-white/10" />
        <div className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full border-[60px] border-white/10" />

        <div className="relative mx-auto max-w-4xl px-6 text-center">

          <Sparkles className="mx-auto mb-6" size={38} />

          <h2 className="text-4xl font-extrabold leading-tight md:text-6xl">
            Your next conversation could change everything.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-teal-50">
            Start developing the confidence, clarity and communication
            skills that help you make a lasting impression.
          </p>

          <a
            href="/register"
            className="mt-9 inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 font-extrabold text-vox-navy shadow-xl transition hover:-translate-y-1 hover:bg-teal-50"
          >
            Start learning for free
            <ArrowRight size={19} />
          </a>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-vox-dark py-14 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

            <div className="lg:col-span-2">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-vox-teal text-white">
                  <Mic2 size={23} />
                </span>

                <span className="text-xl font-extrabold">
                  Vox<span className="text-teal-400">Articulate</span>
                </span>
              </div>

              <p className="mt-6 max-w-md leading-7 text-slate-400">
                A learning platform dedicated to helping people become
                confident, articulate and effective communicators.
              </p>
            </div>

            <div>
              <h3 className="mb-5 font-extrabold">Explore</h3>

              <div className="flex flex-col gap-3 text-sm text-slate-400">
                <a href="/about" className="hover:text-teal-300">
                  About us
                </a>
                <a href="/academy" className="hover:text-teal-300">
                  Learning Hub
                </a>
                <a href="/courses" className="hover:text-teal-300">
                  Courses
                </a>
              </div>
            </div>

            <div>
              <h3 className="mb-5 font-extrabold">Get started</h3>

              <div className="flex flex-col gap-3 text-sm text-slate-400">
                <a href="/register" className="hover:text-teal-300">
                  Create an account
                </a>
                <a href="/login" className="hover:text-teal-300">
                  Sign in
                </a>
                <a href="/dashboard" className="hover:text-teal-300">
                  My learning space
                </a>
              </div>
            </div>

          </div>

          <div className="mt-12 flex flex-col justify-between gap-4 border-t border-white/10 pt-7 text-sm text-slate-500 sm:flex-row">
            <p>
              © {new Date().getFullYear()} VoxArticulate. All rights reserved.
            </p>

            <p>
              Your voice. Your confidence. Your impact.
            </p>
          </div>

        </div>
      </footer>

    </div>
  )
}
