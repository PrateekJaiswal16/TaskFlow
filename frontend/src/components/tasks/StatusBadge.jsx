import { Badge } from '@/components/ui/badge'

const tone = {
  'To Do': 'secondary',
  'In Progress': 'default',
  'Pending Approval': 'secondary',
  'Done': 'secondary',
}

export default function StatusBadge({ value }) {
  return <Badge variant={tone[value] ?? 'secondary'}>{value}</Badge>
}
