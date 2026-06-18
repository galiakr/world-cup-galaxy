import { Stadium } from '@/types'

// IDs and base info from worldcup26.ir's /get/stadiums endpoint.
export const STADIUMS: Stadium[] = [
  { id: '1',  name_en: 'Estadio Azteca',                    name_he: 'אסטדיו אסטקה',           city_en: 'Mexico City',                        city_he: 'מקסיקו סיטי',          country: 'Mexico',        capacity: 83000 },
  { id: '2',  name_en: 'Estadio Akron',                     name_he: 'אסטדיו אקרון',            city_en: 'Guadalajara (Zapopan)',              city_he: 'גואדלחארה',             country: 'Mexico',        capacity: 49850 },
  { id: '3',  name_en: 'Estadio BBVA',                      name_he: 'אסטדיו BBVA',             city_en: 'Monterrey (Guadalupe)',              city_he: 'מונטריי',               country: 'Mexico',        capacity: 53500 },
  { id: '4',  name_en: 'AT&T Stadium',                      name_he: 'אצטדיון AT&T',           city_en: 'Dallas (Arlington, Texas)',          city_he: 'דאלאס',                 country: 'United States', capacity: 80000 },
  { id: '5',  name_en: 'NRG Stadium',                       name_he: 'אצטדיון NRG',            city_en: 'Houston',                            city_he: 'יוסטון',                country: 'United States', capacity: 72220 },
  { id: '6',  name_en: 'GEHA Field at Arrowhead Stadium',   name_he: 'אצטדיון ארואוהד',          city_en: 'Kansas City',                        city_he: 'קנזס סיטי',             country: 'United States', capacity: 76416 },
  { id: '7',  name_en: 'Mercedes-Benz Stadium',              name_he: 'אצטדיון מרצדס-בנץ',       city_en: 'Atlanta',                            city_he: 'אטלנטה',                country: 'United States', capacity: 71000 },
  { id: '8',  name_en: 'Hard Rock Stadium',                  name_he: 'אצטדיון הארד רוק',         city_en: 'Miami (Miami Gardens)',              city_he: 'מיאמי',                 country: 'United States', capacity: 65000 },
  { id: '9',  name_en: 'Gillette Stadium',                   name_he: 'אצטדיון ג\'ילט',          city_en: 'Boston (Foxborough)',                city_he: 'בוסטון',                country: 'United States', capacity: 65878 },
  { id: '10', name_en: 'Lincoln Financial Field',            name_he: 'לינקולן פיננשל פילד',      city_en: 'Philadelphia',                       city_he: 'פילדלפיה',              country: 'United States', capacity: 67594 },
  { id: '11', name_en: 'MetLife Stadium',                    name_he: 'אצטדיון מטלייף',          city_en: 'New York/New Jersey (East Rutherford)', city_he: 'ניו יורק',            country: 'United States', capacity: 82500 },
  { id: '12', name_en: 'BMO Field',                          name_he: 'בי.אם.או פילד',           city_en: 'Toronto',                            city_he: 'טורונטו',               country: 'Canada',        capacity: 30000 },
  { id: '13', name_en: 'BC Place',                           name_he: 'בי סי פלייס',             city_en: 'Vancouver',                          city_he: 'ונקובר',                country: 'Canada',        capacity: 54500 },
  { id: '14', name_en: 'Lumen Field',                        name_he: 'לומן פילד',               city_en: 'Seattle',                            city_he: 'סיאטל',                 country: 'United States', capacity: 69000 },
  { id: '15', name_en: 'Levi\'s Stadium',                    name_he: 'אצטדיון ליוויס',           city_en: 'San Francisco Bay Area (Santa Clara)', city_he: 'מפרץ סן פרנסיסקו',     country: 'United States', capacity: 71000 },
  { id: '16', name_en: 'SoFi Stadium',                       name_he: 'אצטדיון סופיי',            city_en: 'Los Angeles (Inglewood)',            city_he: 'לוס אנג\'לס',           country: 'United States', capacity: 70240 },
]

export const STADIUMS_BY_ID: Record<string, Stadium> = STADIUMS.reduce((acc, s) => {
  acc[s.id] = s
  return acc
}, {} as Record<string, Stadium>)
