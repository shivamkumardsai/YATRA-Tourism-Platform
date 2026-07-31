import type { Artisan, CraftCategory } from './types'

export const artisans: Artisan[] = [
  {
    id: 'suhasini',
    name: 'Suhasini Devi',
    craft: 'Sohrai painting',
    story: 'A muralist whose work preserves harvest memory through symbols drawn from village life and ritual practice.',
    location: 'Hazaribagh',
  },
  {
    id: 'ramesh',
    name: 'Ramesh Munda',
    craft: 'Dokra casting',
    story: 'A metal artist continuing an ancestral practice using lost-wax techniques and a deep respect for form and symbolism.',
    location: 'Ranchi',
  },
  {
    id: 'kavita',
    name: 'Kavita Oraon',
    craft: 'Bamboo weaving',
    story: 'A craft practitioner creating everyday objects and ceremonial forms with a lineage of basketry and pattern.',
    location: 'Latehar',
  },
]

export const craftCategories: CraftCategory[] = [
  { name: 'Dokra', note: 'Metal casting with ancestral motifs and ritual significance.' },
  { name: 'Sohrai painting', note: 'Earth-toned murals reflecting harvest, home, and continuity.' },
  { name: 'Bamboo', note: 'Utility and ceremonial pieces shaped through hand weaving.' },
  { name: 'Lac', note: 'Finely worked surfaces and decorative forms rooted in tradition.' },
  { name: 'Handloom', note: 'Textiles and woven pieces carrying story, pattern, and place.' },
]
