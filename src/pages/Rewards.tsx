import { useState } from 'react'
import { Award, TrendingUp, Users, ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import StatCard from '../components/StatCard'
import RewardChart from '../components/RewardChart'
import { useEpochs, useRewardFormula, useEpoch } from '../hooks/useRewards'
import { formatNumber, formatPLM, formatAddress } from '../lib/formatters'
import { useTranslation } from '../i18n'

const EpochContributions = ({ epochNum }: { epochNum: number }) => {
  const { t } = useTranslation()
  const { data: epochDetail } = useEpoch(epochNum)

  if (!epochDetail?.contributions?.length) {
    return <p className="text-label text-sm">Loading...</p>
  }

  return (
    <table className="w-full">
      <thead>
        <tr>
          <th className="px-3 py-2 text-left text-xs text-label">Agent</th>
          <th className="px-3 py-2 text-left text-xs text-label">Tasks</th>
          <th className="px-3 py-2 text-left text-xs text-label">Uptime</th>
          <th className="px-3 py-2 text-left text-xs text-label">Score</th>
        </tr>
      </thead>
      <tbody>
        {epochDetail.contributions.map((c, i) => (
          <tr key={i} className="border-t border-theme">
            <td className="px-3 py-2 font-mono text-sm text-body">{formatAddress(c.wallet ?? '', 4)}</td>
            <td className="px-3 py-2 text-sm text-body">{formatNumber(c.taskCount)}</td>
            <td className="px-3 py-2 text-sm text-body">{formatNumber(c.uptimeSeconds / 3600, 1)}h</td>
            <td className="px-3 py-2 text-sm text-body">{formatNumber(c.responseScore)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export const Rewards = () => {
  const { t } = useTranslation()
  const { data: epochsData } = useEpochs()
  const { data: formula } = useRewardFormula()
  const [expandedEpoch, setExpandedEpoch] = useState<number | null>(null)

  const rewardChartData = epochsData
    ? epochsData.filter((e) => e?.number != null).map((epoch) => ({
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
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-heading">
            {t('rewards.recentEpochs')}
          </h3>
          <p className="text-xs text-label">{t('rewards.clickToExpand')}</p>
        </div>
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
              {epochsData?.filter((e) => e?.number != null).slice(0, 10).map((epoch) => {
                const rewardBigInt = BigInt(epoch.reward)
                const avgPerAgent = epoch.agentCount > 0
                  ? rewardBigInt / BigInt(epoch.agentCount)
                  : 0n
                const isExpanded = expandedEpoch === epoch.number

                return (
                  <>
                    <tr
                      key={epoch.number}
                      className="table-row cursor-pointer"
                      onClick={() => setExpandedEpoch(isExpanded ? null : epoch.number)}
                    >
                      <td className="px-6 py-4 text-heading font-medium">
                        <div className="flex items-center gap-2">
                          <ChevronDown
                            size={14}
                            className={`text-label transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          />
                          #{formatNumber(epoch.number)}
                        </div>
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
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.tr
                          key={`expanded-${epoch.number}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <td colSpan={5} className="px-6 py-4 bg-elevated/50">
                            <EpochContributions epochNum={epoch.number} />
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </>
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
