import { useEffect, useMemo, useState } from 'react'
import { createJourney, getDestinations } from '../lib/api'
import { Alert } from '../lib/designSystem'
import { Badge, Button, Card, EmptyState, ErrorState } from '../lib/designSystem'

type StepKey = 'welcome' | 'purpose' | 'days' | 'budget' | 'group' | 'interests' | 'transport' | 'accessibility' | 'generate'

type JourneyState = {
  purpose: string
  days: string
  budget: string
  group: string
  interests: string[]
  transport: string
  accessibility: string[]
}

export type Destination = {
  id: string
  name: string
  region: string
  category: string
  story: string
  budget: string
  travelTips: string[]
  ecoScore: number
  bestTime: string
  difficulty: string
}

const purposeOptions = [
  { value: 'Cultural immersion', label: 'Cultural immersion', note: 'Temples, crafts, local stories, and festival rhythms.' },
  { value: 'Nature and slow travel', label: 'Nature and slow travel', note: 'Forests, waterfalls, viewpoints, and quiet time.' },
  { value: 'Family celebration', label: 'Family celebration', note: 'Comfortable routes, heritage stops, and easy pacing.' },
  { value: 'Adventure with meaning', label: 'Adventure with meaning', note: 'Hikes, river crossings, and responsible outdoor planning.' },
]

const dayOptions = [
  { value: '3', label: '3 days' },
  { value: '4', label: '4 days' },
  { value: '5', label: '5 days' },
  { value: '7', label: '7 days' },
]

const budgetOptions = [
  { value: 'Value', label: 'Value' },
  { value: 'Mid-range', label: 'Mid-range' },
  { value: 'Comfort', label: 'Comfort' },
]

const groupOptions = [
  { value: 'Solo', label: 'Solo' },
  { value: 'Couple', label: 'Couple' },
  { value: 'Friends', label: 'Friends' },
  { value: 'Family', label: 'Family' },
]

const interestOptions = [
  'Sacred landscapes',
  'Wildlife and forests',
  'Tribal culture',
  'Photography',
  'Food and markets',
  'Village stays',
  'Waterfalls and viewpoints',
]

const transportOptions = [
  { value: 'Private car', label: 'Private car' },
  { value: 'Train and road', label: 'Train and road' },
  { value: 'Local bus and taxi', label: 'Local bus and taxi' },
  { value: 'Cycling and walking', label: 'Cycling and walking' },
]

const accessibilityOptions = [
  'Step-free paths preferred',
  'Low walking days',
  'Wheelchair-friendly access',
  'Quiet, less crowded stops',
]

const getInitialState = (): JourneyState => ({
  purpose: 'Cultural immersion',
  days: '4',
  budget: 'Mid-range',
  group: 'Friends',
  interests: ['Sacred landscapes', 'Food and markets'],
  transport: 'Private car',
  accessibility: ['Step-free paths preferred'],
})

type ItineraryData = {
  title: string
  intro: string
  days: Array<{ day: string; place: string; focus: string; note: string }>
}

type EnrichedItinerary = ItineraryData & {
  estimatedBudget: string
  suggestedTransport: string
  travelTips: string[]
  packingList: string[]
  weatherNote: string
  ecoScore: number
}

const generatePackingList = (state: JourneyState): string[] => {
  const list = new Set<string>()
  list.add('Comfortable walking shoes')
  list.add('Reusable water bottle')
  list.add('Basic first-aid kit')

  if (parseInt(state.days, 10) > 4) {
    list.add('Portable charger/power bank')
  }

  if (state.interests.includes('Photography')) {
    list.add('Camera and extra batteries')
  }
  if (state.interests.includes('Wildlife and forests')) {
    list.add('Binoculars')
    list.add('Insect repellent')
  }
  if (state.interests.includes('Waterfalls and viewpoints')) {
    list.add('Rain jacket or poncho')
  }
  if (state.interests.includes('Sacred landscapes')) {
    list.add('Modest clothing for temples')
  }
  if (state.transport === 'Cycling and walking') {
    list.add('Daypack')
  }

  return Array.from(list)
}

