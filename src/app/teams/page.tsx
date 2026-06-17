import TeamsClient from '@/components/pages/TeamsClient'
import { TEAMS } from '@/data/teams'

export default function TeamsPage() {
  return <TeamsClient teams={TEAMS} />
}
