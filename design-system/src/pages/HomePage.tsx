import { useEffect, useState } from 'react'
import { EditorialPanel } from '../components/EditorialPanel'
import { SectionHeading } from '../components/SectionHeading'
import { StatStrip } from '../components/StatStrip'
import { getDashboard } from '../lib/api'
import { EmptyState, ErrorState, LoadingState } from '../lib/designSystem'
import babadhamImage from '../assets/babadham.jpg'

const faces = [
  {
    title: 'Spiritual Jharkhand',
    body: 'From the ancient sanctity of Baidyanath Temple in Deoghar to the sacred calm of Basukinath, the state carries a deep devotional rhythm shaped by centuries of pilgrimage and devotion.',
    image: babadhamImage,
    alt: 'Baba Baidyanath Temple, Deoghar, Jharkhand',
  },
  {
    title: 'Nature in stillness',
    body: 'Betla National Park, Netarhat, and the forested corridors of Palamu reveal a quieter kind of grandeur—where biodiversity, water, and forest life remain in balance.',
    image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80',
    alt: 'Forested hills and a river valley',
  },
  {
    title: 'The living culture of tribal Jharkhand',
    body: 'Dance, music, storytelling, and craft carry the memory of communities whose traditions are alive in every festival, every pattern, and every hand-made form.',
    image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80',
    alt: 'A cultural gathering in a rural landscape',
  },
  {
    title: 'Adventure shaped by terrain',
    body: 'Hundru Falls, Patratu Valley, and the undulating highlands invite travellers to experience thrill without losing sight of ecology and stewardship.',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    alt: 'A dramatic waterfall and canyon landscape',
  },
]

