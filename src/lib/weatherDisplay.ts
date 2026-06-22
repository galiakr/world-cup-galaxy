// Pure display helper, safe to import from client components — unlike
// weather.ts, this has no fetch calls or server-only env var reads.
export function weatherEmoji(icon: string): string {
  const code = icon.slice(0, 2)
  switch (code) {
    case '01': return '☀️'
    case '02': return '🌤️'
    case '03':
    case '04': return '☁️'
    case '09':
    case '10': return '🌧️'
    case '11': return '⛈️'
    case '13': return '❄️'
    case '50': return '🌫️'
    default: return '🌡️'
  }
}
