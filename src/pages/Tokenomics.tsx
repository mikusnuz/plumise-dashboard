import { Coins, Timer, TrendingDown, Wallet } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import StatCard from '../components/StatCard'
import { useTokenomics } from '../hooks/useTokenomics'
import { formatPLM, formatNumber } from '../lib/formatters'
import { useTranslation } from '../i18n'

const ALLOCATION_COLORS = ['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']
const ALLOCATION_KEYS = ['rewardPool', 'foundation', 'ecosystem', 'team', 'liquidity'] as const

export const Tokenomics = () => {
  const { t } = useTranslation()
  const { data } = useTokenomics()

  const allocations = data?.allocations
  const pieData = allocations
    ? ALLOCATION_KEYS.map((key, i) => ({
        name: t(`tokenomics.${key}`),
        value: parseFloat((Number(BigInt(allocations[key])) / 1e18).toFixed(2)),
        fill: ALLOCATION_COLORS[i],
      }))
    : []

  const halvingProgress = data
    ? ((data.halvingInterval - data.blocksUntilHalving) / data.halvingInterval) * 100
    : 0

  const halvingSchedule = [
    { block: 0, reward: '10' },
    { block: 42048000, reward: '5' },
    { block: 84096000, reward: '2.5' },
    { block: 126144000, reward: '1.25' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-heading mb-2">{t('tokenomics.title')}</h1>
        <p className="text-label">{t('tokenomics.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t('tokenomics.blockReward')}
          value={`${data?.blockRewardPLM ?? '10'} PLM`}
          icon={Coins}
        />
        <StatCard
          title={t('tokenomics.rewardPoolBalance')}
          value={`${formatPLM(allocations?.rewardPool ?? '0')} PLM`}
          icon={Wallet}
        />
        <StatCard
          title={t('tokenomics.blocksUntilHalving')}
          value={formatNumber(data?.blocksUntilHalving ?? 0)}
          icon={Timer}
        />
        <StatCard
          title={t('tokenomics.nextHalvingDate')}
          value={data?.nextHalvingEstDate ? new Date(data.nextHalvingEstDate).toLocaleDateString() : '-'}
          icon={TrendingDown}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4 text-heading">{t('tokenomics.supplyBreakdown')}</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={130}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent as number) * 100).toFixed(1)}%`}
                  labelLine={{ stroke: 'var(--color-label)' }}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--chart-tooltip-bg)', border: '1px solid var(--chart-tooltip-border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                  labelStyle={{ color: 'var(--text-secondary)' }}
                  formatter={(value: number) => [`${value.toLocaleString()} PLM`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[350px] flex items-center justify-center text-label">Loading...</div>
          )}
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4 text-heading">{t('tokenomics.halvingTimeline')}</h3>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-label mb-2">
              <span>{t('tokenomics.halvingProgress')}</span>
              <span>{halvingProgress.toFixed(2)}%</span>
            </div>
            <div className="h-3 bg-elevated rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all"
                style={{ width: `${halvingProgress}%` }}
              />
            </div>
          </div>

          <div className="space-y-4">
            {halvingSchedule.map((h, i) => {
              const current = data?.currentBlock ?? 0
              const isPast = current >= h.block
              const isCurrent = i < halvingSchedule.length - 1
                ? current >= h.block && current < halvingSchedule[i + 1].block
                : current >= h.block

              return (
                <div key={i} className={`flex items-center gap-4 p-3 rounded-lg ${isCurrent ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-elevated'}`}>
                  <div className={`h-3 w-3 rounded-full flex-shrink-0 ${isPast ? 'bg-cyan-400' : 'bg-surface-200'}`} />
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${isCurrent ? 'text-cyan-400' : 'text-heading'}`}>
                      {i === 0 ? 'Genesis' : `Halving ${i}`}
                    </p>
                    <p className="text-xs text-label">Block {formatNumber(h.block)}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${isCurrent ? 'text-cyan-400' : 'text-body'}`}>{h.reward} PLM/block</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4 text-heading">{t('tokenomics.keyParameters')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: t('tokenomics.blockTime'), value: '~3s' },
            { label: t('tokenomics.blocksPerEpoch'), value: formatNumber(data?.blocksPerEpoch ?? 1200) },
            { label: t('tokenomics.halvingIntervalLabel'), value: `${formatNumber(data?.halvingInterval ?? 42048000)} blocks (~4yr)` },
            { label: t('tokenomics.genesisSupplyLabel'), value: `${formatNumber(159000000)} PLM` },
            { label: t('tokenomics.currentBlock'), value: formatNumber(data?.currentBlock ?? 0) },
            { label: t('tokenomics.currentEpoch'), value: formatNumber(data?.currentEpoch ?? 0) },
            { label: t('tokenomics.halvingCountLabel'), value: String(data?.halvingCount ?? 0) },
            { label: t('tokenomics.nextHalvingBlock'), value: formatNumber(data?.nextHalvingBlock ?? 42048000) },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-lg bg-elevated">
              <p className="text-xs text-hint mb-1">{item.label}</p>
              <p className="text-lg font-bold text-heading">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Tokenomics