export function HomePage() {
  const [snapshot, setSnapshot] = useState<{ stats: Array<{ label: string; value: string }> ; snapshot: { title: string; summary: string; highlights: Array<{ label: string; value: string }> } } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        setLoading(true)
        const data = await getDashboard()
        if (!cancelled) setSnapshot(data)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load dashboard')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-border bg-[#f2e4cf] shadow-sm">
        <div className="grid min-h-[60vh] items-end bg-[linear-gradient(90deg,rgba(12,15,12,0.74)_0%,rgba(12,15,12,0.24)_55%,rgba(12,15,12,0.16)_100%),url('https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
          <div className="max-w-2xl text-[#f8f2e8]">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#d9c1a0]">Official tourism platform</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              The land of sacred rivers, forested horizons, and living memory.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-[#f1e7d8] sm:text-lg">
              Discover Jharkhand through a platform that connects heritage, conservation, community knowledge, and responsible travel.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading
          eyebrow="Live tourism snapshot"
          title="A state in motion, guided by stewardship"
          intro="Tourism in Jharkhand is growing with intention—balancing visitor interest with ecological care, cultural respect, and public service."
        />
        {loading ? <LoadingState /> : error ? <ErrorState title="Live snapshot unavailable" description={error} /> : snapshot ? (
          <>
            <StatStrip items={snapshot.stats} />
            <div className="rounded-[1.25rem] border border-border bg-white/80 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">{snapshot.snapshot.title}</p>
              <p className="mt-2 text-sm leading-7 text-muted">{snapshot.snapshot.summary}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {snapshot.snapshot.highlights.map((item) => (
                  <div key={item.label} className="rounded-full border border-border bg-[#f8efe0] px-3 py-2 text-sm text-ink">
                    <span className="font-semibold">{item.value}</span> {item.label}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : <EmptyState title="No live snapshot" description="Live tourism data is temporarily not available." />}
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="Four faces of Jharkhand"
          title="A state revealed through place, ritual, and landscape"
        />
        <div className="space-y-5">
          {faces.map((face, index) => (
            <EditorialPanel
              key={face.title}
              eyebrow={index === 0 ? 'Spiritual' : index === 1 ? 'Nature' : index === 2 ? 'Culture' : 'Adventure'}
              title={face.title}
              body={face.body}
              image={face.image}
              imageAlt={face.alt}
              reverse={index % 2 === 1}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-6 rounded-[1.5rem] border border-border bg-[#fbf6ee] p-6 shadow-sm md:grid-cols-[1.15fr_0.85fr] lg:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Voices of the land</p>
          <h2 className="mt-3 text-xl font-semibold text-ink sm:text-2xl lg:text-3xl">Stories carried by elders, artisans, guides, and guardians.</h2>
          <p className="mt-4 text-base leading-7 text-muted">
            The experience of Jharkhand is not only seen from a road or a viewpoint. It is felt through conversation, continuity, and the everyday care of the communities who protect it.
          </p>
        </div>
        <div className="space-y-4">
          <div className="rounded-[1rem] border border-border bg-white/80 p-5">
            <p className="text-sm font-semibold text-ink">“We speak of rivers not as borders, but as kin.”</p>
            <p className="mt-2 text-sm text-muted">— A local guide from Netarhat</p>
          </div>
          <div className="rounded-[1rem] border border-border bg-white/80 p-5">
            <p className="text-sm font-semibold text-ink">“Every motif holds memory; every festival carries history.”</p>
            <p className="mt-2 text-sm text-muted">— Tribal artisan collective</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[1.5rem] border border-border bg-[#f7efe2] p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Journey planner preview</p>
          <h2 className="mt-3 text-xl font-semibold text-ink sm:text-2xl">Plan a route shaped by place, season, and responsibility.</h2>
          <p className="mt-4 text-sm leading-7 text-muted sm:text-base">
            Curated journeys bring together sacred destinations, forest retreats, heritage villages, and community-led experiences in a format that respects time, terrain, and local capacity.
          </p>
        </div>
        <div className="rounded-[1.5rem] border border-border bg-[#fbf6ee] p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1rem] border border-border bg-white/80 p-4">
              <p className="text-sm font-semibold text-ink">Spiritual route</p>
              <p className="mt-2 text-sm text-muted">Deoghar and Basukinath in a two-day heritage circuit.</p>
            </div>
            <div className="rounded-[1rem] border border-border bg-white/80 p-4">
              <p className="text-sm font-semibold text-ink">Forest route</p>
              <p className="mt-2 text-sm text-muted">Betla and the green corridors of Palamu.</p>
            </div>
            <div className="rounded-[1rem] border border-border bg-white/80 p-4">
              <p className="text-sm font-semibold text-ink">Highland route</p>
              <p className="mt-2 text-sm text-muted">Netarhat and the cool air of the plateau.</p>
            </div>
            <div className="rounded-[1rem] border border-border bg-white/80 p-4">
              <p className="text-sm font-semibold text-ink">Adventure route</p>
              <p className="mt-2 text-sm text-muted">Hundru Falls and Patratu Valley with safety-led guidance.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <SectionHeading
          eyebrow="Crafts of Jharkhand"
          title="Form, pattern, and memory carried in hand"
          intro="Local handicrafts speak in the language of lineage, texture, and living practice."
        />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.25rem] border border-border bg-white/80 p-5 shadow-sm">
            <h3 className="text-xl font-semibold text-ink">Terracotta and clay</h3>
            <p className="mt-2 text-sm leading-7 text-muted">Objects drawn from local soil, shaped by villages with deep ties to ritual and daily life.</p>
          </div>
          <div className="rounded-[1.25rem] border border-border bg-white/80 p-5 shadow-sm">
            <h3 className="text-xl font-semibold text-ink">Weaves and textile motifs</h3>
            <p className="mt-2 text-sm leading-7 text-muted">Patterns echoing flora, landscape, and symbolic movement inherited through generations.</p>
          </div>
          <div className="rounded-[1.25rem] border border-border bg-white/80 p-5 shadow-sm">
            <h3 className="text-xl font-semibold text-ink">Wood and bamboo craft</h3>
            <p className="mt-2 text-sm leading-7 text-muted">Functional forms and ceremonial pieces made with precision and care.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[1.5rem] border border-border bg-[#f2e4cf] p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Tourism intelligence</p>
          <h2 className="mt-3 text-xl font-semibold text-ink sm:text-2xl">A public platform designed for policy, planning, and public trust.</h2>
          <p className="mt-4 text-base leading-7 text-muted">
            The platform combines destination knowledge, environmental insight, and community participation so tourism can be both visible and responsible.
          </p>
        </div>
        <div className="rounded-[1.5rem] border border-border bg-[#fbf6ee] p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Conservation mission</p>
          <h2 className="mt-3 text-xl font-semibold text-ink sm:text-2xl">Protecting the very landscapes that make the story possible.</h2>
          <p className="mt-4 text-base leading-7 text-muted">
            Conservation is not a separate programme. It is the foundation of every route, every visit, and every long-term tourism initiative in the state.
          </p>
        </div>
      </section>
    </div>
  )
}
