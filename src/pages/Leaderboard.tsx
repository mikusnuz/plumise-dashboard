import { useState } from 'react'
import { Trophy, Award, TrendingUp, Users } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import StatCard from '../components/StatCard'
import { useLeaderboard } from '../hooks/useLeaderboard'
import { formatPLM, formatAddress, formatNumber } from '../lib/formatters'
import { useTranslation } from '../i18n'

type SortKey = 'rank' | 'totalRewardShare' | 'epochCount' | 'totalTaskCount' | 'totalTokensProcessed'

export const Leaderboard = () => {
  const { t } = useTranslation()
  const { data } = useLeaderboard(50)
  const [sortKey, setSortKey] = useState<SortKey>('rank')
  const [sortAsc, setSortAsc] = useState(true)

  const agents = data?.agents ?? []

  const sorted = [...agents].sort((a, b) => {
    let cmp = 0
    if (sortKey === 'rank') cmp = a.rank - b.rank
    else if (sortKey === 'totalRewardShare') cmp = Number(BigInt(a.totalRewardShare) - BigInt(b.totalRewardShare))
    else if (sortKey === 'epochCount') cmp = a.epochCount - b.epochCount
    else if (sortKey === 'totalTaskCount') cmp = a.totalTaskCount - b.totalTaskCount
    else if (sortKey === 'totalTokensProcessed') cmp = Number(BigInt(a.totalTokensProcessed) - BigInt(b.totalTokensProcessed))
    return sortAsc ? cmp : -cmp
  })

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc)
    else { setSortKey(key); setSortAsc(key === 'rank') }
  }

  const sortIndicator = (key: SortKey) => sortKey === key ? (sortAsc ? ' ↑' : ' ↓') : ''

  const totalDistributed = data?.totalDistributed ?? '0'
  const topEarner = agents.length > 0 ? agents[0].totalRewardShare : '0'
  const medianReward = agents.length > 0
    ? agents[Math.floor(agents.length / 2)].totalRewardShare
    : '0'

  const chartData = agents.slice(0, 20).map((a) => ({
    name: formatAddress(a.wallet, 4),
    value: parseFloat((Number(BigInt(a.totalRewardShare)) / 1e18).toFixed(4)),
    wallet: a.wallet,
  }))

  const colors = ['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1', '#f43f5e', '#14b8a6', '#a855f7', '#eab308']

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-heading mb-2">{t('leaderboard.title')}</h1>
        <p className="text-label">{t('leaderboard.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title={t('leaderboard.totalDistributed')} value={`${formatPLM(totalDistributed)} PLM`} icon={Award} />
        <StatCard title={t('leaderboard.rewardedAgents')} value={formatNumber(agents.length)} icon={Users} />
        <StatCard title={t('leaderboard.topEarner')} value={`${formatPLM(topEarner)} PLM`} icon={Trophy} />
        <StatCard title={t('leaderboard.medianReward')} value={`${formatPLM(medianReward)} PLM`} icon={TrendingUp} />
      </div>

      {chartData.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4 text-heading">{t('leaderboard.distributionChart')}</h3>
          <ResponsiveContainer width="100%" height={Math.max(300, chartData.length * 32)}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 30 }}>
              <XAxis type="number" tick={{ fill: 'var(--color-label)', fontSize: 12 }} />
              <YAxis type="category" dataKey="name" width={90} tick={{ fill: 'var(--color-label)', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--chart-tooltip-bg)', border: '1px solid var(--chart-tooltip-border)', borderRadius: '8px' }}
                itemStyle={{ color: 'var(--text-primary)' }}
                labelStyle={{ color: 'var(--text-secondary)' }}
                formatter={(value: number) => [`${value.toLocaleString()} PLM`, t('leaderboard.estimatedReward')]}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={colors[i % colors.length]} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4 text-heading">{t('leaderboard.rankingTable')}</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-elevated border-b border-theme">
              <tr>
                {[
                  { key: 'rank' as SortKey, label: t('leaderboard.rank') },
                  { key: null, label: t('leaderboard.agent') },
                  { key: 'totalRewardShare' as SortKey, label: t('leaderboard.estimatedReward') },
                  { key: 'epochCount' as SortKey, label: t('leaderboard.epochs') },
                  { key: null, label: t('leaderboard.avgPerEpoch') },
                  { key: 'totalTaskCount' as SortKey, label: t('leaderboard.tasks') },
                  { key: 'totalTokensProcessed' as SortKey, label: t('leaderboard.tokens') },
                ].map((col, i) => (
                  <th
                    key={i}
                    className={`px-4 py-3 text-left text-xs font-medium text-label uppercase ${col.key ? 'cursor-pointer hover:text-cyan-400' : ''}`}
                    onClick={() => col.key && handleSort(col.key)}
                  >
                    {col.label}{col.key ? sortIndicator(col.key) : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              {sorted.map((agent) => {
                const avgPerEpoch = agent.epochCount > 0
                  ? BigInt(agent.totalRewardShare) / BigInt(agent.epochCount)
                  : 0n
                return (
                  <tr key={agent.wallet} className="table-row">
                    <td className="px-4 py-3 text-heading font-bold">
                      {agent.rank <= 3 ? ['🥇', '🥈', '🥉'][agent.rank - 1] : `#${agent.rank}`}
                    </td>
                    <td className="px-4 py-3 font-mono text-body text-sm">{formatAddress(agent.wallet, 6)}</td>
                    <td className="px-4 py-3 text-cyan-400 font-mono">{formatPLM(agent.totalRewardShare)} PLM</td>
                    <td className="px-4 py-3 text-body">{formatNumber(agent.epochCount)}</td>
                    <td className="px-4 py-3 text-body font-mono">{formatPLM(avgPerEpoch)} PLM</td>
                    <td className="px-4 py-3 text-body">{formatNumber(agent.totalTaskCount)}</td>
                    <td className="px-4 py-3 text-body font-mono">{formatNumber(Number(agent.totalTokensProcessed))}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Leaderboard
