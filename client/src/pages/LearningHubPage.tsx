
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Brain,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Compass,
  GraduationCap,
  Lightbulb,
  MessageCircle,
  Mic2,
  Presentation,
  Sparkles,
  Target,
  Users,
} from 'lucide-react'

const learningAreas = [
  {
    title: 'Articulation & Eloquence',
    description:
      'Develop clear expression, vocabulary, fluency and the ability to communicate your ideas effectively.',
    icon: Mic2,
    lessons: 'Foundational to advanced',
    color: 'bg-teal-50 text-teal-700',
  },
  {
    title: 'Public Speaking',
    description:
      'Build confidence, structure presentations and learn to engage an audience.',
    icon: Presentation,
    lessons: 'Foundational to advanced',
    color: 'bg-blue-50 text-blue-700',
  },
  {
    title: 'Social Intelligence',
    description:
      'Understand social cues, develop empathy and navigate conversations and relationships.',
    icon: Users,
    lessons: 'Foundational to advanced',
    color: 'bg-purple-50 text-purple-700',
  },
  {
    title: 'Professional Communication',
    description:
      'Strengthen workplace communication, interviews, leadership and professional presence.',
    icon: BriefcaseBusiness,
    lessons: 'Foundational to advanced',
    color: 'bg-amber-50 text-amber-700',
  },
  {
    title: 'Critical Thinking',
    description:
      'Organize your thoughts, evaluate information and develop stronger reasoning skills.',
    icon: Brain,
    lessons: 'Foundational to advanced',
    color: 'bg-rose-50 text-rose-700',
  },
  {
    title: 'Digital Communication',
    description:
      'Communicate effectively through email, messaging, online meetings and digital platforms.',
    icon: MessageCircle,
    lessons: 'Foundational to advanced',
    color: 'bg-cyan-50 text-cyan-700',
  },
]

const learningLevels = [
  {
    level: '01',
    title: 'Beginner',
    subtitle: 'Build your foundations',
    description:
      'Understand the principles of communication and develop essential everyday skills.',
    topics: [
      'Foundations of effective communication',
      'Building speaking confidence',
      'Listening and understanding',
    ],
    color: 'border-teal-200',
    badge: 'bg-teal-50 text-teal-700',
  },
  {
    level: '02',
    title: 'Intermediate',
    subtitle: 'Strengthen your abilities',
    description:
      'Improve your expression, adapt to different situations and communicate more intentionally.',
    topics: [
      'Articulation and vocabulary development',
      'Conversation management',
      'Presentation and persuasion',
    ],
    color: 'border-blue-200',
    badge: 'bg-blue-50 text-blue-700',
  },
  {
    level: '03',
    title: 'Advanced',
    subtitle: 'Master complex communication',
    description:
      'Develop sophisticated communication strategies for challenging personal and professional situations.',
    topics: [
      'Advanced rhetoric and influence',
      'Negotiation and conflict resolution',
      'Leadership and strategic communication',
    ],
    color: 'border-purple-200',
    badge: 'bg-purple-50 text-purple-700',
  },
]

const learningSteps = [
  {
    number: '01',
    title: 'Explore',
    description:
      'Discover the communication skills you want to develop and identify your learning goals.',
    icon: Compass,
  },
  {
    number: '02',
    title: 'Understand',
    description:
      'Study concepts, explanations, examples and the principles behind effective communication.',
    icon: BookOpen,
  },
  {
    number: '03',
    title: 'Practise',
    description:
      'Apply your knowledge through activities, exercises and realistic communication scenarios.',
    icon: Target,
  },
  {
    number: '04',
    title: 'Improve',
    description:
      'Reflect on your performance, identify areas for improvement and keep developing.',
    icon: GraduationCap,
  },
]

