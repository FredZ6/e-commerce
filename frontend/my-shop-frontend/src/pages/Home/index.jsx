import { Link } from 'react-router-dom'

const highlights = [
  {
    title: 'Editorially Curated',
    description: 'Our buyers select every listing for craftsmanship, utility, and long-term value.',
  },
  {
    title: 'Fast Fulfillment',
    description: 'Priority dispatch and traceable logistics for a frictionless delivery experience.',
  },
  {
    title: 'Trusted Quality',
    description: 'Transparent details and verified sourcing so each purchase is a confident choice.',
  },
]

const featureCollections = [
  {
    id: 'desk',
    name: 'Desk Essentials',
    description: 'Clean silhouettes for productive workspaces.',
    image:
      'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'living',
    name: 'Living Upgrades',
    description: 'Elevated textures for everyday comfort.',
    image:
      'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'travel',
    name: 'Travel Kits',
    description: 'Designed to move with you in style.',
    image:
      'https://images.unsplash.com/photo-1524492449090-1a2b30a1e0f4?auto=format&fit=crop&w=900&q=80',
  },
]

export default function Home() {
  return (
    <div className="space-y-10 pb-4">
      <section className="section-frame relative overflow-hidden p-8 sm:p-10 lg:p-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(21,94,239,0.18),transparent_50%),radial-gradient(circle_at_bottom_right,rgba(201,167,93,0.2),transparent_45%)]" />
        <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="animate-fade-up">
            <span className="chip">Spring 2026 Issue</span>
            <h1 className="mt-5 text-balance text-4xl sm:text-5xl lg:text-6xl">
              Shop like an editor. Live like a collector.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[color:var(--brand-muted)] sm:text-lg">
              E-Shop blends commerce and curation. Discover practical products with magazine-grade storytelling,
              clear specifications, and reliable delivery.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/products" className="button-primary">
                Explore products
              </Link>
              <Link to="/orders" className="button-secondary">
                Review my orders
              </Link>
            </div>
          </div>

          <div className="animate-fade-delay grid gap-3 rounded-2xl border border-white/40 bg-white/70 p-5 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--brand-muted)]">
              This week at a glance
            </p>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-white/90 p-3">
                <p className="text-2xl font-semibold">120+</p>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[color:var(--brand-muted)]">Products</p>
              </div>
              <div className="rounded-xl bg-white/90 p-3">
                <p className="text-2xl font-semibold">24h</p>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[color:var(--brand-muted)]">Dispatch</p>
              </div>
              <div className="rounded-xl bg-white/90 p-3">
                <p className="text-2xl font-semibold">4.9</p>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[color:var(--brand-muted)]">Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {highlights.map((item, index) => (
          <article key={item.title} className={`section-frame p-6 animate-fade-up`} style={{ animationDelay: `${index * 0.08}s` }}>
            <p className="text-lg font-semibold">{item.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-[color:var(--brand-muted)]">{item.description}</p>
          </article>
        ))}
      </section>

      <section className="section-frame p-6 sm:p-8">
        <div className="section-header">
          <div>
            <h2 className="section-title">Featured Collections</h2>
            <p className="section-subtitle mt-2">A tailored feed of product stories built for practical lifestyles.</p>
          </div>
          <Link to="/products" className="button-secondary">
            View all products
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {featureCollections.map((collection) => (
            <article key={collection.id} className="card-lift overflow-hidden p-0">
              <img src={collection.image} alt={collection.name} className="h-48 w-full object-cover" loading="lazy" />
              <div className="p-5">
                <h3 className="text-xl">{collection.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--brand-muted)]">{collection.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
