
type PlaceholderPageProps = {
  title: string
  description: string
}

export default function PlaceholderPage({
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <main className="min-h-screen bg-vox-cream px-6 py-24">
      <div className="mx-auto max-w-4xl text-center">

        <p className="mb-4 text-sm font-bold uppercase tracking-widest text-vox-teal">
          VOXARTICULATE
        </p>

        <h1 className="mb-5 text-4xl font-extrabold text-vox-navy md:text-6xl">
          {title}
        </h1>

        <p className="text-lg leading-8 text-vox-muted">
          {description}
        </p>

      </div>
    </main>
  )
}
