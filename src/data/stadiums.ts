import { Stadium, Language } from '@/types'
import { STADIUM_TEXT_EN } from './en'
import { STADIUM_TEXT_HE } from './he'

// IDs and base info from worldcup26.ir's /get/stadiums endpoint.
// lat/lng are each stadium's real-world coordinates, for the map view.
// Display names/cities live in data/en.ts / data/he.ts, resolved via
// getStadiumText() below.
export const STADIUMS: Stadium[] = [
  { id: '1',  country: 'Mexico',        capacity: 83000, lat: 19.3029,  lng: -99.1505  },
  { id: '2',  country: 'Mexico',        capacity: 49850, lat: 20.6822,  lng: -103.4621 },
  { id: '3',  country: 'Mexico',        capacity: 53500, lat: 25.6700,  lng: -100.2458 },
  { id: '4',  country: 'United States', capacity: 80000, lat: 32.7473,  lng: -97.0945  },
  { id: '5',  country: 'United States', capacity: 72220, lat: 29.6847,  lng: -95.4107  },
  { id: '6',  country: 'United States', capacity: 76416, lat: 39.0489,  lng: -94.4839  },
  { id: '7',  country: 'United States', capacity: 71000, lat: 33.7554,  lng: -84.4008  },
  { id: '8',  country: 'United States', capacity: 65000, lat: 25.9580,  lng: -80.2389  },
  { id: '9',  country: 'United States', capacity: 65878, lat: 42.0909,  lng: -71.2643  },
  { id: '10', country: 'United States', capacity: 67594, lat: 39.9008,  lng: -75.1675  },
  { id: '11', country: 'United States', capacity: 82500, lat: 40.8135,  lng: -74.0744  },
  { id: '12', country: 'Canada',        capacity: 30000, lat: 43.6332,  lng: -79.4185  },
  { id: '13', country: 'Canada',        capacity: 54500, lat: 49.2768,  lng: -123.1118 },
  { id: '14', country: 'United States', capacity: 69000, lat: 47.5952,  lng: -122.3316 },
  { id: '15', country: 'United States', capacity: 71000, lat: 37.4030,  lng: -121.9700 },
  { id: '16', country: 'United States', capacity: 70240, lat: 33.9535,  lng: -118.3392 },
]

export const STADIUMS_BY_ID: Record<string, Stadium> = STADIUMS.reduce((acc, s) => {
  acc[s.id] = s
  return acc
}, {} as Record<string, Stadium>)

export function getStadiumText(id: string | undefined, lang: Language): { name: string; city: string } {
  if (!id) return { name: '', city: '' }
  const map = lang === 'he' ? STADIUM_TEXT_HE : STADIUM_TEXT_EN
  return map[id] ?? { name: id, city: '' }
}
