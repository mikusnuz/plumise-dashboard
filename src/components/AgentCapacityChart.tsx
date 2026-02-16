import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { useTranslation } from '../i18n'
import { formatAddress } from '../lib/formatters'
import type { AgentCapacity } from '../lib/types'

interface AgentCapacityChartProps {
  data: AgentCapacity[]
}

export const AgentCapacityChart = ({ data }: AgentCapacityChartProps) => {
  const { t } = useTranslation()

  const chartData = data.map((item) => ({
    agent: formatAddress(item.address),
    benchmark: item.benchmarkTokPerSec || 0,
    actual: parseFloat(item.throughputTokPerSec || '0'),
  }))

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-4 text-heading">
        {t('hashpower.benchmarkChart')}
      </h3>
      <ResponsiveContainer width="100%" height={Math.max(200, chartData.length * 60 + 40)}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
          <XAxis
            type="number"
            stroke="var(--chart-text)"
            tick={{ fill: 'var(--chart-text)', fontSize: 12 }}
            unit=" tok/s"
          />
          <YAxis
            type="category"
            dataKey="agent"
            stroke="var(--chart-text)"
            tick={{ fill: 'var(--chart-text)', fontSize: 12 }}
            width={100}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--chart-tooltip-bg)',
              border: '1px solid var(--chart-tooltip-border)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
            }}
            formatter={(value: number, name: string) => [
              `${value.toFixed(2)} tok/s`,
              name === 'benchmark' ? t('hashpower.benchmark') : t('hashpower.actual'),
            ]}
          />
          <Legend
            formatter={(value) =>
              value === 'benchmark' ? t('hashpower.benchmark') : t('hashpower.actual')
            }
          />
          <Bar dataKey="benchmark" fill="#06b6d4" radius={[0, 4, 4, 0]} />
          <Bar dataKey="actual" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AgentCapacityChart