const generateDynamicIntro = (state: JourneyState, itinerary: ItineraryData): string => {
  const destinationNames = Array.from(new Set(itinerary.days.map(d => d.place)))
  let destinationStr = ''
  if (destinationNames.length > 1) {
    destinationStr = `${destinationNames.slice(0, -1).join(', ')}, and ${destinationNames.slice(-1)}`
  } else {
    destinationStr = destinationNames[0] || 'Jharkhand'
  }

  return `This ${state.days}-day journey, crafted for a ${state.group.toLowerCase()} seeking ${state.purpose.toLowerCase()}, will take you through the heart of ${destinationStr}. With a focus on ${state.interests.join(' and ')}, your route is designed for a ${state.budget.toLowerCase()} budget and paced for discovery using your preferred ${state.transport.toLowerCase()}.`
}

const ThinkingIndicator = () => (
  <div className="space-y-4 rounded-[1.5rem] border border-border bg-white/80 p-6 text-center">
    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-river/20 border-t-river" />
    <h3 className="text-lg font-semibold text-ink">Composing your journey...</h3>
    <p className="text-sm text-muted">Our AI assistant is analyzing your preferences to craft a personalized and responsible itinerary. This might take a moment.</p>
  </div>
)

const GeneratingIndicator = () => (
  <div className="space-y-4 rounded-[1.5rem] border border-border bg-white/80 p-6 text-center">
    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-river/20 border-t-river" />
    <h3 className="text-lg font-semibold text-ink">Generating Itinerary</h3>
    <p className="text-sm text-muted">Finalizing the details of your personalized journey. Almost there!</p>
  </div>
)

