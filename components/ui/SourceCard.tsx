import { ExternalLink, Database, CheckCircle, XCircle } from 'lucide-react'
import type { DataSource } from '@/lib/types'
import { cn } from '@/lib/utils'

interface SourceCardProps {
  source: DataSource
  className?: string
}

export function SourceCard({ source, className }: SourceCardProps) {
  return (
    <div className={cn('rounded-lg border border-slate-100 bg-slate-50 p-4', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <Database className="w-4 h-4 mt-0.5 text-slate-400 shrink-0" />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-800 truncate">{source.name}</div>
            <div className="text-xs text-slate-500 mt-0.5">{source.agency}</div>
          </div>
        </div>
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 p-1.5 rounded-md hover:bg-slate-200 text-slate-400 hover:text-navy-600 transition"
          aria-label={`Open ${source.name}`}
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          {source.apiAvailable ? (
            <CheckCircle className="w-3.5 h-3.5 text-civic-green" />
          ) : (
            <XCircle className="w-3.5 h-3.5 text-slate-300" />
          )}
          {source.apiAvailable ? 'API available' : 'No public API'}
        </span>
        <span>Updated: {source.updateFrequency}</span>
      </div>

      {source.notes && (
        <p className="mt-2 text-xs text-slate-500 italic">{source.notes}</p>
      )}
    </div>
  )
}
