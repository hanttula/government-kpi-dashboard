import { AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CaveatBannerProps {
  caveats: string[]
  title?: string
  variant?: 'warning' | 'info'
  className?: string
}

export function CaveatBanner({
  caveats,
  title = 'Data Caveats',
  variant = 'warning',
  className,
}: CaveatBannerProps) {
  if (!caveats.length) return null

  return (
    <div
      className={cn(
        'rounded-lg border p-4',
        variant === 'warning'
          ? 'bg-amber-50 border-amber-200 text-amber-900'
          : 'bg-blue-50 border-blue-200 text-blue-900',
        className
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        {variant === 'warning' ? (
          <AlertTriangle className="w-4 h-4 shrink-0" />
        ) : (
          <Info className="w-4 h-4 shrink-0" />
        )}
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <ul className="space-y-1.5 text-sm">
        {caveats.map((c, i) => (
          <li key={i} className="flex gap-2">
            <span className="shrink-0 mt-1 w-1 h-1 rounded-full bg-current opacity-60 block" />
            <span className="leading-relaxed">{c}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
