
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  Brain,
  MessageCircle,
  Mic2,
  Target,
  Users,
  Lightbulb,
  GraduationCap,
  HeartHandshake,
  Sparkles,
} from 'lucide-react'

const principles = [
  {
    icon: Brain,
    title: 'Think before you speak',
    description:
      'Develop the ability to organize your thoughts, reason critically and communicate ideas with clarity.',
  },
  {
    icon: MessageCircle,
    title: 'Communicate with purpose',
    description:
      'Learn to adapt your words, tone and delivery to different people, situations and environments.',
  },
  {
    icon: Users,
    title: 'Understand people',
    description:
      'Build social awareness, empathy and the ability to create meaningful human connections.',
  },
  {
    icon: Target,
    title: 'Practise consistently',
    description:
      'Turn knowledge into ability through deliberate practice, reflection and continuous improvement.',
  },
]

const areas = [
  {
    number: '01',
    title: 'Articulation and Eloquence',
    description:
      'Express ideas fluently, choose words effectively and communicate with precision.',
    icon: Mic2,
  },
  {
    number: '02',
    title: 'Public Speaking',
    description:
      'Develop stage confidence, presentation skills and the ability to engage an audience.',
    icon: GraduationCap,
  },
  {
    number: '03',
    title: 'Social Intelligence',
    description:
      'Navigate conversations, understand social cues and build stronger relationships.',
    icon: HeartHandshake,
  },
  {
    number: '04',
    title: 'Professional Communication',
    description:
      'Improve interviews, workplace conversations, leadership and professional presence.',
    icon: Lightbulb,
  },
]

