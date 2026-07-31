import { Link } from 'react-router-dom'
import { Badge, Button, Card } from '../lib/designSystem'
import { featuredDestination } from '../data/destinations'

const gallery = [
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&w=1200&q=80',
]

const nearby = featuredDestination.nearbyAttractions
const cuisine = featuredDestination.localFood
const crafts = featuredDestination.artisans
const guidelines = featuredDestination.responsibleTips
const accessibility = [
  'Main temple routes are manageable for most visitors.',
  'Some paths involve steps and uneven surfaces.',
  'Wheelchair assistance can be requested in advance.',
]

export function ExperiencesPage() {
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-border bg-[#f2e4cf] shadow-sm">
        <img src={featuredDestination.heroImage ?? featuredDestination.image} alt="Temple and sacred landscape in Jharkhand" className="h-[340px] w-full object-cover sm:h-[440px]" />
        <div className="p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.32em] text-river">
            <span>Deoghar</span>
            <span className="h-1 w-1 rounded-full bg-river/60" />
            <span>Santhal Pargana</span>
          </div>
          <h1 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">{featuredDestination.name}</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-muted">
            Deoghar is a destination where pilgrimage, geography, and local life are woven together. The city carries both ceremonial grandeur and an everyday intimacy that defines the experience of visiting Jharkhand.
          </p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-6">
          <Card variant="outline" className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Overview</p>
            <h2 className="text-2xl font-semibold text-ink">A destination shaped by faith, geography, and continuity.</h2>
            <p className="text-base leading-8 text-muted">
              {featuredDestination.story}
            </p>
          </Card>

          <Card variant="outline" className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Historical and cultural significance</p>
            <p className="text-base leading-8 text-muted">
              {featuredDestination.history}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="info">Ancient pilgrimage</Badge>
              <Badge>Temple traditions</Badge>
              <Badge>Local fairs</Badge>
            </div>
          </Card>

          <Card variant="outline" className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Best time to visit</p>
            <p className="text-base leading-8 text-muted">{featuredDestination.bestTime}</p>
          </Card>

          <Card variant="outline" className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Timings and entry information</p>
            <div className="space-y-2 text-sm leading-7 text-muted">
              <p><span className="font-semibold text-ink">Temple hours:</span> Early morning to late evening, with seasonal variations.</p>
              <p><span className="font-semibold text-ink">Entry:</span> General access for visitors; some rituals may require specific entry routes.</p>
              <p><span className="font-semibold text-ink">Dress code:</span> Modest attire is recommended.</p>
            </div>
          </Card>
        </section>

        <aside className="space-y-6">
          <Card variant="elevated" className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Quick facts</p>
            <div className="space-y-3 text-sm text-muted">
              <p><span className="font-semibold text-ink">Region:</span> Santhal Pargana</p>
              <p><span className="font-semibold text-ink">Highlights:</span> Temple circuit, sacred hills, local fairs</p>
              <p><span className="font-semibold text-ink">Ideal for:</span> Cultural immersion and spiritual travel</p>
              <p><span className="font-semibold text-ink">Travel style:</span> Comfortable, reflective, local</p>
            </div>
          </Card>

          <Card variant="outline" className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Interactive map placeholder</p>
            <div className="flex h-48 items-center justify-center rounded-[1.25rem] border border-dashed border-border bg-[#f8efe0] text-sm text-muted">
              {/* Map view will appear here. */}
            </div>
          </Card>
        </aside>
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card variant="outline" className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Nearby attractions</p>
          <ul className="space-y-2 text-sm leading-7 text-muted">
            {nearby.map((item: string) => <li key={item}>• {item}</li>)}
          </ul>
        </Card>
        <Card variant="outline" className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Local cuisine</p>
          <ul className="space-y-2 text-sm leading-7 text-muted">
            {cuisine.map((item: string) => <li key={item}>• {item}</li>)}
          </ul>
        </Card>
        <Card variant="outline" className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Local handicrafts</p>
          <ul className="space-y-2 text-sm leading-7 text-muted">
            {crafts.map((item: string) => <li key={item}>• {item}</li>)}
          </ul>
        </Card>
        <Card variant="outline" className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Responsible tourism guidelines</p>
          <ul className="space-y-2 text-sm leading-7 text-muted">
            {guidelines.map((item: string) => <li key={item}>• {item}</li>)}
          </ul>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card variant="outline" className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Accessibility information</p>
          <ul className="space-y-2 text-sm leading-7 text-muted">
            {accessibility.map((item: string) => <li key={item}>• {item}</li>)}
          </ul>
        </Card>
        <Card variant="outline" className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Image gallery</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {gallery.map((image: string) => (
              <img key={image} src={image} alt="Destination visual" className="h-32 w-full rounded-[1rem] object-cover" />
            ))}
          </div>
        </Card>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] border border-border bg-[#f8efe0] p-6 shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Plan the journey</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">Let this place become part of a wider route through Jharkhand.</h2>
        </div>
        <Link to="/journey-planner">
          <Button>Plan My Journey</Button>
        </Link>
      </div>
    </div>
  )
}
