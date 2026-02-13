import type { LucideIcon } from 'lucide-react'
import { motion } from 'motion/react'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  loading?: boolean
  isStale?: boolean
  isError?: boolean
  lastUpdated?: Date | null
}

export const StatCard = ({
  title,
  value,
  icon: Icon,
  change,
  trend = 'neutral',
  loading = false,
  isStale = false,
  isError = false,
  lastUpdated = null,
}: StatCardProps) => {
  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    return date.toLocaleTimeString()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="stat-card"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
          <Icon size={24} className="text-cyan-400" />
        </div>
        {change && !isError && !isStale && (
          <span
            className={`text-sm font-medium ${
              trend === 'up'
                ? 'text-green-400'
                : trend === 'down'
                ? 'text-red-400'
                : 'text-label'
            }`}
          >
            {change}
          </span>
        )}
        {(isStale || isError) && (
          <span className="flex items-center gap-1 text-xs text-amber-400">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
            {isError ? 'Error' : 'Stale'}
          </span>
        )}
      </div>

      <h3 className="text-sm text-label mb-2">{title}</h3>

      {loading ? (
        <div className="h-8 w-32 bg-elevated rounded animate-pulse" />
      ) : (
        <>
          <p className="text-3xl font-bold text-heading">{value}</p>
          {lastUpdated && (isStale || isError) && (
            <p className="text-xs text-label/60 mt-1">
              Last: {formatTime(lastUpdated)}
            </p>
          )}
        </>
      )}
    </motion.div>
  )
}

export default StatCard
