import { useEffect, useMemo, useState } from 'react'
import { getDestinations } from '../lib/api'
import { Card, EmptyState, ErrorState, LoadingState } from '../lib/designSystem'
import type { Destination as DestinationFromAPI } from './JourneyPlannerPage'

const filters = ['All', 'Sacred', 'Wildlife', 'Highlands', 'Waterfalls'] as const

type FilterValue = (typeof filters)[number]

type DestinationRecord = DestinationFromAPI & {
  id: string
  name: string
  region: string
  category: string
  image?: string
  story: string
  history: string
  culture: string
  bestTime: string
  nearbyAttractions: string[]
  localFood: string[]
  artisans: string[]
  travelTips: string[]
  responsibleTips: string[]
  ecoScore: number
  difficulty: string
  budget: string
}

type PanelView = 'essentials' | 'culture' | 'impact'

export function ExplorePage() {
  const [destinations, setDestinations] = useState<DestinationRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<FilterValue>('All')
  const [selectedDestinationId, setSelectedDestinationId] = useState('')
  const [panelView, setPanelView] = useState<PanelView>('essentials')

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getDestinations()
        if (cancelled) return
        setDestinations(data)
        setSelectedDestinationId(data[0]?.id ?? '')
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load destinations')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const filteredDestinations = useMemo(() => {
    if (activeFilter === 'All') return destinations
    return destinations.filter((destination) => destination.category === activeFilter)
  }, [activeFilter, destinations])

  useEffect(() => {
    if (!filteredDestinations.some((destination) => destination.id === selectedDestinationId)) {
      setSelectedDestinationId(filteredDestinations[0]?.id ?? '')
    }
  }, [filteredDestinations, selectedDestinationId])

  const selectedDestination = filteredDestinations.find((destination) => destination.id === selectedDestinationId) ?? filteredDestinations[0] ?? null

  if (loading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState title="Unable to load destinations" description={error} />
  }

  if (!selectedDestination) {
    return <EmptyState title="No destinations available" description="Destination data is currently unavailable." />
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 border-b border-border/80 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Explore Jharkhand</p>
          <h1 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">An editorial guide to the state’s most resonant destinations.</h1>
          <p className="mt-3 text-base leading-7 text-muted">
            This is not a catalogue. It is a slower way of discovering Jharkhand—through history, ecology, craft, and responsible travel.
          </p>
        </div>
        <div className="rounded-full border border-border bg-white/80 px-4 py-2 text-sm text-muted">
          {selectedDestination.region} • {selectedDestination.category}
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[240px_minmax(0,1fr)_320px]">
        <aside className="xl:sticky xl:top-6 xl:self-start">
          <div className="rounded-[1.5rem] border border-border bg-[#f8efe0] p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-ink">Filter the journey</h2>
            <p className="mt-2 text-sm leading-6 text-muted">Choose a lens for the place you want to understand.</p>
            <div className="mt-4 space-y-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`w-full rounded-full border px-3 py-2 text-left text-sm transition ${activeFilter === filter ? 'border-river bg-river text-white' : 'border-border bg-white/80 text-ink hover:border-river/70 hover:text-river'}`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="mt-6 border-t border-border/80 pt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Destination list</p>
              <div className="mt-3 space-y-2">
                {filteredDestinations.map((destination) => (
                  <button
                    key={destination.id}
                    type="button"
                    onClick={() => setSelectedDestinationId(destination.id)}
                    className={`w-full rounded-2xl border px-3 py-3 text-left text-sm transition ${selectedDestination.id === destination.id ? 'border-river bg-white text-ink shadow-sm' : 'border-transparent bg-white/60 text-muted hover:border-border hover:text-ink'}`}
                  >
                    <span className="block font-semibold">{destination.name}</span>
                    <span className="mt-1 block text-xs uppercase tracking-[0.2em] text-river">{destination.region}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <section className="space-y-6">
          <article className="overflow-hidden rounded-[2rem] border border-border bg-[#fcf8f1] shadow-sm">
            <img src={selectedDestination.image ?? 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1500&q=80'} alt={selectedDestination.name} className="h-[340px] w-full object-cover sm:h-[430px]" />
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.32em] text-river">
                <span>{selectedDestination.region}</span>
                <span className="h-1 w-1 rounded-full bg-river/60" />
                <span>{selectedDestination.category}</span>
              </div>
              <h2 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">{selectedDestination.name}</h2>
              <p className="mt-4 max-w-3xl text-base leading-8 text-muted">{selectedDestination.story}</p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.25rem] border border-border bg-[#f4e7cf] p-5">
                  <h3 className="text-lg font-semibold text-ink">History</h3>
                  <p className="mt-2 text-sm leading-7 text-muted">{selectedDestination.history}</p>
                </div>
                <div className="rounded-[1.25rem] border border-border bg-white/80 p-5">
                  <h3 className="text-lg font-semibold text-ink">Culture</h3>
                  <p className="mt-2 text-sm leading-7 text-muted">{selectedDestination.culture}</p>
                </div>
              </div>
            </div>
          </article>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.25rem] border border-border bg-[#fbf6ee] p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-ink">Nearby attractions</h3>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-muted">
                {selectedDestination.nearbyAttractions.map((item) => <li key={item}>• {item}</li>)}
              </ul>
            </div>
            <div className="rounded-[1.25rem] border border-border bg-[#fbf6ee] p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-ink">Local food</h3>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-muted">
                {selectedDestination.localFood.map((item) => <li key={item}>• {item}</li>)}
              </ul>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-border bg-[#f8efe0] p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-ink">What the place asks of a traveller</h3>
            <p className="mt-3 text-sm leading-7 text-muted">The most memorable journeys here come from paying attention—to weather, ritual, local rhythms, and the need to travel lightly.</p>
          </div>
        </section>

        <aside className="xl:sticky xl:top-6 xl:self-start">
          <Card variant="outline" className="bg-[#fcf8f1] p-5 shadow-sm">
            <div className="flex rounded-full border border-border bg-white/80 p-1">
              {[
                { id: 'essentials', label: 'Essentials' },
                { id: 'culture', label: 'Culture' },
                { id: 'impact', label: 'Impact' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setPanelView(tab.id as PanelView)}
                  className={`flex-1 rounded-full px-3 py-2 text-sm transition ${panelView === tab.id ? 'bg-river text-white' : 'text-muted hover:text-ink'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="mt-5 space-y-4">
              {panelView === 'essentials' && (
                <>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Best time</p>
                    <p className="mt-2 text-sm leading-7 text-muted">{selectedDestination.bestTime}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Difficulty</p>
                    <p className="mt-2 text-sm leading-7 text-muted">{selectedDestination.difficulty}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Estimated budget</p>
                    <p className="mt-2 text-sm leading-7 text-muted">{selectedDestination.budget}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Travel tips</p>
                    <ul className="mt-2 space-y-2 text-sm leading-7 text-muted">
                      {selectedDestination.travelTips.map((item: string) => <li key={item}>• {item}</li>)}
                    </ul>
                  </div>
                </>
              )}

              {panelView === 'culture' && (
                <>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Local artisans</p>
                    <ul className="mt-2 space-y-2 text-sm leading-7 text-muted">
                      {selectedDestination.artisans.map((item: string) => <li key={item}>• {item}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Cultural note</p>
                    <p className="mt-2 text-sm leading-7 text-muted">Craft, ritual, and hospitality remain central to the experience here, and the best encounters tend to be local and unhurried.</p>
                  </div>
                </>
              )}

              {panelView === 'impact' && (
                <>
                  <div className="rounded-[1.25rem] border border-border bg-[#f4e7cf] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Eco score</p>
                    <p className="mt-2 text-3xl font-semibold text-ink">{selectedDestination.ecoScore}/10</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Responsible tourism tips</p>
                    <ul className="mt-2 space-y-2 text-sm leading-7 text-muted">
                      {selectedDestination.responsibleTips.map((item: string) => <li key={item}>• {item}</li>)}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  )
}
