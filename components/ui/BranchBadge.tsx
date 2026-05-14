import { cn, branchConfig } from '@/lib/utils'
import type { Branch } from '@/lib/types'

interface BranchBadgeProps {
  branch: Branch
  size?: 'sm' | 'md'
  className?: string
}

const icons: Record<Branch, string> = {
  executive: '🏛',
  legislative: '📜',
  judicial: '⚖️',
}

export function BranchBadge({ branch, size = 'md', className }: BranchBadgeProps) {
  const cfg = branchConfig[branch]

  return (
    <span
      className={cn(
        'branch-pill',
        size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1',
        branch === 'executive' && 'bg-navy-50 text-navy-600 border border-navy-200',
        branch === 'legislative' && 'bg-blue-50 text-blue-700 border border-blue-200',
        branch === 'judicial' && 'bg-green-50 text-green-700 border border-green-200',
        className
      )}
    >
      <span className="text-[11px]">{icons[branch]}</span>
      {cfg.label}
    </span>
  )
}
