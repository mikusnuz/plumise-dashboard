import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Activity, Cpu, Timer } from 'lucide-react'
import { useTranslation } from '../i18n'
import type { ThroughputData } from '../lib/types'

interface ThroughputChartProps {
  data: ThroughputData[]
}

export const ThroughputChart = ({ data }: ThroughputChartProps) => {
  const { t } = useTranslation()

  const chartData = data.map((item) => ({
    epoch: item.epoch,
    tokens: Number(item.totalTokens),
    requests: item.totalRequests,
    tokPerSec: parseFloat(item.throughputTokPerSec),
  }))

  const latest = data[data.length - 1]

  const formatTokens = (v: number) => {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
    if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`
    return String(v)
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-4 text-heading">
        {t('throughput.title')}
      </h3>

      {latest && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <div>
              <p className="text-xs text-label">{t('throughput.agents')}</p>
              <p className="text-sm font-semibold text-heading">{latest.agentCount}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-400" />
            <div>
              <p className="text-xs text-label">{t('throughput.tokPerSec')}</p>
              <p className="text-sm font-semibold text-heading">{latest.throughputTokPerSec} tok/s</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-emerald-400" />
            <div>
              <p className="text-xs text-label">{t('throughput.avgLatency')}</p>
              <p className="text-sm font-semibold text-heading">{latest.avgLatency} ms</p>
            </div>
          </div>
        </div>
      )}

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="tokenGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="requestGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
          <XAxis
            dataKey="epoch"
            stroke="var(--chart-text)"
            tick={{ fill: 'var(--chart-text)', fontSize: 12 }}
          />
          <YAxis
            yAxisId="left"
            stroke="var(--chart-text)"
            tick={{ fill: 'var(--chart-text)', fontSize: 12 }}
            tickFormatter={formatTokens}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="var(--chart-text)"
            tick={{ fill: 'var(--chart-text)', fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--chart-tooltip-bg)',
              border: '1px solid var(--chart-tooltip-border)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
            }}
            formatter={(value: number, name: string) => {
              if (name === 'tokens') return [formatTokens(value), t('throughput.tokens')]
              if (name === 'requests') return [value, t('throughput.requests')]
              return [value, name]
            }}
            labelFormatter={(label) => `${t('rewards.epoch')} ${label}`}
          />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="tokens"
            stroke="#06b6d4"
            strokeWidth={2}
            fill="url(#tokenGradient)"
          />
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="requests"
            stroke="#8b5cf6"
            strokeWidth={2}
            fill="url(#requestGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ThroughputChart
