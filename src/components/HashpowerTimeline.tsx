import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useTranslation } from '../i18n'
import type { ThroughputData } from '../lib/types'

interface HashpowerTimelineProps {
  data: ThroughputData[]
}

export const HashpowerTimeline = ({ data }: HashpowerTimelineProps) => {
  const { t } = useTranslation()

  const chartData = data.map((item) => ({
    epoch: item.epoch,
    tokPerSec: parseFloat(item.throughputTokPerSec),
  }))

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-4 text-heading">
        {t('hashpower.timeline')}
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="hashpowerGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
          <XAxis
            dataKey="epoch"
            stroke="var(--chart-text)"
            tick={{ fill: 'var(--chart-text)', fontSize: 12 }}
          />
          <YAxis
            stroke="var(--chart-text)"
            tick={{ fill: 'var(--chart-text)', fontSize: 12 }}
            unit=" tok/s"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--chart-tooltip-bg)',
              border: '1px solid var(--chart-tooltip-border)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
            }}
            formatter={(value: number) => [`${value.toFixed(2)} tok/s`, t('hashpower.throughput')]}
            labelFormatter={(label) => `${t('rewards.epoch')} ${label}`}
          />
          <Area
            type="monotone"
            dataKey="tokPerSec"
            stroke="#06b6d4"
            strokeWidth={2}
            fill="url(#hashpowerGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default HashpowerTimeline
