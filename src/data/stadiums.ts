import { Stadium } from '@/types'

// IDs and base info from worldcup26.ir's /get/stadiums endpoint.
// lat/lng are each stadium's real-world coordinates, for the map view.
export const STADIUMS: Stadium[] = [
  { id: '1',  name_en: 'Estadio Azteca',                    name_he: 'אסטדיו אסטקה',           city_en: 'Mexico City',                        city_he: 'מקסיקו סיטי',          country: 'Mexico',        capacity: 83000, lat: 19.3029,  lng: -99.1505  },
  { id: '2',  name_en: 'Estadio Akron',                     name_he: 'אסטדיו אקרון',            city_en: 'Guadalajara (Zapopan)',              city_he: 'גואדלחארה',             country: 'Mexico',        capacity: 49850, lat: 20.6822,  lng: -103.4621 },
  { id: '3',  name_en: 'Estadio BBVA',                      name_he: 'אסטדיו BBVA',             city_en: 'Monterrey (Guadalupe)',              city_he: 'מונטריי',               country: 'Mexico',        capacity: 53500, lat: 25.6700,  lng: -100.2458 },
  { id: '4',  name_en: 'AT&T Stadium',                      name_he: 'אצטדיון AT&T',           city_en: 'Dallas (Arlington, Texas)',          city_he: 'דאלאס',                 country: 'United States', capacity: 80000, lat: 32.7473,  lng: -97.0945  },
  { id: '5',  name_en: 'NRG Stadium',                       name_he: 'אצטדיון NRG',            city_en: 'Houston',                            city_he: 'יוסטון',                country: 'United States', capacity: 72220, lat: 29.6847,  lng: -95.4107  },
  { id: '6',  name_en: 'GEHA Field at Arrowhead Stadium',   name_he: 'אצטדיון ארואוהד',          city_en: 'Kansas City',                        city_he: 'קנזס סיטי',             country: 'United States', capacity: 76416, lat: 39.0489,  lng: -94.4839  },
  { id: '7',  name_en: 'Mercedes-Benz Stadium',              name_he: 'אצטדיון מרצדס-בנץ',       city_en: 'Atlanta',                            city_he: 'אטלנטה',                country: 'United States', capacity: 71000, lat: 33.7554,  lng: -84.4008  },
  { id: '8',  name_en: 'Hard Rock Stadium',                  name_he: 'אצטדיון הארד רוק',         city_en: 'Miami (Miami Gardens)',              city_he: 'מיאמי',                 country: 'United States', capacity: 65000, lat: 25.9580,  lng: -80.2389  },
  { id: '9',  name_en: 'Gillette Stadium',                   name_he: 'אצטדיון ג\'ילט',          city_en: 'Boston (Foxborough)',                city_he: 'בוסטון',                country: 'United States', capacity: 65878, lat: 42.0909,  lng: -71.2643  },
  { id: '10', name_en: 'Lincoln Financial Field',            name_he: 'לינקולן פיננשל פילד',      city_en: 'Philadelphia',                       city_he: 'פילדלפיה',              country: 'United States', capacity: 67594, lat: 39.9008,  lng: -75.1675  },
  { id: '11', name_en: 'MetLife Stadium',                    name_he: 'אצטדיון מטלייף',          city_en: 'New York/New Jersey (East Rutherford)', city_he: 'ניו יורק',            country: 'United States', capacity: 82500, lat: 40.8135,  lng: -74.0744  },
  { id: '12', name_en: 'BMO Field',                          name_he: 'בי.אם.או פילד',           city_en: 'Toronto',                            city_he: 'טורונטו',               country: 'Canada',        capacity: 30000, lat: 43.6332,  lng: -79.4185  },
  { id: '13', name_en: 'BC Place',                           name_he: 'בי סי פלייס',             city_en: 'Vancouver',                          city_he: 'ונקובר',                country: 'Canada',        capacity: 54500, lat: 49.2768,  lng: -123.1118 },
  { id: '14', name_en: 'Lumen Field',                        name_he: 'לומן פילד',               city_en: 'Seattle',                            city_he: 'סיאטל',                 country: 'United States', capacity: 69000, lat: 47.5952,  lng: -122.3316 },
  { id: '15', name_en: 'Levi\'s Stadium',                    name_he: 'אצטדיון ליוויס',           city_en: 'San Francisco Bay Area (Santa Clara)', city_he: 'מפרץ סן פרנסיסקו',     country: 'United States', capacity: 71000, lat: 37.4030,  lng: -121.9700 },
  { id: '16', name_en: 'SoFi Stadium',                       name_he: 'אצטדיון סופיי',            city_en: 'Los Angeles (Inglewood)',            city_he: 'לוס אנג\'לס',           country: 'United States', capacity: 70240, lat: 33.9535,  lng: -118.3392 },
]

export const STADIUMS_BY_ID: Record<string, Stadium> = STADIUMS.reduce((acc, s) => {
  acc[s.id] = s
  return acc
}, {} as Record<string, Stadium>)
