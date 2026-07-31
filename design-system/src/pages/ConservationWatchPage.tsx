import { Link } from 'react-router-dom'
import { useState, useRef } from 'react'
import { createReport } from '../lib/api'
import { Badge, Button, Card, ErrorState } from '../lib/designSystem'

type Severity = 'Low' | 'Moderate' | 'High' | 'Critical'

type ReportForm = {
  category: string
  severity: Severity
  description: string
  location: string
}

const categories = ['Waste accumulation', 'Water concern', 'Trail damage', 'Wildlife disturbance', 'Unsafe signage', 'Other']
const severities: Severity[] = ['Low', 'Moderate', 'High', 'Critical']


export function ConservationWatchPage() {
  const [form, setForm] = useState<ReportForm>({
    category: 'Waste accumulation',
    severity: 'Moderate',
    description: '',
    location: 'Near Netarhat viewpoint',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageName, setImageName] = useState('No image uploaded')
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [submitted, setSubmitted] = useState(false)
  const [reportId, setReportId] = useState('CW-000000')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [statusSteps, setStatusSteps] = useState<Array<{ label: string; detail: string }>>([
    { label: 'Received', detail: 'Your report has entered the civic review queue.' },
    { label: 'Field review', detail: 'A local officer is assessing the concern and context.' },
    { label: 'Response', detail: 'Updates will be shared with the reporting channel.' },
  ])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImageName(file.name)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setSubmitError(null)
    
    const formData = new FormData()
    formData.append('category', form.category)
    formData.append('severity', form.severity)
    formData.append('description', form.description)
    formData.append('location', form.location)
    if (imageFile) {
      formData.append('image', imageFile)
    }

    try {
      const result = await createReport(formData)
      setReportId(result.reportId)
      setStatusSteps(result.steps)
      setSubmitted(true)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to submit report')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-border bg-[#f2e4cf] shadow-sm">
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:p-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Conservation Watch</p>
            <h1 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">Report concerns that affect tourism, public safety, or environmental care.</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-muted">
              This service is designed to help visitors and residents share issues quickly and responsibly. Your report supports public stewardship and helps the authorities respond with clarity.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Badge variant="info">Government service</Badge>
              <Badge>Secure and reviewed</Badge>
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-border bg-white/80 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-river">What to report</p>
            <ul className="mt-3 space-y-2 text-sm leading-7 text-muted">
              <li>• Littering or waste buildup</li>
              <li>• Waterlogging or unsafe drainage</li>
              <li>• Damaged trails or broken signage</li>
              <li>• Wildlife disturbance or habitat concern</li>
            </ul>
          </div>
        </div>
      </section>

      {!submitted ? (
        <Card variant="elevated" className="p-0 overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="bg-[#f8efe0] p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Report submission</p>
              <h2 className="mt-3 text-2xl font-semibold text-ink">A calm and structured way to document what you see.</h2>
              <p className="mt-3 text-sm leading-7 text-muted">Your information helps the relevant authorities assess the issue with context and urgency.</p>

              <div className="mt-6 rounded-[1.25rem] border border-border bg-white/80 p-4">
                <p className="text-sm font-semibold text-ink">Suggested next step</p>
                <p className="mt-2 text-sm leading-7 text-muted">Please include the clearest available location detail and any visible impact on visitors or the environment.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6 sm:p-8">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-ink">Upload image</span>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex cursor-pointer items-center justify-between rounded-[1rem] border border-dashed border-border bg-[#fbf6ee] px-4 py-4 text-sm text-muted"
                >
                  <span>{imageName}</span>
                  <span className="rounded-full bg-river/10 px-3 py-1 text-river">Choose file</span>
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-ink">GPS location</span>
                <input
                  value={form.location}
                  onChange={(event) => setForm({ ...form, location: event.target.value })}
                  className="w-full rounded-[1rem] border border-border bg-white px-4 py-3 text-sm text-ink outline-none ring-0"
                  placeholder="Approximate location"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-ink">Issue category</span>
                <select
                  value={form.category}
                  onChange={(event) => setForm({ ...form, category: event.target.value })}
                  className="w-full rounded-[1rem] border border-border bg-white px-4 py-3 text-sm text-ink outline-none"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </label>

              <div>
                <span className="mb-2 block text-sm font-semibold text-ink">Severity</span>
                <div className="flex flex-wrap gap-2">
                  {severities.map((severity) => (
                    <button
                      key={severity}
                      type="button"
                      onClick={() => setForm({ ...form, severity })}
                      className={`rounded-full border px-3 py-2 text-sm transition ${form.severity === severity ? 'border-river bg-river text-white' : 'border-border bg-white text-ink hover:border-river/60'}`}
                    >
                      {severity}
                    </button>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-ink">Description</span>
                <textarea
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                  rows={5}
                  className="w-full rounded-[1rem] border border-border bg-white px-4 py-3 text-sm text-ink outline-none"
                  placeholder="Describe the issue, observed impact, and any urgency."
                />
              </label>

              {submitError ? <ErrorState title="Report submission failed" description={submitError} /> : null}
              <Button type="submit" className="w-full justify-center" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit Report'}
              </Button>
            </form>
          </div>
        </Card>
      ) : (
        <Card variant="elevated" className="space-y-6">
          <div className="rounded-[1.5rem] border border-border bg-[#f8efe0] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Report received</p>
            <h2 className="mt-3 text-2xl font-semibold text-ink">Thank you for helping protect a place that matters.</h2>
            <p className="mt-3 text-sm leading-7 text-muted">Your concern has been recorded and routed to the appropriate civic review pathway.</p>
            <div className="mt-5 inline-flex rounded-full border border-river/20 bg-white/80 px-4 py-2 text-sm font-semibold text-river">
              Report ID: {reportId}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[1.25rem] border border-border bg-[#fbf6ee] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Status tracker</p>
              <div className="mt-4 space-y-4">
                {statusSteps.map((step, index) => (
                  <div key={step.label} className="flex gap-3">
                    <div className={`mt-1 h-3 w-3 rounded-full ${index === 0 ? 'bg-river' : 'bg-border'}`} />
                    <div>
                      <p className="text-sm font-semibold text-ink">{step.label}</p>
                      <p className="mt-1 text-sm leading-7 text-muted">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.25rem] border border-border bg-white/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">What happens next</p>
              <p className="mt-3 text-sm leading-7 text-muted">A local review team will assess the report, determine the appropriate response, and update you through the official channel.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link to="/explore">
                  <Button variant="secondary">View public guidance</Button>
                </Link>
                <Button onClick={() => setSubmitted(false)} type="button">Submit another report</Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