export function JourneyPlannerPage() {
  const [stepIndex, setStepIndex] = useState(0)
  const [state, setState] = useState<JourneyState>(getInitialState)
  const [generated, setGenerated] = useState(false)
  const [itineraryData, setItineraryData] = useState<EnrichedItinerary | null>(null)
  const [isThinking, setIsThinking] = useState(false)
  const [itineraryLoading, setItineraryLoading] = useState(false)
  const [itineraryError, setItineraryError] = useState<string | null>(null)
  const [allDestinations, setAllDestinations] = useState<Destination[]>([])

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        const data = await getDestinations()
        setAllDestinations(data)
      } catch (e) {
        console.error('Failed to load destination data for enrichment', e)
      }
    }
    void loadDestinations()
  }, [])

  const steps: Array<{ key: StepKey; title: string; description: string }> = [
    { key: 'welcome', title: 'Welcome', description: 'Let us begin with the feeling you want this journey to carry.' },
    { key: 'purpose', title: 'Travel purpose', description: 'Choose the story this trip should tell.' },
    { key: 'days', title: 'Number of days', description: 'How much time do you want to leave open for unhurried discovery?' },
    { key: 'budget', title: 'Budget', description: 'We will tune the pace and comfort around what feels right.' },
    { key: 'group', title: 'Group type', description: 'A solo reflection, a family route, or a shared adventure.' },
    { key: 'interests', title: 'Interests', description: 'Choose the themes that should shape the itinerary.' },
    { key: 'transport', title: 'Preferred transport', description: 'The route should feel natural for your preferred rhythm.' },
    { key: 'accessibility', title: 'Accessibility', description: 'We can soften the journey for comfort and ease.' },
    { key: 'generate', title: 'Generate Journey', description: 'We are ready to compose the route for you.' },
  ]

  const progress = useMemo(() => Math.round(((stepIndex + 1) / steps.length) * 100), [stepIndex, steps.length])

  const toggleInterest = (value: string) => {
    setState(current => ({
      ...current,
      interests: current.interests.includes(value) ? current.interests.filter(item => item !== value) : [...current.interests, value],
    }));
  }

  const toggleAccessibility = (value: string) => {
    setState((current) => ({
      ...current,
      accessibility: current.accessibility.includes(value)
        ? current.accessibility.filter((item) => item !== value)
        : [...current.accessibility, value],
    }))
  }

  const goNext = async () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex((current) => current + 1)
      return
    }

    setIsThinking(true)
    // Simulate AI thinking time
    setTimeout(() => {
      setIsThinking(false)
      generateItinerary()
    }, 2000)
  }

  const generateItinerary = async () => {
    setItineraryLoading(true)
    setItineraryError(null)
    try {
      const data = await createJourney(state)
      const dynamicIntro = generateDynamicIntro(state, data)

      // --- Enrich itinerary data on the frontend ---
      const numDays = parseInt(state.days, 10) || 1
      const destinationNames = new Set(data.days.map((d) => d.place))
      const selectedDestinations = allDestinations.filter((d) => destinationNames.has(d.name))

      let totalMinBudget = 0
      let totalMaxBudget = 0
      let ecoScoreSum = 0
      const travelTips = new Set<string>()
      const weatherNotes = new Set<string>()

      selectedDestinations.forEach((dest) => {
        const budgetMatch = dest.budget.match(/₹([\d,]+)–₹([\d,]+)/)
        if (budgetMatch) {
          totalMinBudget += parseInt(budgetMatch[1].replace(/,/g, ''), 10)
          totalMaxBudget += parseInt(budgetMatch[2].replace(/,/g, ''), 10)
        }
        ecoScoreSum += dest.ecoScore
        dest.travelTips.slice(0, 2).forEach((tip) => travelTips.add(tip))
        weatherNotes.add(`${dest.name}: ${dest.bestTime}`)
      })

      const formatCurrency = (num: number) => `₹${num.toLocaleString('en-IN')}`
      const estimatedBudget = `${formatCurrency(totalMinBudget * numDays)} – ${formatCurrency(totalMaxBudget * numDays)} for ${numDays} days`
      const packingList = generatePackingList(state)
      const averageEcoScore = selectedDestinations.length > 0 ? Math.round((ecoScoreSum / selectedDestinations.length) * 10) / 10 : 0

      const enrichedData: EnrichedItinerary = {
        ...data,
        intro: dynamicIntro,
        estimatedBudget,
        suggestedTransport: state.transport,
        travelTips: Array.from(travelTips),
        packingList,
        weatherNote: `Based on your destinations, here are the best times to travel: ${Array.from(weatherNotes).join('; ')}.`,
        ecoScore: averageEcoScore,
      }

      setItineraryData(enrichedData)
      setGenerated(true)
    } catch (error) {
      setItineraryError(error instanceof Error ? error.message : 'Unable to create itinerary')
    } finally {
      setItineraryLoading(false)
    }
  }

  const goBack = () => {
    if (stepIndex > 0) {
      setStepIndex((current) => current - 1)
    }
  }

  const renderStep = () => {
    const currentStep = steps[stepIndex]

    if (currentStep.key === 'welcome') {
      return (
        <div className="space-y-5">
          <div className="rounded-[1.5rem] border border-border bg-[#f4e7cf] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Conversations before coordinates</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">We are shaping a journey that feels personal, grounded, and beautifully paced.</h2>
            <p className="mt-3 text-sm leading-7 text-muted">Tell us what matters most, and we will compose a route that balances heritage, nature, comfort, and care.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-[1.25rem] border border-border bg-white/80 p-4">
              <p className="text-sm font-semibold text-ink">Gentle planning</p>
              <p className="mt-2 text-sm leading-7 text-muted">A few thoughtful choices are enough to shape the route.</p>
            </div>
            <div className="rounded-[1.25rem] border border-border bg-white/80 p-4">
              <p className="text-sm font-semibold text-ink">Mock-ready itinerary</p>
              <p className="mt-2 text-sm leading-7 text-muted">The route below is a rich, presentable draft for now.</p>
            </div>
          </div>
        </div>
      )
    }

    if (currentStep.key === 'purpose') {
      return (
        <div className="space-y-4">
          {purposeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setState((current) => ({ ...current, purpose: option.value }))}
              className={`w-full rounded-[1.25rem] border p-4 text-left transition ${state.purpose === option.value ? 'border-river bg-river/10 shadow-sm' : 'border-border bg-white/80 hover:border-river/50'}`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-base font-semibold text-ink">{option.label}</span>
                <Badge variant="info">Recommended</Badge>
              </div>
              <p className="mt-2 text-sm leading-7 text-muted">{option.note}</p>
            </button>
          ))}
        </div>
      )
    }

    if (currentStep.key === 'days') {
      return (
        <div className="grid gap-3 md:grid-cols-2">
          {dayOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setState((current) => ({ ...current, days: option.value }))}
              className={`rounded-[1.25rem] border p-4 text-left transition ${state.days === option.value ? 'border-river bg-river/10' : 'border-border bg-white/80 hover:border-river/50'}`}
            >
              <p className="text-base font-semibold text-ink">{option.label}</p>
              <p className="mt-2 text-sm leading-7 text-muted">A paced route that leaves room for rest.</p>
            </button>
          ))}
        </div>
      )
    }

    if (currentStep.key === 'budget') {
      return (
        <div className="grid gap-3 md:grid-cols-3">
          {budgetOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setState((current) => ({ ...current, budget: option.value }))}
              className={`rounded-[1.25rem] border p-4 text-left transition ${state.budget === option.value ? 'border-river bg-river/10' : 'border-border bg-white/80 hover:border-river/50'}`}
            >
              <p className="text-base font-semibold text-ink">{option.label}</p>
              <p className="mt-2 text-sm leading-7 text-muted">{option.value === 'Value' ? 'Practical stays and local transport.' : option.value === 'Mid-range' ? 'Comfortable stays with a few curated experiences.' : 'Ease, privacy, and premium pacing.'}</p>
            </button>
          ))}
        </div>
      )
    }

    if (currentStep.key === 'group') {
      return (
        <div className="grid gap-3 md:grid-cols-2">
          {groupOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setState((current) => ({ ...current, group: option.value }))}
              className={`rounded-[1.25rem] border p-4 text-left transition ${state.group === option.value ? 'border-river bg-river/10' : 'border-border bg-white/80 hover:border-river/50'}`}
            >
              <p className="text-base font-semibold text-ink">{option.label}</p>
              <p className="mt-2 text-sm leading-7 text-muted">{option.value === 'Solo' ? 'A reflective and flexible itinerary.' : option.value === 'Couple' ? 'Romantic pauses and quieter stops.' : option.value === 'Friends' ? 'Shared highlights and playful pacing.' : 'Child-friendly timing and comfort.'}</p>
            </button>
          ))}
        </div>
      )
    }

    if (currentStep.key === 'interests') {
      return (
        <div className="flex flex-wrap gap-3">
          {interestOptions.map((option) => {
            const active = state.interests.includes(option)
            return (
              <button
                key={option}
                type="button"
                onClick={() => toggleInterest(option)}
                className={`rounded-full border px-4 py-2 text-sm transition ${active ? 'border-river bg-river text-white' : 'border-border bg-white/80 text-ink hover:border-river/60'}`}
              >
                {option}
              </button>
            )
          })}
        </div>
      )
    }

    if (currentStep.key === 'transport') {
      return (
        <div className="space-y-3">
          {transportOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setState((current) => ({ ...current, transport: option.value }))}
              className={`flex w-full items-center justify-between rounded-[1.25rem] border p-4 text-left transition ${state.transport === option.value ? 'border-river bg-river/10' : 'border-border bg-white/80 hover:border-river/50'}`}
            >
              <span className="text-base font-semibold text-ink">{option.label}</span>
              <span className="text-sm text-muted">{option.value === 'Private car' ? 'Best for flexibility' : option.value === 'Train and road' ? 'Best for longer legs' : option.value === 'Local bus and taxi' ? 'Best for affordability' : 'Best for immersive travel'}</span>
            </button>
          ))}
        </div>
      )
    }

    if (currentStep.key === 'accessibility') {
      return (
        <div className="flex flex-wrap gap-3">
          {accessibilityOptions.map((option) => {
            const active = state.accessibility.includes(option)
            return (
              <button
                key={option}
                type="button"
                onClick={() => toggleAccessibility(option)}
                className={`rounded-full border px-4 py-2 text-sm transition ${active ? 'border-river bg-river text-white' : 'border-border bg-white/80 text-ink hover:border-river/60'}`}
              >
                {option}
              </button>
            )
          })}
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <div className="rounded-[1.25rem] border border-border bg-white/80 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-river">Ready to compose</p>
          <p className="mt-3 text-base leading-8 text-muted">This draft will combine your selected purpose, pace, transport, and comfort needs into a thoughtful itinerary.</p>
        </div>
        <div className="rounded-[1.25rem] border border-border bg-[#f4e7cf] p-5">
          <p className="text-sm font-semibold text-ink">Your selection summary</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="info">{state.purpose}</Badge>
            <Badge>{state.days} days</Badge>
            <Badge>{state.budget}</Badge>
            <Badge>{state.group}</Badge>
            {state.interests.map((interest) => <Badge key={interest}>{interest}</Badge>)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="rounded-[2rem] border border-border bg-[linear-gradient(135deg,#f6ebd6_0%,#fcf8f1_100%)] p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Journey Composer</p>
            <h1 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">A guided planning experience for journeys that feel considered, not rushed.</h1>
            <p className="mt-3 text-base leading-7 text-muted">The flow is conversational and elegant, designed to feel more like a trusted companion than a form.</p>
          </div>
          <div className="rounded-full border border-border bg-white/80 px-4 py-2 text-sm text-muted">
            {progress}% complete
          </div>
        </div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/80">
          <div className="h-full rounded-full bg-river transition-all" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card variant="elevated" className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Step {stepIndex + 1} of {steps.length}</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">{steps[stepIndex].title}</h2>
            <p className="mt-2 text-sm leading-7 text-muted">{steps[stepIndex].description}</p>
          </div>

          {renderStep()}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-4">
            <Button variant="ghost" onClick={goBack} disabled={stepIndex === 0} className={stepIndex === 0 ? 'opacity-50' : ''}>
              Back
            </Button>
            <Button onClick={goNext}>
              {stepIndex === steps.length - 1 ? 'Generate Journey' : 'Continue'}
            </Button>
          </div>
        </Card>

        <div className="space-y-4">
          <Card variant="outline" className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Your compass</p>
              <h3 className="mt-2 text-xl font-semibold text-ink">A fit for your preferences</h3>
            </div>
            <div className="space-y-2 text-sm text-muted">
              <p><span className="font-semibold text-ink">Purpose:</span> {state.purpose}</p>
              <p><span className="font-semibold text-ink">Length:</span> {state.days} days</p>
              <p><span className="font-semibold text-ink">Budget:</span> {state.budget}</p>
              <p><span className="font-semibold text-ink">Group:</span> {state.group}</p>
              <p><span className="font-semibold text-ink">Transport:</span> {state.transport}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {state.interests.map((interest) => <Badge key={interest}>{interest}</Badge>)}
            </div>
          </Card>

          <Card variant="outline" className="bg-[#f8efe0]">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Mock guidance</p>
            <p className="mt-2 text-sm leading-7 text-muted">Your generated route is a polished editorial draft for now, built to demonstrate the experience’s tone and structure.</p>
          </Card>
        </div>
      </div>

      {generated && (
        <div id="itinerary-output">
          <Card variant="elevated" className="space-y-6">
          {isThinking ? <ThinkingIndicator /> : itineraryLoading ? <GeneratingIndicator /> : itineraryError ? <ErrorState title="Itinerary unavailable" description={itineraryError} /> : itineraryData ? (
            <>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Your Personalised Itinerary</p>
                <h2 className="mt-2 text-2xl font-semibold text-ink">{itineraryData.title}</h2>
                <p className="mt-2 text-sm leading-7 text-muted">{itineraryData.intro}</p>
              </div>
              <div className="mt-4">
                <Alert variant="success" title="AI Travel Advisory">This itinerary balances your interests with responsible travel practices. The calculated eco-score of {itineraryData.ecoScore}/10 reflects a commitment to minimizing environmental impact. We recommend booking accommodations with local partners where possible.</Alert>
              </div>
              <div className="relative space-y-5 pl-6 before:absolute before:left-2 before:top-0 before:h-full before:w-px before:bg-border">
                {itineraryData.days.map((item, index) => (
                  <div key={item.day} className="relative rounded-[1.25rem] border border-border bg-[#fbf6ee] p-5">
                    <div className="absolute -left-[1.1rem] top-5 h-4 w-4 rounded-full border-4 border-[#f7efe3] bg-river" />
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-river">{item.day}</p>
                        <h3 className="mt-2 text-lg font-semibold text-ink">{item.place}</h3>
                      </div>
                      <Badge variant={index % 2 === 0 ? 'success' : 'info'}>{item.focus}</Badge>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-muted">{item.note}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 pt-4 md:grid-cols-2 lg:grid-cols-3">
                <Card variant="outline" className="space-y-3 bg-[#fbf6ee]">
                  <h3 className="text-base font-semibold text-ink">Estimated Budget</h3>
                  <p className="text-2xl font-semibold text-river">{itineraryData.estimatedBudget}</p>
                  <p className="text-xs text-muted">Covers accommodation, local transport, and meals based on your '{state.budget}' preference.</p>
                </Card>
                <Card variant="outline" className="space-y-3 bg-[#fbf6ee]">
                  <h3 className="text-base font-semibold text-ink">Suggested Transport</h3>
                  <p className="text-2xl font-semibold text-river">{itineraryData.suggestedTransport}</p>
                  <p className="text-xs text-muted">Chosen for the best balance of comfort, pace, and immersion for your journey.</p>
                </Card>
                <Card variant="outline" className="space-y-3 bg-[#f4e7cf]">
                  <h3 className="text-base font-semibold text-ink">Eco Score Summary</h3>
                  <p className="text-2xl font-semibold text-river">{itineraryData.ecoScore} / 10</p>
                  <p className="text-xs text-muted">An average score based on the destinations in your itinerary, reflecting their commitment to responsible tourism.</p>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card variant="outline" className="space-y-3">
                  <h3 className="text-base font-semibold text-ink">AI-Generated Packing List</h3>
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted">
                    {itineraryData.packingList.map(item => <li key={item}>• {item}</li>)}
                  </ul>
                </Card>
                <Card variant="outline" className="space-y-3">
                  <h3 className="text-base font-semibold text-ink">Curated Travel Tips</h3>
                  <ul className="space-y-2 text-sm text-muted">
                    {itineraryData.travelTips.map(item => <li key={item}>• {item}</li>)}
                  </ul>
                </Card>
              </div>
              <div className="rounded-[1.25rem] border border-border bg-white/80 p-5">
                <p className="text-sm leading-7 text-muted"><span className="font-semibold text-ink">Weather Note:</span> {itineraryData.weatherNote}</p>
              </div>
            </>
          ) : <EmptyState title="No itinerary available" description="The planner could not create a route right now." />}
        </Card>
        </div>
      )}
    </div>
  )
}
