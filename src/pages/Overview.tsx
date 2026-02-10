import { Users, Award, Zap, TrendingUp } from 'lucide-react'
import StatCard from '../components/StatCard'
import RewardChart from '../components/RewardChart'
import ChallengeCard from '../components/ChallengeCard'
import { useNetworkStats } from '../hooks/useNetworkStats'
import { useEpochs } from '../hooks/useRewards'
import { useCurrentChallenge } from '../hooks/useChallenges'
import { formatNumber } from '../lib/formatters'

export const Overview = () => {
  const { activeAgents, totalAgents, currentEpoch, blockNumber, isLoading } =
    useNetworkStats()
  const { data: currentChallengeData } = useCurrentChallenge()
  const { data: epochsData } = useEpochs()

  const rewardChartData = epochsData
    ? epochsData.slice(0, 24).map((epoch) => ({
        epoch: epoch.number,
        reward: epoch.reward,
      })).reverse()
    : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Network Overview</h1>
        <p className="text-slate-400">
          Real-time statistics for the Plumise AI network
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Agents"
          value={formatNumber(activeAgents)}
          icon={Users}
          loading={isLoading}
          change={`${totalAgents} total`}
        />
        <StatCard
          title="Current Epoch"
          value={formatNumber(currentEpoch)}
          icon={TrendingUp}
          loading={isLoading}
        />
        <StatCard
          title="Block Height"
          value={formatNumber(blockNumber)}
          icon={Zap}
          loading={isLoading}
        />
        <StatCard
          title="Total Agents"
          value={formatNumber(totalAgents)}
          icon={Award}
          loading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {rewardChartData.length > 0 ? (
            <RewardChart data={rewardChartData} />
          ) : (
            <div className="glass-card p-6">
              <p className="text-slate-400 text-center">Loading reward data...</p>
            </div>
          )}
        </div>

        <div>
          {currentChallengeData ? (
            <ChallengeCard challenge={currentChallengeData} />
          ) : (
            <div className="glass-card p-6">
              <p className="text-slate-400 text-center">Loading challenge...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Overview
