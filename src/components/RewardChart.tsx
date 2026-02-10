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

interface RewardChartProps {
  data: {
    epoch: number
    reward: string | bigint
  }[]
}

export const RewardChart = ({ data }: RewardChartProps) => {
  const chartData = data.map((item) => ({
    epoch: item.epoch,
    reward: parseFloat(formatPLM(item.reward, 2)),
  }))

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-6 text-white">
        Reward Distribution History
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="rewardGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="epoch"
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
          />
          <YAxis
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            tickFormatter={(value) => `${value} PLM`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '8px',
              color: '#e2e8f0',
            }}
            formatter={(value) => (value ? [`${value} PLM`, 'Reward'] : ['0 PLM', 'Reward'])}
            labelFormatter={(label) => `Epoch ${label}`}
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
