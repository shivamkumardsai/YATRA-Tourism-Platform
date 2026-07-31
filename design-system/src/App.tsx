import './App.css'
import {
  Alert,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  EmptyState,
  ErrorState,
  Footer,
  LoadingState,
  Navbar,
} from './lib/designSystem'

function App() {
  return (
    <div className="min-h-screen bg-sand px-4 py-8 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Navbar />

        <main className="mt-8 space-y-8">
          <section className="rounded-[1.5rem] border border-border bg-[#f7efe2] p-8 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">YATRA Design System</p>
                <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
                  A premium digital experience for heritage, tourism, and public trust.
                </h1>
                <p className="mt-4 text-lg text-muted">
                  Built for the Government of Jharkhand, this system balances civic clarity with the warmth of Indian earth tones and cultural depth.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary action</Button>
                <Button variant="secondary">Secondary action</Button>
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Card variant="elevated">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="success">Official</Badge>
                <Badge variant="info">Civic access</Badge>
                <Badge variant="warning">Heritage focus</Badge>
              </div>
              <h2 className="mt-6 text-2xl font-semibold">Design language and tokens</h2>
              <p className="mt-3 text-muted">
                The palette draws from forests, rivers, temple stone, and tribal heritage while maintaining a calm, professional, government-grade tone.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1rem] border border-border bg-[#FCFAF6] p-4">
                  <p className="text-sm font-semibold text-river">Typography</p>
                  <p className="mt-2 text-sm text-muted">Inter for interface clarity, with Source Serif 4 for editorial emphasis.</p>
                </div>
                <div className="rounded-[1rem] border border-border bg-[#FCFAF6] p-4">
                  <p className="text-sm font-semibold text-river">Spacing</p>
                  <p className="mt-2 text-sm text-muted">Tokenized rhythm designed for public-sector readability and calm pacing.</p>
                </div>
              </div>
            </Card>

            <Card variant="outline">
              <Breadcrumbs items={[{ label: 'Home' }, { label: 'Tourism' }, { label: 'Destination', current: true }]} />
              <div className="mt-6 space-y-3">
                <Alert variant="info" title="Guidance note">
                  Visitor information is being shared with ecological sensitivity and cultural respect.
                </Alert>
                <Alert variant="success" title="Operational readiness">
                  All destination insights are aligned with current public service protocols.
                </Alert>
              </div>
            </Card>
          </section>

          <section className="grid gap-6 lg:grid-cols-3">
            <Card variant="default">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-river">Buttons</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </Card>

            <Card variant="default">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-river">Cards</p>
              <div className="mt-4 space-y-3">
                <Card variant="outline" className="p-4">
                  <p className="font-semibold">Destination overview</p>
                  <p className="mt-1 text-sm text-muted">Cultural heritage and sustainability insights in one place.</p>
                </Card>
                <Card variant="elevated" className="p-4">
                  <p className="font-semibold">Monitoring view</p>
                  <p className="mt-1 text-sm text-muted">Operational intelligence for protected areas and visitor flow.</p>
                </Card>
              </div>
            </Card>

            <Card variant="default">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-river">States</p>
              <div className="mt-4 space-y-3">
                <LoadingState />
                <EmptyState title="No reports available" description="New destination intelligence will appear here once published." action={<Button variant="secondary">Create report</Button>} />
                <ErrorState title="Data delayed" description="The latest insights are temporarily unavailable. Please retry shortly." />
              </div>
            </Card>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default App
