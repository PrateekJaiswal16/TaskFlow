import { Badge } from '@/components/ui/badge'

const cls = {
  Low: 'bg-muted text-foreground hover:bg-muted',
  Medium: '',
  High: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
}

export default function PriorityBadge({ value }) {
  return <Badge className={cls[value] ?? ''}>{value}</Badge>
}
