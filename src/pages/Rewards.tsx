import { Award, TrendingUp, Users } from 'lucide-react'
import StatCard from '../components/StatCard'
import RewardChart from '../components/RewardChart'
import { useEpochs, useRewardFormula } from '../hooks/useRewards'
import { formatNumber, formatPLM } from '../lib/formatters'
import { useTranslation } from '../i18n'

export const Rewards = () => {
  const { t } = useTranslation()
  const { data: epochsData } = useEpochs()
  const { data: formula } = useRewardFormula()

  const rewardChartData = epochsData
    ? epochsData.map((epoch) => ({
        epoch: epoch.number,
        reward: epoch.reward,
      })).reverse()
    : []

  const totalDistributed = rewardChartData.reduce(
    (sum, item) => sum + BigInt(item.reward),
    0n
  )

  const avgReward =
    rewardChartData.length > 0
      ? totalDistributed / BigInt(rewardChartData.length)
      : 0n

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-heading mb-2">{t('rewards.title')}</h1>
        <p className="text-label">
          {t('rewards.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title={t('rewards.totalDistributed')}
          value={`${formatPLM(totalDistributed)} PLM`}
          icon={Award}
        />
        <StatCard
          title={t('rewards.avgPerEpoch')}
          value={`${formatPLM(avgReward)} PLM`}
          icon={TrendingUp}
        />
        <StatCard
          title={t('rewards.epochsTracked')}
          value={formatNumber(rewardChartData.length)}
          icon={Users}
        />
      </div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4 text-heading">{t('rewards.formulaTitle')}</h3>
        <p className="text-sm text-label mb-4">
          {t('rewards.formulaDesc')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20">
            <p className="text-sm text-cyan-400 mb-2">{t('rewards.taskCompletion')}</p>
            <p className="text-3xl font-bold text-heading">
              {formula?.task ?? 50}%
            </p>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20">
            <p className="text-sm text-purple-400 mb-2">{t('rewards.uptime')}</p>
            <p className="text-3xl font-bold text-heading">
              {formula?.uptime ?? 30}%
            </p>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-pink-500/10 to-pink-500/5 border border-pink-500/20">
            <p className="text-sm text-pink-400 mb-2">{t('rewards.responseQuality')}</p>
            <p className="text-3xl font-bold text-heading">
              {formula?.response ?? 20}%
            </p>
          </div>
        </div>
      </div>

      {rewardChartData.length > 0 ? (
        <RewardChart data={rewardChartData} />
      ) : (
        <div className="glass-card p-6">
          <p className="text-label text-center">{t('rewards.loadingHistory')}</p>
        </div>
      )}

      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4 text-heading">
          {t('rewards.recentEpochs')}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-elevated border-b border-theme">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-label uppercase">
                  {t('rewards.epoch')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-label uppercase">
                  {t('rewards.totalReward')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-label uppercase">
                  {t('rewards.agents')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-label uppercase">
                  {t('rewards.avgPerAgent')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-label uppercase">
                  {t('rewards.status')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              {epochsData?.slice(0, 10).map((epoch) => {
                const rewardBigInt = BigInt(epoch.reward)
                const avgPerAgent = epoch.agentCount > 0
                  ? rewardBigInt / BigInt(epoch.agentCount)
                  : 0n

                return (
                  <tr key={epoch.number} className="table-row">
                    <td className="px-6 py-4 text-heading font-medium">
                      #{formatNumber(epoch.number)}
                    </td>
                    <td className="px-6 py-4 text-cyan-400 font-mono">
                      {formatPLM(epoch.reward)} PLM
                    </td>
                    <td className="px-6 py-4 text-body">
                      {formatNumber(epoch.agentCount)}
                    </td>
                    <td className="px-6 py-4 text-body font-mono">
                      {formatPLM(avgPerAgent)} PLM
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={
                          epoch.distributed ? 'badge-success' : 'badge-warning'
                        }
                      >
                        {epoch.distributed ? t('rewards.distributed') : t('rewards.pending')}
                      </span>
                    </td>
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

export default Rewards
