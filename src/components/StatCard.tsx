import type { LucideIcon } from 'lucide-react'
import { motion } from 'motion/react'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  loading?: boolean
}

export const StatCard = ({
  title,
  value,
  icon: Icon,
  change,
  trend = 'neutral',
  loading = false,
}: StatCardProps) => {
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
        {change && (
          <span
            className={`text-sm font-medium ${
              trend === 'up'
                ? 'text-green-400'
                : trend === 'down'
                ? 'text-red-400'
                : 'text-slate-400'
            }`}
          >
            {change}
          </span>
        )}
      </div>

      <h3 className="text-sm text-slate-400 mb-2">{title}</h3>

      {loading ? (
        <div className="h-8 w-32 bg-slate-700/50 rounded animate-pulse" />
      ) : (
        <p className="text-3xl font-bold text-white">{value}</p>
      )}
    </motion.div>
  )
}

export default StatCard
