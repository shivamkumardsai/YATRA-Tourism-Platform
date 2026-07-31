export type Severity = 'Low' | 'Moderate' | 'High' | 'Critical'

export interface Destination {
  id: string
  name: string
  region: string
  category: 'Sacred' | 'Wildlife' | 'Highlands' | 'Waterfalls'
  image: string
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
  heroImage?: string
}

export interface Artisan {
  id: string
  name: string
  craft: string
  story: string
  location: string
}

export interface CraftCategory {
  name: string
  note: string
}

export interface TourismStatistic {
  label: string
  value: string
  note: string
}

export interface TrendMetric {
  label: string
  value: string
  delta: string
}

export interface MockReport {
  id: string
  title: string
  severity: Severity
  status: string
  district: string
  category: string
  createdAt: string
}
