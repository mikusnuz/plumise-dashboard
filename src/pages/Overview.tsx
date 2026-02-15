import { Users, Award, Zap, TrendingUp } from 'lucide-react'
import StatCard from '../components/StatCard'
import RewardChart from '../components/RewardChart'
import ThroughputChart from '../components/ThroughputChart'
import ChallengeCard from '../components/ChallengeCard'
import { RealtimeBlockFeed } from '../components/RealtimeBlockFeed'
import { useNetworkStats } from '../hooks/useNetworkStats'
import { useEpochs } from '../hooks/useRewards'
import { useCurrentChallenge } from '../hooks/useChallenges'
import { useRealtimeEvents } from '../hooks/useRealtimeEvents'
import { useThroughput } from '../hooks/useThroughput'
import { formatNumber } from '../lib/formatters'
import { useTranslation } from '../i18n'

export const Overview = () => {
  const { t } = useTranslation()
  const { activeAgents, totalAgents, currentEpoch, blockNumber, isLoading, isError, isStale, lastUpdated } =
    useNetworkStats()
  const { data: currentChallengeData } = useCurrentChallenge()
  const { data: epochsData } = useEpochs()
  const { data: throughputData } = useThroughput()

  useRealtimeEvents()

  const rewardChartData = epochsData
    ? epochsData.filter((e) => e?.number != null).slice(0, 24).map((epoch) => ({
        epoch: epoch.number,
        reward: epoch.reward,
      })).reverse()
    : []

  const throughputChartData = throughputData
    ? throughputData.filter((d) => d?.epoch != null).slice().reverse()
    : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-heading mb-2">{t('overview.title')}</h1>
        <p className="text-label">
          {t('overview.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t('overview.activeAgents')}
          value={formatNumber(activeAgents)}
          icon={Users}
          loading={isLoading}
          change={t('overview.totalSuffix', { count: totalAgents })}
          isStale={isStale}
          isError={isError}
          lastUpdated={lastUpdated}
        />
        <StatCard
          title={t('overview.currentEpoch')}
          value={formatNumber(currentEpoch)}
          icon={TrendingUp}
          loading={isLoading}
          isStale={isStale}
          isError={isError}
          lastUpdated={lastUpdated}
        />
        <StatCard
          title={t('overview.blockHeight')}
          value={formatNumber(blockNumber)}
          icon={Zap}
          loading={isLoading}
          isStale={isStale}
          isError={isError}
          lastUpdated={lastUpdated}
        />
        <StatCard
          title={t('overview.totalAgents')}
          value={formatNumber(totalAgents)}
          icon={Award}
          loading={isLoading}
          isStale={isStale}
          isError={isError}
          lastUpdated={lastUpdated}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {rewardChartData.length > 0 ? (
            <RewardChart data={rewardChartData} />
          ) : (
            <div className="glass-card p-6">
              <p className="text-label text-center">{t('overview.loadingReward')}</p>
            </div>
          )}
          {throughputChartData.length > 0 && (
            <ThroughputChart data={throughputChartData} />
          )}
          <RealtimeBlockFeed />
        </div>

        <div>
          {currentChallengeData ? (
            <ChallengeCard challenge={currentChallengeData} />
          ) : (
            <div className="glass-card p-6">
              <p className="text-label text-center">{t('overview.loadingChallenge')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Overview
