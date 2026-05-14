import { Clock, RefreshCw } from 'lucide-react'
import { cn, refreshLabels } from '@/lib/utils'
import type { RefreshFrequency, DataQuality } from '@/lib/types'
import { dataQualityConfig } from '@/lib/utils'

interface DataFreshnessProps {
  frequency: RefreshFrequency
  asOfDate?: string
  quality: DataQuality
  className?: string
}

export function DataFreshness({ frequency, asOfDate, quality, className }: DataFreshnessProps) {
  const qcfg = dataQualityConfig[quality]
  return (
    <div className={cn('flex flex-wrap items-center gap-3 text-xs text-slate-500', className)}>
      <span className="flex items-center gap-1">
        <RefreshCw className="w-3.5 h-3.5" />
        Updated {refreshLabels[frequency]}
      </span>
      {asOfDate && (
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          As of {asOfDate}
        </span>
      )}
      <span className={cn('flex items-center gap-1 font-medium', qcfg.color)}>
        <span
          className={cn(
            'inline-block w-2 h-2 rounded-full',
            quality === 'high' && 'bg-civic-green',
            quality === 'medium' && 'bg-civic-amber',
            quality === 'low' && 'bg-civic-red',
            quality === 'estimated' && 'bg-slate-400'
          )}
        />
        {qcfg.label} data quality
      </span>
    </div>
  )
}
