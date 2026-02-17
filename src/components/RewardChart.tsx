import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { formatPLM } from '../lib/formatters'
import { useTranslation } from '../i18n'

interface RewardChartProps {
  data: {
    epoch: number
    reward: string | bigint
  }[]
}

export const RewardChart = ({ data }: RewardChartProps) => {
  const { t } = useTranslation()
  const chartData = data.map((item) => ({
    epoch: item.epoch,
    reward: parseFloat(formatPLM(item.reward, 2)),
  }))

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-6 text-heading">
        {t('rewards.chartTitle')}
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="rewardGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
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
            tickFormatter={(value) => `${value} PLM`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--chart-tooltip-bg)',
              border: '1px solid var(--chart-tooltip-border)',
              borderRadius: '8px',
            }}
            itemStyle={{ color: 'var(--text-primary)' }}
            labelStyle={{ color: 'var(--text-secondary)' }}
            formatter={(value) => (value ? [`${value} PLM`, t('rewards.reward')] : ['0 PLM', t('rewards.reward')])}
            labelFormatter={(label) => `${t('rewards.epoch')} ${label}`}
          />
          <Area
            type="monotone"
            dataKey="reward"
            stroke="#06b6d4"
            strokeWidth={2}
            fill="url(#rewardGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RewardChart
