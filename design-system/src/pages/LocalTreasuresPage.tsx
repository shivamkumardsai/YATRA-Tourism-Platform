import { Link } from 'react-router-dom'
import { Badge, Button, Card } from '../lib/designSystem'
import { artisans, craftCategories } from '../data/artisans'

const workshops = [
  { place: 'Ranchi artisan cluster', time: 'Weekdays 10:00–17:00' },
  { place: 'Hazaribagh cultural centre', time: 'Weekends 11:00–16:00' },
  { place: 'Latehar village workshop', time: 'By prior arrangement' },
]

const products = [
  'Ceremonial dokra figurines',
  'Sohrai wall panels',
  'Bamboo baskets and serving trays',
  'Lac-inlay accessories',
  'Handwoven shawls and duppattas',
]

const impactStats = [
  { label: 'Households supported', value: '320+' },
  { label: 'Craft clusters engaged', value: '18' },
  { label: 'Women-led workshops', value: '12' },
  { label: 'Community-led visits', value: '36' },
]

const guidance = [
  'Ask about the story behind the craft before purchasing.',
  'Choose pieces that are made by local artisans or cooperatives.',
  'Respect workshop spaces, photography boundaries, and cultural protocols.',
]

export function LocalTreasuresPage() {
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-border bg-[#f2e4cf] shadow-sm">
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Local Treasures</p>
            <h1 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">The people behind Jharkhand’s living crafts.</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-muted">
              This is not a marketplace. It is a cultural exhibition that honours the hands, practices, and communities shaping traditional craft in the state.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/local-treasures">
                <Button>Meet the Artisan</Button>
              </Link>
              <Link to="/journey-planner">
                <Button variant="secondary">Plan a Cultural Visit</Button>
              </Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-[1.5rem] border border-border bg-white/70 p-3">
            <img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80" alt="Artisan at work with traditional craft" className="h-[320px] w-full rounded-[1.1rem] object-cover" />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Featured artisan stories</p>
        <div className="grid gap-4 lg:grid-cols-3">
          {artisans.map((artisan) => (
            <Card key={artisan.name} variant="outline" className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-xl font-semibold text-ink">{artisan.name}</h2>
                <Badge variant="info">{artisan.craft}</Badge>
              </div>
              <p className="text-sm leading-7 text-muted">{artisan.story}</p>
              <p className="text-sm font-semibold text-ink">{artisan.location}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card variant="outline" className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Craft categories</p>
          <div className="space-y-3">
            {craftCategories.map((craft) => (
              <div key={craft.name} className="rounded-[1.1rem] border border-border bg-[#f8efe0] p-4">
                <h3 className="text-lg font-semibold text-ink">{craft.name}</h3>
                <p className="mt-2 text-sm leading-7 text-muted">{craft.note}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card variant="outline" className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Workshop locations</p>
          <div className="space-y-3">
            {workshops.map((item) => (
              <div key={item.place} className="rounded-[1.1rem] border border-border bg-white/80 p-4">
                <p className="font-semibold text-ink">{item.place}</p>
                <p className="mt-2 text-sm text-muted">{item.time}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card variant="outline" className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Featured handcrafted products</p>
          <ul className="space-y-2 text-sm leading-7 text-muted">
            {products.map((item) => <li key={item}>• {item}</li>)}
          </ul>
        </Card>
        <Card variant="outline" className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Community impact statistics</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {impactStats.map((stat) => (
              <div key={stat.label} className="rounded-[1.1rem] border border-border bg-[#f8efe0] p-4">
                <p className="text-2xl font-semibold text-ink">{stat.value}</p>
                <p className="mt-1 text-sm text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card variant="outline" className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Responsible shopping guidance</p>
          <ul className="space-y-2 text-sm leading-7 text-muted">
            {guidance.map((item) => <li key={item}>• {item}</li>)}
          </ul>
        </Card>
        <div className="rounded-[1.5rem] border border-border bg-[#f8efe0] p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">A cultural visit</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">Let the experience begin with listening, learning, and respect.</h2>
          <p className="mt-3 text-sm leading-7 text-muted">Each craft carries history, community, and a form of knowledge worth preserving beyond the object itself.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/local-treasures">
              <Button>Meet the Artisan</Button>
            </Link>
            <Link to="/journey-planner">
              <Button variant="secondary">Plan a Cultural Visit</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