export default function LearningHubPage() {
  return (
    <main className="overflow-hidden bg-vox-cream">

      {/* HERO */}
      <section className="relative overflow-hidden bg-vox-navy text-white">
        <div className="pointer-events-none absolute -right-32 -top-40 h-[500px] w-[500px] rounded-full border-[65px] border-white/5" />
        <div className="pointer-events-none absolute -bottom-64 -left-32 h-[500px] w-[500px] rounded-full border-[65px] border-teal-400/10" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">

          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-teal-200">
              <BookOpen size={16} />
              Your communication learning space
            </div>

            <h1 className="text-5xl font-extrabold leading-[1.12] tracking-tight md:text-6xl">
              Learn to communicate.
              <span className="mt-2 block text-teal-300">
                Grow beyond words.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">
              Explore a structured collection of communication skills,
              learning paths and practical activities designed to help
              you become a more confident and effective communicator.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="#learning-areas"
                className="inline-flex items-center gap-3 rounded-full bg-vox-teal px-7 py-4 font-bold text-white transition hover:bg-teal-600"
              >
                Explore learning areas
                <ArrowRight size={18} />
              </a>

              <Link
                to="/courses"
                className="inline-flex items-center gap-3 rounded-full border border-white/25 px-7 py-4 font-bold text-white transition hover:bg-white/10"
              >
                Browse courses
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-300">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-teal-300" />
                Learn at your pace
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-teal-300" />
                Practical development
              </span>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=90"
              alt="Learners participating in a classroom session"
              className="h-[420px] w-full rounded-[2rem] object-cover shadow-2xl md:h-[490px]"
            />

            <div className="absolute -bottom-6 -left-4 rounded-2xl bg-white p-5 text-vox-navy shadow-xl md:-left-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-vox-teal">
                  <GraduationCap size={25} />
                </div>

                <div>
                  <p className="font-extrabold">Your growth starts here</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Knowledge into practical ability
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="border-b border-slate-200 bg-white py-12">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 text-center sm:grid-cols-3 lg:px-8">

          <div>
            <BookOpen className="mx-auto mb-3 text-vox-teal" size={27} />
            <h3 className="font-extrabold text-vox-navy">
              Structured knowledge
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Learn concepts progressively, from basic principles to advanced ideas.
            </p>
          </div>

          <div>
            <Target className="mx-auto mb-3 text-vox-teal" size={27} />
            <h3 className="font-extrabold text-vox-navy">
              Practical application
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Connect what you learn with everyday communication situations.
            </p>
          </div>

          <div>
            <Sparkles className="mx-auto mb-3 text-vox-teal" size={27} />
            <h3 className="font-extrabold text-vox-navy">
              Continuous growth
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Develop your abilities through consistent learning and practice.
            </p>
          </div>

        </div>
      </section>

      {/* LEARNING AREAS */}
      <section id="learning-areas" className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.2em] text-vox-teal">
                Explore your interests
              </p>

              <h2 className="text-4xl font-extrabold tracking-tight text-vox-navy md:text-5xl">
                What would you like to learn?
              </h2>

              <p className="mt-5 leading-8 text-slate-500">
                Explore different dimensions of communication and discover
                the skills that can help you express yourself more effectively.
              </p>
            </div>

            <Link
              to="/courses"
              className="inline-flex shrink-0 items-center gap-2 font-bold text-vox-teal hover:text-vox-navy"
            >
              View course catalogue
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {learningAreas.map((area) => {
              const Icon = area.icon

              return (
                <Link
                  to="/courses"
                  key={area.title}
                  className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${area.color}`}>
                      <Icon size={27} />
                    </span>

                    <ArrowRight
                      size={20}
                      className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-vox-teal"
                    />
                  </div>

                  <h3 className="text-xl font-extrabold text-vox-navy">
                    {area.title}
                  </h3>

                  <p className="mt-3 min-h-20 text-sm leading-7 text-slate-500">
                    {area.description}
                  </p>

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-vox-teal">
                      {area.lessons}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>

        </div>
      </section>

      {/* LEARNING LEVELS */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.2em] text-vox-teal">
              Your development pathway
            </p>

            <h2 className="text-4xl font-extrabold tracking-tight text-vox-navy md:text-5xl">
              Progress at your level.
            </h2>

            <p className="mt-5 leading-8 text-slate-500">
              Develop your communication abilities through progressively
              challenging learning experiences.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {learningLevels.map((level) => (
              <article
                key={level.level}
                className={`rounded-3xl border-2 ${level.color} bg-vox-cream p-8`}
              >
                <div className="mb-7 flex items-center justify-between">
                  <span className="text-4xl font-extrabold text-slate-200">
                    {level.level}
                  </span>

                  <span className={`rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-wider ${level.badge}`}>
                    {level.title}
                  </span>
                </div>

                <h3 className="text-2xl font-extrabold text-vox-navy">
                  {level.subtitle}
                </h3>

                <p className="mt-4 min-h-20 text-sm leading-7 text-slate-500">
                  {level.description}
                </p>

                <div className="mt-7 border-t border-slate-200 pt-6">
                  <p className="mb-4 text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    What you will explore
                  </p>

                  <div className="space-y-4">
                    {level.topics.map((topic) => (
                      <div
                        key={topic}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle2
                          size={18}
                          className="mt-0.5 shrink-0 text-vox-teal"
                        />

                        <span className="text-sm font-medium text-slate-600">
                          {topic}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  to="/courses"
                  className="mt-8 flex items-center justify-between rounded-xl bg-vox-navy px-5 py-4 text-sm font-bold text-white transition hover:bg-vox-teal"
                >
                  Explore this level
                  <ArrowRight size={17} />
                </Link>
              </article>
            ))}
          </div>

          <p className="mt-7 text-center text-sm text-slate-400">
            Learning levels are an initial guide. Individual courses will
            define their own prerequisites and progression.
          </p>

        </div>
      </section>

      {/* HOW LEARNING WORKS */}
      <section className="bg-vox-navy py-24 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.2em] text-teal-300">
              The learning experience
            </p>

            <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">
              From understanding to mastery.
            </h2>

            <p className="mt-5 leading-8 text-slate-300">
              Learning should not stop at reading. Each stage should
              contribute to your ability to communicate in real life.
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {learningSteps.map((step) => {
              const Icon = step.icon

              return (
                <div key={step.number}>
                  <div className="mb-6 flex items-center justify-between">
                    <span className="text-3xl font-extrabold text-teal-300">
                      {step.number}
                    </span>

                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-teal-300">
                      <Icon size={24} />
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {step.description}
                  </p>
                </div>
              )
            })}
          </div>

        </div>
      </section>

      {/* PRACTICAL LEARNING */}
      <section className="py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2 lg:px-8">

          <div>
            <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.2em] text-vox-teal">
              Beyond theory
            </p>

            <h2 className="text-4xl font-extrabold leading-tight text-vox-navy md:text-5xl">
              Communication improves when you put it into practice.
            </h2>

            <p className="mt-6 leading-8 text-slate-500">
              The learning experience will combine structured lessons
              with opportunities to test your understanding, practise
              communication and reflect on your progress.
            </p>

            <div className="mt-8 space-y-5">
              {[
                {
                  icon: BookOpen,
                  title: 'Guided lessons',
                  description: 'Understand concepts through structured learning material.',
                },
                {
                  icon: Lightbulb,
                  title: 'Knowledge checks',
                  description: 'Test your understanding through questions and exercises.',
                },
                {
                  icon: MessageCircle,
                  title: 'Real-world scenarios',
                  description: 'Explore how communication works in practical situations.',
                },
                {
                  icon: Clock3,
                  title: 'Progressive practice',
                  description: 'Develop your abilities through repeated application.',
                },
              ].map((item) => {
                const Icon = item.icon

                return (
                  <div key={item.title} className="flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-vox-teal">
                      <Icon size={22} />
                    </span>

                    <div>
                      <h3 className="font-extrabold text-vox-navy">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=90"
              alt="Students collaborating during a learning activity"
              className="h-[520px] w-full rounded-[2rem] object-cover shadow-xl"
            />

            <div className="absolute -bottom-6 -right-3 rounded-2xl bg-white p-5 shadow-xl md:-right-7">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-vox-teal">
                  <Sparkles size={23} />
                </span>

                <div>
                  <p className="font-extrabold text-vox-navy">
                    Learn. Apply. Improve.
                  </p>

                  <p className="text-xs text-slate-500">
                    Make every lesson count
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-vox-teal px-6 py-24 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <Sparkles className="mx-auto mb-6" size={36} />

          <h2 className="text-4xl font-extrabold leading-tight md:text-5xl">
            Your learning journey begins with one step.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-teal-50">
            Discover the skills, build your knowledge and develop the
            confidence to communicate effectively.
          </p>

          <Link
            to="/courses"
            className="mt-9 inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 font-extrabold text-vox-navy shadow-xl transition hover:-translate-y-1 hover:bg-teal-50"
          >
            Explore the courses
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

    </main>
  )
}