export default function DiscoverPage() {
  return (
    <main className="overflow-hidden bg-vox-cream">

      {/* INTRODUCTORY HERO */}
      <section className="relative bg-vox-navy text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border-[55px] border-teal-400" />
          <div className="absolute -bottom-48 -left-32 h-[500px] w-[500px] rounded-full border-[65px] border-white/20" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 lg:grid-cols-2 lg:px-8 lg:py-32">

          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-teal-200">
              <Compass size={16} />
              Discover VoxArticulate
            </div>

            <h1 className="max-w-2xl text-5xl font-extrabold leading-[1.12] tracking-tight md:text-6xl">
              More than words.
              <span className="block text-teal-300">
                The power to connect.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">
              We believe effective communication is one of the most
              valuable skills a person can develop. It shapes how we
              express ourselves, understand others and influence the
              world around us.
            </p>

            <p className="mt-4 max-w-xl leading-7 text-slate-400">
              VoxArticulate exists to make the development of these
              abilities structured, practical and accessible.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/academy"
                className="inline-flex items-center gap-3 rounded-full bg-vox-teal px-7 py-4 font-bold text-white transition hover:bg-teal-600"
              >
                Explore the learning hub
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/courses"
                className="inline-flex items-center gap-3 rounded-full border border-white/30 px-7 py-4 font-bold text-white transition hover:bg-white/10"
              >
                Explore courses
              </Link>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=90"
              alt="People collaborating and communicating"
              className="h-[420px] w-full rounded-[2rem] object-cover shadow-2xl md:h-[500px]"
            />

            <div className="absolute -bottom-7 -left-4 max-w-xs rounded-2xl bg-white p-6 text-vox-navy shadow-xl md:-left-8">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-vox-teal">
                <Sparkles size={23} />
              </div>

              <p className="font-extrabold">
                Every voice has potential.
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                The right knowledge and consistent practice can help
                you unlock it.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* OUR PURPOSE */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6 text-center">

          <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.2em] text-vox-teal">
            Our purpose
          </p>

          <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-vox-navy md:text-5xl">
            Making effective communication a skill anyone can develop.
          </h2>

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-9 text-slate-500">
            Communication is not simply about having something to say.
            It involves knowing what to say, how to say it, when to say
            it and how to understand the people listening.
          </p>

          <p className="mx-auto mt-5 max-w-3xl leading-8 text-slate-500">
            Our purpose is to provide a learning environment where
            individuals can understand communication, practise it
            deliberately and progressively become more capable
            communicators in their everyday lives.
          </p>

        </div>
      </section>

      {/* VISION AND MISSION */}
      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-7 px-6 md:grid-cols-2 lg:px-8">

          <div className="rounded-3xl bg-vox-navy p-9 text-white md:p-12">
            <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-teal-300">
              <Compass size={28} />
            </div>

            <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.2em] text-teal-300">
              Our vision
            </p>

            <h2 className="text-3xl font-extrabold leading-tight">
              A world where people can express themselves with confidence
              and understanding.
            </h2>

            <p className="mt-6 leading-8 text-slate-300">
              We envision a future where communication skills are
              recognized as essential abilities and where everyone
              has an opportunity to develop them.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-vox-cream p-9 md:p-12">
            <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-vox-teal">
              <Target size={28} />
            </div>

            <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.2em] text-vox-teal">
              Our mission
            </p>

            <h2 className="text-3xl font-extrabold leading-tight text-vox-navy">
              Make communication development accessible, practical and
              meaningful.
            </h2>

            <p className="mt-6 leading-8 text-slate-500">
              We aim to achieve this through structured learning,
              practical exercises, guided development and opportunities
              to apply communication skills in real situations.
            </p>
          </div>

        </div>
      </section>

      {/* LEARNING PHILOSOPHY */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.2em] text-vox-teal">
              How we approach learning
            </p>

            <h2 className="text-4xl font-extrabold tracking-tight text-vox-navy md:text-5xl">
              Knowledge is the beginning. Practice creates progress.
            </h2>

            <p className="mt-5 leading-8 text-slate-500">
              We approach communication as a collection of learnable
              abilities that develop through understanding and consistent
              application.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((principle) => {
              const Icon = principle.icon

              return (
                <article
                  key={principle.title}
                  className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-vox-teal">
                    <Icon size={26} />
                  </div>

                  <h3 className="text-xl font-extrabold text-vox-navy">
                    {principle.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-slate-500">
                    {principle.description}
                  </p>
                </article>
              )
            })}
          </div>

        </div>
      </section>

      {/* WHAT YOU CAN DEVELOP */}
      <section className="bg-slate-100 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2 lg:px-8">

          <div>
            <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.2em] text-vox-teal">
              Areas of development
            </p>

            <h2 className="text-4xl font-extrabold leading-tight text-vox-navy md:text-5xl">
              Develop skills that matter in every area of life.
            </h2>

            <p className="mt-6 leading-8 text-slate-500">
              From everyday conversations to professional environments,
              effective communication takes different forms. Our learning
              areas are designed to help you develop a broad range of
              complementary abilities.
            </p>

            <div className="mt-8 space-y-4">
              {[
                'Express your ideas with clarity.',
                'Speak confidently in front of others.',
                'Understand people and social situations.',
                'Communicate effectively at work and in daily life.',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2
                    size={21}
                    className="mt-0.5 shrink-0 text-vox-teal"
                  />
                  <p className="font-semibold text-slate-600">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {areas.map((area) => {
              const Icon = area.icon

              return (
                <div
                  key={area.number}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <span className="text-sm font-extrabold tracking-widest text-vox-teal">
                      {area.number}
                    </span>

                    <Icon size={24} className="text-vox-teal" />
                  </div>

                  <h3 className="text-lg font-extrabold text-vox-navy">
                    {area.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {area.description}
                  </p>
                </div>
              )
            })}
          </div>

        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="bg-vox-teal px-6 py-24 text-center text-white">
        <div className="mx-auto max-w-3xl">

          <Sparkles className="mx-auto mb-6" size={36} />

          <h2 className="text-4xl font-extrabold leading-tight md:text-5xl">
            Become the communicator you want to be.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-teal-50">
            Start with what you know, build on what you learn and
            develop the confidence to express yourself effectively.
          </p>

          <Link
            to="/register"
            className="mt-9 inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 font-extrabold text-vox-navy shadow-xl transition hover:-translate-y-1 hover:bg-teal-50"
          >
            Start your journey
            <ArrowRight size={18} />
          </Link>

        </div>
      </section>

    </main>
  )
}
