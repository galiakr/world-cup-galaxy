// Israel's UTC offset shifts with daylight saving (UTC+2 in winter, UTC+3 in
// summer) — using the IANA zone instead of a fixed offset keeps "today"
// correct year-round instead of drifting by an hour during DST.
export function israelDateString(offsetDays = 0): string {
  const d = new Date(Date.now() + offsetDays * 86400000)
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jerusalem' }).format(d)
}
